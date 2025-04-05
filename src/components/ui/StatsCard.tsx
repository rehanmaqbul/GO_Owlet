import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  showProgress?: boolean;
  progressValue?: number;
  change?: string;
  changeValue?: number;
}

const StatsCard = ({
  label,
  value,
  icon: Icon,
  color = 'text-amber-700',
  bgColor = 'bg-amber-100',
  showProgress = false,
  progressValue = 0,
  change,
  changeValue
}: StatsCardProps) => {
  return (
    <Card className="p-4 border-stone-200 bg-stone-50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`${bgColor} p-2 rounded-md ${color}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <div className="flex items-center gap-2">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            {showProgress && (
              <div className="w-20 ml-2">
                <div className="h-1.5 bg-stone-200 rounded-full w-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-600" 
                    style={{ width: `${progressValue}%` }}
                  ></div>
                </div>
              </div>
            )}
            {change && (
              <Badge 
                variant="outline" 
                className={changeValue && changeValue > 0 
                  ? "text-green-600 bg-green-50 border-green-200"
                  : "text-red-600 bg-red-50 border-red-200"}
              >
                {change}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export { StatsCard }; 