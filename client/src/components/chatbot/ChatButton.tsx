import { BotMessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            size="lg"
            className={`
              w-16 h-16 rounded-full shadow-featured
              bg-primary hover:bg-primary-glow
              transition-all duration-300 ease-out
              ${isOpen ? 'scale-110 rotate-90' : 'hover:scale-105'}
            `}
          >
            
            <BotMessageSquare className="text-primary-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="mr-4">
          <p>Need help? Ask me about products!</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}