
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Image } from 'lucide-react';
import { CardContent } from '@/components/ui/card';

interface MessageInputProps {
  onSendMessage: (text: string, mediaUrl: string | null) => void;
}

export const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!newMessage.trim() && !previewImage) return;
    
    onSendMessage(newMessage, previewImage);
    setNewMessage('');
    setPreviewImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <CardContent className="p-4 border-t">
      {previewImage && (
        <div className="relative mb-2 rounded border overflow-hidden">
          <img src={previewImage} alt="Preview" className="max-h-32 w-auto" />
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-80"
            onClick={() => setPreviewImage(null)}
          >
            ×
          </Button>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1"
        />
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <Button
          size="icon"
          variant="ghost"
          type="button"
          onClick={handleUploadClick}
          title="Upload image"
        >
          <Image className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          type="button"
          onClick={handleSend}
          disabled={!newMessage.trim() && !previewImage}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </CardContent>
  );
};
