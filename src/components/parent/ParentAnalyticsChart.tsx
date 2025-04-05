import { BarChart, LineChart, DonutChart } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

// Mock children data
const mockChildren = [
  { id: 'child-1', name: 'Alex', color: '#3E7BFA' },
  { id: 'child-2', name: 'Jamie', color: '#7C5CFF' },
  // Add more children here when needed
];

// Mock data for charts
const submissionData = [
  { month: 'Jan', completed: 15, pending: 5 },
  { month: 'Feb', completed: 18, pending: 3 },
  { month: 'Mar', completed: 12, pending: 8 },
  { month: 'Apr', completed: 20, pending: 2 },
  { month: 'May', completed: 16, pending: 4 },
  { month: 'Jun', completed: 22, pending: 1 }
];

// Generate dynamic progress data for all children
const generateProgressData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return days.map(day => {
    const dataPoint = { day };
    
    // Generate random values for each child
    mockChildren.forEach(child => {
      const childId = child.id.replace('child-', '');
      dataPoint[childId] = Math.floor(Math.random() * 50) + 20; // Random value between 20-70
    });
    
    return dataPoint;
  });
};

const progressData = generateProgressData();

const subjectData = [
  { name: 'Math', value: 35 },
  { name: 'Science', value: 25 },
  { name: 'English', value: 20 },
  { name: 'History', value: 15 },
  { name: 'Arts', value: 5 }
];

export const ParentAnalyticsChart = () => {
  // Get the categories and colors for the progress chart dynamically
  const progressCategories = mockChildren.map(child => child.id.replace('child-', ''));
  const progressColors = mockChildren.map(child => child.color);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="submissions" className="w-full">
        <TabsList className="mb-4 bg-white">
          <TabsTrigger value="submissions">Task Submissions</TabsTrigger>
          <TabsTrigger value="progress">Daily Progress</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="submissions" className="mt-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-base font-medium mb-4 text-left">Monthly Task Submissions</h3>
            <div className="h-80">
              <BarChart 
                data={submissionData}
                index="month"
                categories={["completed", "pending"]}
                colors={["#3E7BFA", "#F9CB80"]}
                valueFormatter={(value) => `${value} tasks`}
                showLegend={true}
                showAnimation={true}
              />
            </div>
            <div className="flex justify-center mt-2 gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3E7BFA]"></div>
                <span className="text-xs text-gray-600">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F9CB80]"></div>
                <span className="text-xs text-gray-600">Pending</span>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="progress" className="mt-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-base font-medium mb-4 text-left">Daily Activity Progress (All Children)</h3>
            <div className="h-80">
              <LineChart 
                data={progressData}
                index="day"
                categories={progressCategories}
                colors={progressColors}
                valueFormatter={(value) => `${value} min`}
                showLegend={true}
                showAnimation={true}
              />
            </div>
            <div className="flex justify-center mt-2 gap-4 flex-wrap">
              {mockChildren.map((child) => (
                <div key={child.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: child.color }}></div>
                  <span className="text-xs text-gray-600">{child.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="subjects" className="mt-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-base font-medium mb-4 text-left">Subject Distribution</h3>
            <div className="h-80 flex justify-center items-center">
              <div className="w-64 h-64">
                <DonutChart 
                  data={subjectData}
                  category="value"
                  index="name"
                  colors={["#3E7BFA", "#7C5CFF", "#F9CB80", "#4BD4A6", "#FF6A8A"]}
                  valueFormatter={(value) => `${value}%`}
                  showAnimation={true}
                  showTooltip={true}
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
              {subjectData.map((subject, index) => (
                <div key={subject.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ 
                      backgroundColor: [
                        "#3E7BFA", "#7C5CFF", "#F9CB80", "#4BD4A6", "#FF6A8A"
                      ][index % 5] 
                    }}
                  ></div>
                  <span className="text-xs text-gray-600">{subject.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
