
import { Question } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Check, X, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ListeningQuestionProps {
  question: Question;
  userAnswer: string;
  isCompleted: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  onChange: (questionId: string, answer: string) => void;
}

export const ListeningQuestion = ({ 
  question, 
  userAnswer, 
  isCompleted, 
  isCorrect,
  isIncorrect,
  onChange 
}: ListeningQuestionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlayAudio = () => {
    if (question.audioUrl) {
      setIsPlaying(true);
      const audio = new Audio(question.audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.play().catch(error => {
        console.error('Failed to play audio:', error);
        setIsPlaying(false);
      });
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <Button
          type="button"
          onClick={handlePlayAudio}
          disabled={isPlaying || !question.audioUrl}
          className="flex items-center gap-2"
        >
          <Volume2 className="h-5 w-5" />
          {isPlaying ? "Playing..." : "Play Audio"}
        </Button>
      </div>
      
      <Input
        type="text"
        placeholder="Enter your answer after listening"
        value={userAnswer || ''}
        onChange={(e) => onChange(question.id, e.target.value)}
        disabled={isCompleted}
        className={cn(
          isCorrect && "border-green-500",
          isIncorrect && "border-red-500"
        )}
      />
      
      {isCompleted && (
        <div className={cn(
          "p-3 rounded-md",
          isCorrect ? "bg-green-50" : "bg-red-50"
        )}>
          <div className="flex items-start gap-2">
            {isCorrect ? (
              <Check className="mt-0.5 h-4 w-4 text-green-500" />
            ) : (
              <X className="mt-0.5 h-4 w-4 text-red-500" />
            )}
            <div>
              <p className={cn(
                "font-medium",
                isCorrect ? "text-green-600" : "text-red-600"
              )}>
                {isCorrect ? "Correct answer" : "Incorrect answer"}
              </p>
              {isIncorrect && (
                <p className="mt-1 text-sm">
                  The correct answer is: <span className="font-medium">{question.correctAnswer}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
