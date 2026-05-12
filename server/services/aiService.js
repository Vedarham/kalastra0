import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const enrichProduct = async (inputText) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", 
      messages: [
        {
          role: "system",
          content: `You are an expert e-commerce SEO assistant. 
          You MUST output ONLY a valid JSON object. Do not include markdown formatting, conversational text, or explanations.
          
          Your JSON must exactly match this structure:
          {
            "title": "A short, catchy product title",
            "description": "A rich, engaging product description",
            "price": 999,
            "seoTags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
            "reachChance": 35,
            "category": "Jewelry"
          }
          
          Constraint: The "category" field MUST be exactly one of the following strings: Jewelry, Pottery, Textiles, Woodwork, Metalwork, Glass, Leather, Paper Crafts, Home Decor, Art, Clothing, Accessories, Toys, Other.`
        },
        {
          role: "user",
          content: `Analyze this raw product information and generate the enriched JSON: "${inputText}"`
        }
      ],
      temperature: 0.5,
      response_format: { type: "json_object" }, 
    });

    const aiOutput = response.choices[0]?.message?.content;
    return JSON.parse(aiOutput);

  } catch (error) {
    console.error("Groq AI Enrichment Error:", error);
    throw new Error("Failed to enrich product information via AI.");
  }
};