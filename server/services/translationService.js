export const translateText = async (text, targetLang = "en") => {
  if (!text || text.trim() === "") return "";
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`Google Translate responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data[0]) {
      const translatedParts = data[0].map(segment => segment[0]).filter(Boolean);
      return translatedParts.join("");
    }
    return text;
  } catch (error) {
    console.error("🛑 Google Translation error:", error);
    return text;
  }
};
