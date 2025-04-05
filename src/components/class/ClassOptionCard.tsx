
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ClassOptionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonIcon: ReactNode;
  buttonVariant?: "default" | "secondary";
  onClick: () => void;
}

const ClassOptionCard = ({
  icon,
  title,
  description,
  buttonText,
  buttonIcon,
  buttonVariant = "default",
  onClick
}: ClassOptionCardProps) => {
  return (
    <Card className="shadow-subtle hover:shadow-md transition-shadow border-2 border-transparent hover:border-owl-blue/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-2xl">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-owl-slate mb-4">
          {description}
        </p>
        <Button 
          className="w-full h-12 mt-2 text-base font-medium bg-gradient-to-r from-owl-blue to-owl-blue/80 hover:from-owl-blue/90 hover:to-owl-blue/70 transition-all"
          onClick={onClick}
          variant={buttonVariant}
        >
          {buttonIcon}
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClassOptionCard;
