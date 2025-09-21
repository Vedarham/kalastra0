// import speech from "@google-cloud/speech";

// const client = new speech.SpeechClient();

// export const transcribeAudio = async (gcsUri) => {
//   const [response] = await client.recognize({
//     audio: { uri: gcsUri },
//     config: { languageCode: "en-US" },
//   });

//   return response.results.map(r => r.alternatives[0].transcript).join(" ");
// };
