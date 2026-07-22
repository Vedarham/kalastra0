import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Upload,
  Play,
  Pause,
  ImageIcon,
  Sparkles,
  Volume2,
  CheckCircle,
  Clock,
  CircleX,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { generateAIListing } from "@/api/product";

interface AudioListingFormProps {
  onBack: () => void;
  onEditManual?: (data: any) => void;
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "gu", name: "ગુજરાતી (Gujarati)" },
];

const QUESTIONS_BY_LANG: Record<string, string[]> = {
  en: [
    "What is the name or title of your product?",
    "Can you describe what your product is and what makes it special?",
    "What materials or ingredients are used in making this product?",
    "What is the price you'd like to set for this item?",
    "How many of these items do you have available?",
    "What category would this product fit into?",
    "Are there any special care instructions or usage tips?",
    "What makes your product unique compared to similar items?",
  ],
  hi: [
    "आपके उत्पाद का नाम या शीर्षक क्या है?",
    "क्या आप बता सकते हैं कि आपका उत्पाद क्या है और इसे क्या खास बनाता है?",
    "इस उत्पाद को बनाने में किस सामग्री का उपयोग किया गया है?",
    "आप इस वस्तु के लिए क्या कीमत तय करना चाहेंगे?",
    "आपके पास इस वस्तु की कितनी मात्रा उपलब्ध है?",
    "यह उत्पाद किस श्रेणी में फिट होगा?",
    "क्या कोई विशेष देखभाल निर्देश या उपयोग के सुझाव हैं?",
    "समान उत्पादों की तुलना में आपका उत्पाद क्या अद्वितीय बनाता है?"
  ],
  ta: [
    "உங்கள் தயாரிப்பின் பெயர் அல்லது தலைப்பு என்ன?",
    "உங்கள் தயாரிப்பு என்ன மற்றும் அதன் சிறப்பு என்ன என்பதை விவரிக்க முடியுமா?",
    "இந்த தயாரிப்பை தயாரிக்க என்ன பொருட்கள் பயன்படுத்தப்படுகின்றன?",
    "இந்த உருப்படிக்கு நீங்கள் என்ன விலை நிர்ணயிக்க விரும்புகிறீர்கள்?",
    "இந்த பொருட்களில் எத்தனை உங்களிடம் உள்ளன?",
    "இந்த தயாரிப்பு எந்த வகைக்கு பொருந்தும்?",
    "ஏதேனும் சிறப்பு பராமரிப்பு வழிமுறைகள் அல்லது பயன்பாட்டு உதவிக்குறிப்புகள் உள்ளதா?",
    "ஒரே மாதிரியான பொருட்களுடன் ஒப்பிடும்போது உங்கள் தயாரிப்பை தனித்துவமாக்குவது எது?"
  ],
  te: [
    "మీ ఉత్పత్తి పేరు లేదా శీర్ศిక ఏమిటి?",
    "మీ ఉత్పత్తి ఏమిటి మరియు దానిని ప్రత్యేకంగా చేసేది ఏమిటో వివరించగలరా?",
    "ఈ ఉత్పత్తిని తయారు చేయడంలో ఏ పదార్థాలను ఉపయోగించారు?",
    "ఈ వస్తువుకు మీరు ఎంత ధర నిర్ణయించాలనుకుంటున్నారు?",
    "మీ వద్ద ఈ వస్తువులు ఎన్ని అందుబాటులో ఉన్నాయి?",
    "ఈ ఉత్పత్తి ఏ వర్గంలోకి సరిపోతుంది?",
    "ఏదైనా ప్రత్యేక సంరక్షణ సూచనలు లేదా వినియోగ చిట్కాలు ఉన్నాయా?",
    "సారూప్య వస్తువులతో పోలిస్తే మీ ఉత్పత్తిని ఏది ప్రత్యేకంగా చేస్తుంది?"
  ],
  kn: [
    "ನಿಮ್ಮ ಉತ್ಪನ್ನದ ಹೆಸರು ಅಥವಾ ಶೀರ್ಷಿಕೆ ಏನು?",
    "ನಿಮ್ಮ ಉತ್ಪನ್ನ ಏನಾಗಿದೆ ಮತ್ತು ಅದನ್ನು ವಿಶೇಷವಾಗಿಸುವುದು ಯಾವುದು ಎಂದು ವಿವರಿಸಬಹುದೇ?",
    "ಈ ಉತ್ಪನ್ನವನ್ನು ತಯಾರಿಸಲು ಯಾವ ವಸ್ತುಗಳನ್ನು ಬಳಸಲಾಗುತ್ತದೆ?",
    "ಈ ವಸ್ತುವಿಗೆ ನೀವು ಯಾವ ಬೆಲೆಯನ್ನು ನಿಗದಿಪಡಿಸಲು ಬಯಸುತ್ತೀರಿ?",
    "ಈ ವಸ್ತುಗಳ ಪೈಕಿ ಎಷ್ಟು ಲಭ್ಯವಿದೆ?",
    "ಈ ಉತ್ಪನ್ನವು ಯಾವ ವರ್ಗಕ್ಕೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ?",
    "ಏನಾದರೂ ವಿಶೇಷ ಕಾಳಜಿ ಸೂಚನೆಗಳು ಅಥವಾ ಬಳಕೆಯ ಸಲಹೆಗಳು ಇವೆಯೇ?",
    "ಇತರ ಉತ್ಪನ್ನಗಳಿಗೆ ಹೋಲಿಸಿದರೆ ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಅನನ್ಯವಾಗಿಸುವುದು ಯಾವುದು?"
  ],
  bn: [
    "আপনার পণ্যটির নাম বা শিরোনাম কি?",
    "আপনার পণ্যটি কি এবং কি এটিকে বিশেষ করে তুলেছে তা কি বর্ণনা করতে পারেন?",
    "এই পণ্যটি তৈরিতে কি কি উপকরণ ব্যবহার করা হয়েছে?",
    "আপনি এই পণ্যটির জন্য কি দাম নির্ধারণ করতে চান?",
    "আপনার কাছে এই পণ্যটির কতটি স্টক আছে?",
    "এই পণ্যটি কোন বিভাগের অন্তর্গত হবে?",
    "কোন বিশেষ যত্ন নির্দেশাবলী বা ব্যবহারের টিপস আছে কি?",
    "অনুরূপ পণ্যগুলির তুলনায় আপনার পণ্যটিকে কোনটি অনন্য করে তোলে?"
  ],
  mr: [
    "तुमच्या उत्पादनाचे नाव किंवा शीर्षक काय आहे?",
    "तुमचे उत्पादन काय आहे आणि ते कशामुळे खास बनते याचे वर्णन करू शकता का?",
    "हे उत्पादन बनवण्यासाठी कोणत्या साहित्याचा वापर केला गेला आहे?",
    "या वस्तूसाठी तुम्हाला काय किंमत ठेवायला आवडेल?",
    "तुमच्याकडे या वस्तू किती प्रमाणात उपलब्ध आहेत?",
    "हे उत्पादन कोणत्या श्रेणीमध्ये बसेल?",
    "काही विशेष काळजी घेण्याच्या सूचना किंवा वापरण्याच्या टिप्स आहेत का?",
    "इतर समान वस्तूंच्या तुलनेत तुमचे उत्पादन कशामुळे वेगळे ठरते?"
  ],
  gu: [
    "તમારા ઉત્પાદનનું નામ કે શીર્ષક શું છે?",
    "તમારું ઉત્પાદન શું છે અને તેને શું ખાસ બનાવે છે તેનું વર્ણન કરી શકો છો?",
    "આ ઉત્પાદન બનાવવા માટે કઈ સામગ્રીનો ઉપયોગ કરવામાં આવ્યો છે?",
    "આ વસ્તુ માટે તમે કેટલી કિંમત નક્કી કરવા માંગો છો?",
    "તમારી પાસે આ વસ્તુની કેટલી સંખ્યા ઉપલબ્ધ છે?",
    "આ ઉત્પાદન કઈ કેટેગરીમાં બંધબેસશે?",
    "શું કોઈ ખાસ કાળજી રાખવાની સૂચનાઓ કે ઉપયોગની ટીપ્સ છે?",
    "સમાન વસ્તુઓની સરખામણીમાં તમારું ઉત્પાદન શું અનોખું બનાવે છે?"
  ]
};

export default function AudioListingForm({ onBack, onEditManual }: AudioListingFormProps) {
  const { toast } = useToast();
  interface GeneratedData {
    title: string;
    description: string;
    price: string;
    quantity?: number;
    category: string;
    seoTags: string[];
    reachChance: string | number;
  }
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const questions = QUESTIONS_BY_LANG[selectedLanguage] || QUESTIONS_BY_LANG.en;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{ [key: number]: Blob }>({});
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
  const [images, setImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      Object.values(recordings).forEach((blob) => {
        URL.revokeObjectURL(URL.createObjectURL(blob));
      });
      images.forEach((img) => {
        URL.revokeObjectURL(URL.createObjectURL(img));
      });
    };
  }, []);

  // Reset current question index when language switches, just in case
  useEffect(() => {
    setCurrentQuestion(0);
  }, [selectedLanguage]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setRecordings((prev) => ({ ...prev, [currentQuestion]: blob }));
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const playRecording = (questionIndex: number) => {
    const recording = recordings[questionIndex];
    if (recording) {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      audioRef.current = new Audio(URL.createObjectURL(recording));
      audioRef.current.play();
      setIsPlaying((prev) => ({ ...prev, [questionIndex]: true }));

      audioRef.current.onended = () => {
        setIsPlaying((prev) => ({ ...prev, [questionIndex]: false }));
      };
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files].slice(0, 5));
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const processWithAI = async () => {
    setIsProcessing(true);
    const formData = new FormData();

    Object.entries(recordings).forEach(([questionIndex, blob]) => {
      formData.append(
        `audio_question_${questionIndex}`,
        blob,
        `question_${questionIndex}.webm`
      );
    });

    formData.append("language", selectedLanguage);

    images.forEach((image, index) => {
      formData.append(`image_${index}`, image, image.name);
    });

    try {
      const data = await generateAIListing(formData);

      if (!data || !data.aiRaw) {
        throw new Error("Invalid AI response");
      }

      setGeneratedData(data.aiRaw);
      toast({
        title: "Product Created! 🎉",
        description: "AI has successfully generated and published your listing.",
      });
    } catch (error) {
      console.error("Error processing with AI:", error);
      toast({
        title: "Generation Failed",
        description: "Something went wrong while processing your audio.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const allQuestionsAnswered =
    Object.keys(recordings).length === questions.length;
  const hasImages = images.length > 0;
  const canProcess = allQuestionsAnswered && hasImages;

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Options
        </Button>
        <h2 className="text-2xl font-bold">Voice + AI Magic</h2>
      </div>

      {!generatedData ? (
        <div className="space-y-6">
          {/* Language Selector */}
          <Card>
            <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-base">Select Spoken Language</h3>
                <p className="text-xs text-muted-foreground">Select the language you will speak in so speech-to-text transcribes correctly.</p>
              </div>
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full sm:w-48 p-2 rounded border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-primary"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Object.keys(recordings).length} / {questions.length}{" "}
                  questions
                </span>
              </div>
              <Progress
                value={
                  (Object.keys(recordings).length / questions.length) * 100
                }
              />
            </CardContent>
          </Card>

          {/* Current Question */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Question {currentQuestion + 1} of {questions.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-lg font-medium">
                  {questions[currentQuestion]}
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                {!recordings[currentQuestion] ? (
                  <Button
                    size="lg"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-5 w-5 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Recorded
                    </Badge>
                    <Button
                      variant="outline"
                      onClick={() => playRecording(currentQuestion)}
                      disabled={isPlaying[currentQuestion]}
                    >
                      {isPlaying[currentQuestion] ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Playing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Play Back
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Re-record
                    </Button>
                  </div>
                )}
              </div>

              {isRecording && (
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2 text-red-500">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Recording...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestion(Math.max(0, currentQuestion - 1))
              }
              disabled={currentQuestion === 0}
            >
              Previous Question
            </Button>
            <Button
              onClick={() =>
                setCurrentQuestion(
                  Math.min(questions.length - 1, currentQuestion + 1)
                )
              }
              disabled={currentQuestion === questions.length - 1}
            >
              Next Question
            </Button>
          </div>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload images for AI analysis
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="audio-image-upload"
                  max={5}
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("audio-image-upload")?.click()
                  }
                >
                  Choose Images ({images.length}/5)
                </Button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`Product ${index + 1}`}
                        className="relative w-full h-20 object-cover rounded border"
                      />
                      <Button
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 text-[1px]"
                      ><CircleX /></Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Process Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                size="lg"
                className="w-full"
                onClick={processWithAI}
                disabled={!canProcess || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    AI is Creating Your Listing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Listing with AI
                  </>
                )}
              </Button>

              {!canProcess && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  {!allQuestionsAnswered && "Please answer all questions"}
                  {!allQuestionsAnswered && !hasImages && " and "}
                  {!hasImages && "upload at least one image"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Generated Results */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-500" />
                AI Generated Listing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Title</h3>
                <p className="text-lg">{generatedData.title || (generatedData as any).Title}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p>{generatedData.description || (generatedData as any).Description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Price</h3>
                  <p className="text-lg font-bold text-green-600">
                    {generatedData.price || (generatedData as any).Price}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quantity</h3>
                  <p>{generatedData.quantity || (generatedData as any).Quantity || 100} available</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Category</h3>
                <Badge variant="outline">{generatedData.category || (generatedData as any).Category}</Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">SEO Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {(generatedData.seoTags || []).map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">SEO Score</h3>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {generatedData.reachChance}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex-1" onClick={onBack}>
              Finish & View
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => onEditManual?.(generatedData)}
            >
              Edit Details
            </Button>
            <Button className="flex-1" size="lg" onClick={onBack}>
              Create Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
