import { useState } from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, Mic, Image, Sparkles } from "lucide-react";
import ManualListingForm from "./ManualListingForm";
import AudioListingForm from "./AudioListingForm";

export default function SellOptionsDialog() {
  const [currentView, setCurrentView] = useState<'options' | 'manual' | 'audio'>('options');

  if (currentView === 'manual') {
    return (
      <DialogContent className="sm:max-w-4xl">
        <ManualListingForm onBack={() => setCurrentView('options')} />
      </DialogContent>
    );
  }

  if (currentView === 'audio') {
    return (
      <DialogContent className="sm:max-w-3xl">
        <AudioListingForm onBack={() => setCurrentView('options')} />
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-center">
          How would you like to create your listing?
        </DialogTitle>
        <DialogDescription className="text-center text-muted-foreground">
          Choose the method that works best for you
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Manual Creation Option */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
          onClick={() => setCurrentView('manual')}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <PenTool className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Manual Creation</CardTitle>
            <CardDescription>
              Create your listing step by step with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>AI-powered writing suggestions</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Image className="w-4 h-4 text-primary" />
                <span>Upload multiple images</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <PenTool className="w-4 h-4 text-primary" />
                <span>Full control over details</span>
              </div>
            </div>
            <Button className="w-full" size="lg">
              Start Creating
            </Button>
          </CardContent>
        </Card>

        {/* Audio + AI Option */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
          onClick={() => setCurrentView('audio')}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mic className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Voice + AI Magic</CardTitle>
            <CardDescription>
              Describe your product and let AI create the listing
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mic className="w-4 h-4 text-primary" />
                <span>Voice description recording</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Image className="w-4 h-4 text-primary" />
                <span>Auto image analysis</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>AI generates everything</span>
              </div>
            </div>
            <Button className="w-full" size="lg" variant="outline">
              Try Voice Method
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Both methods create professional listings that attract buyers
        </p>
      </div>
    </DialogContent>
  );
}