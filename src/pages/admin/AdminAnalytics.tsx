import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart2, 
  LineChart,
  PieChart,
  Users,
  BookOpen,
  Clock,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for usage stats
const mockUsageData = {
  daily: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    activeUsers: [245, 302, 278, 325, 310, 198, 182],
    pageViews: [1254, 1532, 1438, 1628, 1575, 986, 912]
  },
  weekly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    activeUsers: [1230, 1345, 1287, 1402],
    pageViews: [6250, 6830, 6520, 7150]
  },
  monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    activeUsers: [4560, 4890, 5120, 5340, 5680, 5910, 5230, 5120, 5430, 5780, 6120, 6340],
    pageViews: [23450, 25670, 27830, 28960, 31240, 32580, 28790, 28340, 29570, 32180, 33920, 35670]
  }
};

// Mock data for user types
const mockUserTypes = {
  students: 316,
  teachers: 42,
  parents: 278,
  admins: 8
};

// Mock data for content analytics
const mockContentAnalytics = {
  lessons: { count: 128, viewed: 87, avgRating: 4.3 },
  resources: { count: 83, viewed: 62, avgRating: 4.1 },
  quizzes: { count: 45, viewed: 38, avgRating: 3.9 }
};

// Mock data for popular content
const mockPopularContent = [
  { id: 1, title: "Introduction to Algebra", type: "lesson", views: 2450, rating: 4.8 },
  { id: 2, title: "Photosynthesis Explained", type: "lesson", views: 1892, rating: 4.5 },
  { id: 3, title: "Ancient Egypt Civilization", type: "resource", views: 1654, rating: 4.7 },
  { id: 4, title: "Parts of Speech Quiz", type: "quiz", views: 1543, rating: 4.4 },
  { id: 5, title: "Introduction to Fractions", type: "lesson", views: 1432, rating: 4.6 }
];

// Line chart component
const LineChartComponent = ({ 
  labels, 
  datasets, 
  height = 300
}: {
  labels: string[], 
  datasets: { label: string; data: number[]; color: string }[], 
  height?: number
}) => {
  return (
    <div className="w-full" style={{ height }}>
      <div className="flex justify-between items-end h-full relative pt-6">
        {/* Y axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 py-6">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
        
        {/* Chart area */}
        <div className="flex-1 flex items-end h-full space-x-1 pl-8">
          {labels.map((label, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              {/* Bars for each dataset */}
              <div className="w-full relative flex justify-center mb-2 h-[calc(100%-30px)]">
                {datasets.map((dataset, dataIdx) => {
                  // Calculate height percentage
                  const max = Math.max(...dataset.data);
                  const heightPercent = (dataset.data[idx] / max) * 100;
                  
                  return (
                    <div
                      key={dataIdx}
                      className={`w-1 rounded-t-sm mx-0.5`}
                      style={{ 
                        height: `${heightPercent}%`, 
                        backgroundColor: dataset.color 
                      }}
                    ></div>
                  );
                })}
              </div>
              {/* X axis label */}
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center mt-4 space-x-4">
        {datasets.map((dataset, idx) => (
          <div key={idx} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: dataset.color }}></div>
            <span className="text-xs text-gray-600">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pie chart component
const PieChartComponent = ({ 
  data,
  height = 200
}: {
  data: { label: string; value: number; color: string }[];
  height?: number;
}) => {
  // Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate percentages and angles
  let startAngle = 0;
  const segments = data.map(item => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const segment = {
      ...item,
      percentage,
      startAngle,
      endAngle: startAngle + angle
    };
    startAngle += angle;
    return segment;
  });

  return (
    <div className="flex flex-col items-center justify-center" style={{ height }}>
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segments.map((segment, idx) => {
            // Convert angles to radians
            const startRad = (segment.startAngle - 90) * (Math.PI / 180);
            const endRad = (segment.endAngle - 90) * (Math.PI / 180);
            
            // Calculate arc path
            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);
            
            // Determine if arc is large or small
            const largeArcFlag = segment.endAngle - segment.startAngle <= 180 ? 0 : 1;
            
            // Create SVG path
            const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            return (
              <path 
                key={idx} 
                d={pathData} 
                fill={segment.color}
                stroke="#fff"
                strokeWidth="1"
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center mt-4 gap-3">
        {segments.map((segment, idx) => (
          <div key={idx} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: segment.color }}></div>
            <span className="text-xs text-gray-600">
              {segment.label} ({segment.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stat Card component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeDirection = 'up',
  color = 'blue',
  subtitle
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  change?: string; 
  changeDirection?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'gray';
  subtitle?: string;
}) => {
  // Map color to Tailwind classes
  const colorMap = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-600' }
  };
  
  // Change direction styling
  const changeStyle = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };
  
  return (
    <Card className="p-4 border border-slate-200">
      <div className="flex items-center gap-3">
        <div className={`${colorMap[color].bg} p-2 rounded-md ${colorMap[color].text}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">{title}</p>
          <div className="flex items-center gap-2">
            <p className={`text-xl font-bold ${colorMap[color].text}`}>{value}</p>
            {change && (
              <span className={`text-xs ${changeStyle[changeDirection]}`}>
                {changeDirection === 'up' ? '↑' : changeDirection === 'down' ? '↓' : ''}
                {change}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
};

// Main component
const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [dateRange, setDateRange] = useState('last-30');
  
  // Generate chart data from mock data
  const chartData = {
    labels: mockUsageData[timePeriod].labels,
    datasets: [
      { 
        label: 'Active Users', 
        data: mockUsageData[timePeriod].activeUsers, 
        color: '#3b82f6' // blue
      },
      { 
        label: 'Page Views', 
        data: mockUsageData[timePeriod].pageViews, 
        color: '#8b5cf6' // purple
      }
    ]
  };
  
  // User type data for pie chart
  const userTypeData = [
    { label: 'Students', value: mockUserTypes.students, color: '#3b82f6' }, // blue
    { label: 'Parents', value: mockUserTypes.parents, color: '#10b981' }, // green
    { label: 'Teachers', value: mockUserTypes.teachers, color: '#8b5cf6' }, // purple
    { label: 'Admins', value: mockUserTypes.admins, color: '#f59e0b' } // amber
  ];
  
  // Content type data for pie chart
  const contentTypeData = [
    { label: 'Lessons', value: mockContentAnalytics.lessons.count, color: '#3b82f6' }, // blue
    { label: 'Resources', value: mockContentAnalytics.resources.count, color: '#10b981' }, // green
    { label: 'Quizzes', value: mockContentAnalytics.quizzes.count, color: '#8b5cf6' } // purple
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/admin-dashboard')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
              <p className="text-gray-500">View system usage and performance metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last-7">Last 7 days</SelectItem>
                <SelectItem value="last-30">Last 30 days</SelectItem>
                <SelectItem value="this-month">This month</SelectItem>
                <SelectItem value="last-month">Last month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Active Users"
            value="1,347"
            icon={Users}
            change="12.5%"
            changeDirection="up"
            subtitle="Last 30 days"
          />
          <StatCard
            title="Total Content"
            value="256"
            icon={BookOpen}
            change="8.3%"
            changeDirection="up"
            color="green"
            subtitle="Across all subjects"
          />
          <StatCard
            title="Avg. Session Time"
            value="14:32"
            icon={Clock}
            change="2.1%"
            changeDirection="down"
            color="purple"
            subtitle="Minutes per user"
          />
          <StatCard
            title="Completion Rate"
            value="78.4%"
            icon={Activity}
            change="5.2%"
            changeDirection="up"
            color="amber"
            subtitle="Tasks completed"
          />
        </div>
        
        {/* Main Analytics Tabs */}
        <Tabs defaultValue="usage" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <RefreshCw className="h-3 w-3" />
                Refresh
              </Button>
              <Select value={timePeriod} onValueChange={(value: any) => setTimePeriod(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Usage Analytics */}
          <TabsContent value="usage" className="mt-0">
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">System Usage Overview</h3>
                <p className="text-sm text-gray-500">Active users and page views over time</p>
              </div>
              
              <LineChartComponent 
                labels={chartData.labels}
                datasets={chartData.datasets}
                height={350}
              />
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">Popular Content</h3>
                  <p className="text-sm text-gray-500">Most viewed content items</p>
                </div>
                
                <div className="space-y-4">
                  {mockPopularContent.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="capitalize">{item.type}</span>
                          <span className="mx-2">•</span>
                          <span>{item.views.toLocaleString()} views</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm">{item.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">Platform Usage by Device</h3>
                  <p className="text-sm text-gray-500">Device breakdown for accessing the platform</p>
                </div>
                
                <PieChartComponent 
                  data={[
                    { label: 'Desktop', value: 48, color: '#3b82f6' },
                    { label: 'Mobile', value: 32, color: '#10b981' },
                    { label: 'Tablet', value: 20, color: '#8b5cf6' }
                  ]}
                />
              </Card>
            </div>
          </TabsContent>
          
          {/* User Analytics */}
          <TabsContent value="users" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 md:col-span-2">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">User Activity</h3>
                  <p className="text-sm text-gray-500">Daily active users over time</p>
                </div>
                
                <LineChartComponent 
                  labels={chartData.labels}
                  datasets={[chartData.datasets[0]]}
                  height={300}
                />
              </Card>
              
              <Card className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">User Breakdown</h3>
                  <p className="text-sm text-gray-500">Distribution by role</p>
                </div>
                
                <PieChartComponent data={userTypeData} />
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <StatCard
                title="New Users"
                value="124"
                icon={Users}
                change="18.5%"
                changeDirection="up"
                subtitle="Last 30 days"
              />
              <StatCard
                title="User Retention"
                value="84.2%"
                icon={Users}
                change="3.1%"
                changeDirection="up"
                color="green"
                subtitle="30-day retention"
              />
              <StatCard
                title="Avg. Sessions"
                value="4.3"
                icon={Activity}
                change="1.2%"
                changeDirection="up"
                color="purple"
                subtitle="Per user per week"
              />
              <StatCard
                title="Bounce Rate"
                value="23.7%"
                icon={Activity}
                change="2.4%"
                changeDirection="down"
                color="amber"
                subtitle="Single page visits"
              />
            </div>
          </TabsContent>
          
          {/* Content Analytics */}
          <TabsContent value="content" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 md:col-span-2">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">Content Engagement</h3>
                  <p className="text-sm text-gray-500">Views by content type</p>
                </div>
                
                <LineChartComponent 
                  labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
                  datasets={[
                    { label: 'Lessons', data: [120, 145, 178, 156, 190, 210], color: '#3b82f6' },
                    { label: 'Resources', data: [98, 112, 134, 129, 148, 162], color: '#10b981' },
                    { label: 'Quizzes', data: [76, 85, 92, 88, 105, 118], color: '#8b5cf6' }
                  ]}
                  height={300}
                />
              </Card>
              
              <Card className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">Content Distribution</h3>
                  <p className="text-sm text-gray-500">By type</p>
                </div>
                
                <PieChartComponent data={contentTypeData} />
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <StatCard
                title="Total Items"
                value={mockContentAnalytics.lessons.count + mockContentAnalytics.resources.count + mockContentAnalytics.quizzes.count}
                icon={BookOpen}
                color="blue"
                subtitle="All content types"
              />
              <StatCard
                title="Avg. Rating"
                value="4.2"
                icon={Activity}
                change="0.3"
                changeDirection="up"
                color="green"
                subtitle="Across all content"
              />
              <StatCard
                title="Content Views"
                value="8,472"
                icon={Activity}
                change="14.2%"
                changeDirection="up"
                color="purple"
                subtitle="Last 30 days"
              />
            </div>
          </TabsContent>
          
          {/* Performance Analytics */}
          <TabsContent value="performance" className="mt-0">
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">System Performance</h3>
                <p className="text-sm text-gray-500">Server response time and errors</p>
              </div>
              
              <LineChartComponent 
                labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                datasets={[
                  { label: 'Response Time (ms)', data: [128, 145, 139, 132, 160, 142, 130], color: '#3b82f6' },
                  { label: 'Errors', data: [5, 3, 7, 4, 2, 3, 1], color: '#ef4444' }
                ]}
                height={300}
              />
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <StatCard
                title="Avg. Response Time"
                value="142ms"
                icon={Activity}
                change="12ms"
                changeDirection="down"
                color="green"
                subtitle="Server response"
              />
              <StatCard
                title="Error Rate"
                value="0.8%"
                icon={Activity}
                change="0.3%"
                changeDirection="down"
                color="green"
                subtitle="API requests"
              />
              <StatCard
                title="Uptime"
                value="99.98%"
                icon={Activity}
                color="blue"
                subtitle="Last 30 days"
              />
              <StatCard
                title="Database Queries"
                value="1.2M"
                icon={Activity}
                change="8.3%"
                changeDirection="up"
                color="purple"
                subtitle="Last 7 days"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAnalytics; 