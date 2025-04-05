import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ClipboardList, CheckCircle, BarChart, MessageSquare } from 'lucide-react';

interface ChildDashboardInfoProps {
  childId: string;
  childData: {
    tasks: number;
    completed: number;
    progress: number;
    messages: number;
  };
}

export const ChildDashboardInfo = ({ childId, childData }: ChildDashboardInfoProps) => {
  const stats = [
    {
      label: 'Tasks',
      value: childData.tasks,
      icon: ClipboardList,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Completed',
      value: childData.completed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Progress',
      value: `${childData.progress}%`,
      icon: BarChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      showProgress: true,
      progressValue: childData.progress
    },
    {
      label: 'Messages',
      value: childData.messages,
      icon: MessageSquare,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`${stat.bgColor} p-2 rounded-md ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <div className="flex items-center gap-2">
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                {stat.showProgress && (
                  <div className="w-20 ml-2">
                    <Progress 
                      value={stat.progressValue} 
                      className="h-1.5 bg-slate-200" 
                      indicatorClassName={stat.color.replace('text', 'bg')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
