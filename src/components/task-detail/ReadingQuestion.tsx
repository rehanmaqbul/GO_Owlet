
import { Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Mic, Square, Send } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface ReadingQuestionProps {
  question: Question;
  userAnswer: string;
  isCompleted: boolean;
  onChange: (questionId: string, answer: string) => void;
  onRecordAudio: (questionId: string) => Promise<void>;
}

export const ReadingQuestion = ({ 
  question, 
  userAnswer, 
  isCompleted, 
  onChange,
  onRecordAudio
}: ReadingQuestionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  
  const handleStartRecording = async () => {
    setIsRecording(true);
    try {
      await onRecordAudio(question.id);
      onChange(question.id, 'audio-recording-completed');
      setRecordingComplete(true);
    } catch (error) {
      console.error('Recording failed:', error);
    } finally {
      setIsRecording(false);
    }
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordingComplete(true);
    onChange(question.id, 'audio-recording-completed');
  };
  
  return (
    <div className="space-y-4">
      {question.storyText && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="whitespace-pre-line">{question.storyText}</p>
        </Card>
      )}
      
      <div className="flex flex-col items-center gap-4">
        {!isRecording && !recordingComplete && !isCompleted && (
          <Button 
            onClick={handleStartRecording}
            className="flex items-center gap-2"
          >
            <Mic className="h-5 w-5" />
            Start Recording
          </Button>
        )}
        
        {isRecording && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <Mic className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-red-500">Recording...</p>
            <Button 
              variant="outline" 
              onClick={handleStopRecording}
              className="mt-2"
            >
              <Square className="h-5 w-5 mr-2" />
              Stop Recording
            </Button>
          </div>
        )}
        
        {(recordingComplete || isCompleted) && (
          <div className="w-full flex items-center justify-center gap-4">
            <div className="p-3 rounded-md bg-green-50 flex items-center gap-2">
              <Send className="h-5 w-5 text-green-500" />
              <p className="text-green-700">Recording submitted successfully</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
