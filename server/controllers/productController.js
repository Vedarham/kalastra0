import Product from "../models/Product.model.js";
import cloudinary from "../config/cloudinary.js";
import { enrichProduct } from '../services/aiService.js';
import { transcribeAudio } from "../utils/transcribe.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js"

export const getProducts = async (req, res) => {
  try {
    const { category, page = 1, limit = 10, q } = req.query;

    const query = { isActive: true };

    if (category) query.category = new RegExp(`^${category}$`, "i");

    if (q && q.trim()) {
      // Escape special regex characters to prevent ReDoS
      const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escaped, "i");
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { seoTags: searchRegex },
      ];
    }

    const products = await Product.find(query)
      .populate("artisan", "shopName name avatar")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("artisan", "name shopName avatar rating");

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createManualProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, reachChance } = req.body;
    let seoTags = [];
    try {
      if (req.body.seoTags) seoTags = JSON.parse(req.body.seoTags);
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Invalid format. seoTags must be a JSON array of strings."
      });
    }

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, description, price, and category are required."
      });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      images = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer);
          return {
            url: result.secure_url,
            publicId: result.public_id,
          };
        })
      );
    }

    const parsedQuantity = quantity ? Number(quantity) : 1;

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      artisan: req.user.id,
      images,
      quantity: parsedQuantity,
      stock: parsedQuantity,
      seoTags,
      reachChance: reachChance ? Number(reachChance) : undefined,
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createAIProduct = async (req, res) => {
  try {
    const files = req.files || {};
    const audioFiles = Object.entries(files)
      .filter(([key]) => key.startsWith("audio_question_"))
      .map(([, val]) => val[0]);

    if (!audioFiles.length) {
      return res.status(400).json({
        success: false,
        message: "No audio uploaded"
      });
    }

    // STT Transcription
    const transcribedResponses = await Promise.all(
      audioFiles.map(file => transcribeAudio(file.buffer))
    );

    const combinedText = transcribedResponses.join("\n");
    // console.log("Transcribed:", combinedText);
    const aiResponse = await enrichProduct(combinedText);
    // console.log("Gemini AI Response:", aiResponse);

    const title = aiResponse?.Title || aiResponse?.title;
    const description = aiResponse?.Description || aiResponse?.description;

    if (!title || !description) {
      return res.status(500).json({
        success: false,
        message: "AI failed to generate product",
      });
    }

    const imageFiles = Object.entries(files)
      .filter(([key]) => key.startsWith("image_"))
      .map(([, val]) => val[0]);

    const images = await Promise.all(
      imageFiles.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer)
        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      })
    );

    const ai = aiResponse;
    const category = ai.Category || ai.category;
    const seoTags = ai.seoTags || ai.SEO_Tags || ai.seo_tags || ai.tags;
    const reachChance = ai.reachChance || ai.Reach_Chance || ai.reach_chance;

    const product = await Product.create({
      name: ai.title || ai.Title || ai.Name || ai.name,
      description: ai.description || ai.Description,
      price: ai.price || ai.Price || 0,
      category: category || "Other",
      artisan: req.user.id,
      images,
      seoTags: seoTags || [],
      reachChance: parseFloat(reachChance || "0"),
    });

    return res.status(201).json({
      success: true,
      aiGenerated: true,
      product,
      aiRaw: aiResponse,
    });
  } catch (error) {
    console.error(" Error in creating Product:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const enrichProductData = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Text is required for AI enrichment" 
      });
    }
    const aiResult = await enrichProduct(text);
    res.status(200).json({ success: true, aiResult });
  } catch (error) {
    console.error("AI Enrichment Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to enrich product information" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, removeImages } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.artisan.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (removeImages?.length) {
      await Promise.all(
        removeImages.map(async (publicId) => {
          await cloudinary.uploader.destroy(publicId);
        })
      );

      product.images = product.images.filter(
        (img) => !removeImages.includes(img.publicId)
      );
    }

    if (req.files?.length) {
      const newImages = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer);
          return {
            url: result.secure_url,
            publicId: result.public_id,
          };
        })
      );

      product.images.push(...newImages);
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    if (stock !== undefined) {
      product.stock = Number(stock);
    }
    
    if (req.body.isActive !== undefined) {
      product.isActive = req.body.isActive === 'true' || req.body.isActive === true;
      product.status = product.isActive ? 'active' : 'discontinued';
    }

    await product.save();

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({
      category,
      isActive: true,
    }).populate("artisan", "name shopName avatar");

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      artisan: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if ( product.artisan.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    // Delete associated images from Cloudinary
    if (product.images?.length) {
      await Promise.all(
        product.images.map(async (img) => {
          if (img.publicId) {
            await cloudinary.uploader.destroy(img.publicId);
          }
        })
      );
    }

    // Hard delete
    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};