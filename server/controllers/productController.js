import Product from "../models/Product.model.js";
import { enrichProduct } from "../services/geminiService.js";
import { transcribeAudio } from "../utils/transcribe.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("createdBy", "name");
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createManualProduct = async (req, res) => {
  try {
    const { title, description, price, type } = req.body;
    const aiResult = await enrichProduct(`${title} ${description}`);
    const product = await Product.create({
      title: aiResult.title || title,
      description: aiResult.description || description,
      price,
      type,
      createdBy: req.user._id,
      tags: aiResult.tags || [],
      seoTip: aiResult.seoTip || "Optimize tags for more reach",
    });

    res.status(201).json({ success: true, product, aiSuggestions: aiResult });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAIProduct = async (req, res) => {
  try {
    const files = req.files || {};
    const audioFiles = Object.entries(files)
      .filter(([key]) => key.startsWith("audio_question_"))
      .map(([, val]) => val[0]);

    const imageFiles = Object.entries(files)
      .filter(([key]) => key.startsWith("image_"))
      .map(([, val]) => val[0]);

    if (audioFiles.length === 0) {
      return res.status(400).json({ success: false, message: "No audio uploaded" });
    }

    const transcribedResponses = await Promise.all(
      audioFiles.map(file => transcribeAudio(file.buffer)) // STT logic
    );
    const combinedText = transcribedResponses.join("\n");
    // console.log("Transcribed:", combinedText);
    const aiResponse = await enrichProduct(combinedText); 
    // console.log("Gemini AI Response:", aiResponse);
    return res.status(201).json({
      success: true,
      aiGenerated: true,
      ...aiResponse,
    });
  } catch (error) {
    console.error(" Error in creating Product:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};