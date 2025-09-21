import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const enrichProduct = async (inputText) => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
      }, });

  const prompt = `
    Generate only a concise and enriched product description based on the following input. 
    Do not include suggestions, notes, headers, formatting descriptions or any content other than the final description. 
    Analyze this product info: "${inputText}". 
    
    Output the following fields:
    1. Title: A short, catchy product title.
    2. Description: A rich, engaging product description.
    3. Price: Suggested price range in INR.
    4. SEO_Tags: An array of 6 SEO tags.
    5. SEO_Tip: to increase reach.
    6. Reach_Chance: Percentage increase in reach with SEO optimization, must be realistic number.
    7. Category: The most relevant category for this product from the following options - ['Art', 'Crafts', 'Jewelry', 'Clothing', 'Home Decor', 'Toys', 'Books', 'Music', 'Electronics', 'Furniture'].
  `;

  // Extraction of relevant parts from Gemini response

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const enrichedData = JSON.parse(text);
    return enrichedData;
  } catch (error) {
    console.error("Error generating content:", error);
    return { error: "Failed to enrich product information." };
  }
};

// export const enrichProduct = async (inputText) => {
//   const prompt = `
//   Analyze this info: "${inputText}".
//   Generate:
//   - A rich description
//   - One SEO growth tip
//   `;

//   try {
//     const result = await genAI.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     // ✅ Safely extract text
//     const text =
//       result.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "⚠️ No text generated";

//     console.log("Gemini output:", text);
//     return { raw: text };
//   } catch (error) {
//     console.error("Error generating content:", error);
//     return { error: "Failed to enrich product information." };
//   }
// };