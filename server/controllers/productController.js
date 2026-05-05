import Product from "../models/Product.model.js";
import cloudinary from "../config/cloudinary.js";
import { enrichProduct } from "../services/geminiService.js";
import { transcribeAudio } from "../utils/transcribe.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js"

export const getProducts = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;

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
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields required" });
    }
    const aiResult = await enrichProduct(`${name} ${description}`);
    
    let images = [];
    if (req.files?.length) {
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

    const product = await Product.create({
      name: aiResult?.title || name,
      description: aiResult?.description || description,
      price,
      category,
      artisan: req.user.id,
      tags: aiResult?.tags || [],
      seoTip: aiResult?.seoTip || "Optimize tags for more reach",
      images
    });

    res.status(201).json({ 
      success: true, 
      product, 
      aiSuggestions: aiResult,
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

    if (!audioFiles.length){
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

    if (!aiResponse?.title || !aiResponse?.description) {
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

    const product = await Product.create({
      name: aiResponse.title,
      description: aiResponse.description,
      price: aiResponse.price || 0,
      category: aiResponse.category || "Other",
      artisan: req.user.id,
      images,
      tags: aiResponse.tags || [],
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

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, removeImages } = req.body;

    const product = await Product.findById(id);

    if (!product || !product.isActive) {
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
      isActive: true,
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

    if (product.artisan.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    // Soft delete
    product.isActive = false;
    await product.save();

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