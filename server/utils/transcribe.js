import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export const transcribeAudio = async (audioBuffer, language = "en") => {
  try {
    const { result } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
      model: "nova", 
      smart_format: true,
      language: language,
    });

    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;

    return transcript || "";
  } catch (err) {
    console.error("🛑 Deepgram transcription error:", err);
    return "";
  }
};
