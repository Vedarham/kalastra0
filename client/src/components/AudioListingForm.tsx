import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";

interface AudioListingFormProps {
  onBack: () => void;
}

const questions = [
  "What is the name or title of your product?",
  "Can you describe what your product is and what makes it special?",
  "What materials or ingredients are used in making this product?",
  "What is the price you'd like to set for this item?",
  "How many of these items do you have available?",
  "What category would this product fit into?",
  "Are there any special care instructions or usage tips?",
  "What makes your product unique compared to similar items?",
];

export default function AudioListingForm({ onBack }: AudioListingFormProps) {
   interface GeneratedData {
    Title: string;
    Description: string;
    Price: string;
    Quantity?: number;
    Category: string;
    SEO_Tags: string[];
    Reach_Chance: string;
  }
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{ [key: number]: Blob }>({});
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
  const [images, setImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
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
        `question_${questionIndex}.wav`
      );
    });

    images.forEach((image, index) => {
      formData.append(`image_${index}`, image, image.name);
    });

    try {
      const response = await fetch(
        "api/products/ai-generate-listing",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedData(data);
    } catch (error) {
      console.error("Error processing with AI:", error);
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
                <p className="text-lg">{generatedData.Title}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p>{generatedData.Description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Price</h3>
                  <p className="text-lg font-bold text-green-600">
                    {generatedData.Price}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quantity</h3>
                  <p>{generatedData.Quantity || 100} available</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Category</h3>
                <Badge variant="outline">{generatedData.Category}</Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">SEO Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedData.SEO_Tags.map((tag: string, index: number) => (
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
                  {generatedData.Reach_Chance}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1">
              Edit Manually
            </Button>
            <Button className="flex-1" size="lg">
              Publish Listing
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
