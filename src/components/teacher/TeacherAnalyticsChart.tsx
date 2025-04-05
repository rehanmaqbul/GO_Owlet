import { BarChart } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

// Mock data for charts
const submissionData = [
  { month: 'Jan', completed: 45, pending: 15 },
  { month: 'Feb', completed: 52, pending: 8 },
  { month: 'Mar', completed: 48, pending: 12 },
  { month: 'Apr', completed: 61, pending: 4 },
  { month: 'May', completed: 55, pending: 10 },
  { month: 'Jun', completed: 67, pending: 3 }
];

const classPerformanceData = [
  { class: 'Grade 5 Science', average: 82 },
  { class: 'Grade 2 Math', average: 75 },
  { class: 'Grade 3 English', average: 80 },
  { class: 'Grade 7 French', average: 71 }
];

const studentActivityData = [
  { week: 'Week 1', assignments: 24, quizzes: 12 },
  { week: 'Week 2', assignments: 32, quizzes: 15 },
  { week: 'Week 3', assignments: 28, quizzes: 8 },
  { week: 'Week 4', assignments: 35, quizzes: 20 }
];

export const TeacherAnalyticsChart = () => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="submissions" className="w-full">
        <TabsList className="mb-6 bg-gray-100 rounded-lg p-1 overflow-x-auto flex-nowrap">
          <TabsTrigger 
            value="submissions" 
            className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Task Submissions
          </TabsTrigger>
          
          <TabsTrigger 
            value="performance" 
            className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Class Performance
          </TabsTrigger>
          
          <TabsTrigger 
            value="activity" 
            className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Student Activity
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="submissions" className="mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-medium mb-4 text-center text-owl-slate-dark">Monthly Task Submissions</h3>
            <div className="h-80">
              <BarChart 
                data={submissionData}
                index="month"
                categories={["completed", "pending"]}
                colors={["#4F46E5", "#FCD34D"]}
                valueFormatter={(value) => `${value} tasks`}
                showLegend={true}
              />
            </div>
            <div className="flex justify-center mt-3 gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-xs text-gray-600">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <span className="text-xs text-gray-600">Pending</span>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-medium mb-4 text-center text-owl-slate-dark">Class Performance</h3>
            <div className="h-80">
              <BarChart 
                data={classPerformanceData}
                index="class"
                categories={["average"]}
                colors={["#8B5CF6"]}
                valueFormatter={(value) => `${value}%`}
              />
            </div>
            <div className="text-center mt-3">
              <p className="text-xs text-gray-600">Average score across all subjects per class</p>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-medium mb-4 text-center text-owl-slate-dark">Weekly Student Activity</h3>
            <div className="h-80">
              <BarChart 
                data={studentActivityData}
                index="week"
                categories={["assignments", "quizzes"]}
                colors={["#10B981", "#EC4899"]}
                valueFormatter={(value) => `${value} activities`}
              />
            </div>
            <div className="flex justify-center mt-3 gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">Assignments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-xs text-gray-600">Quizzes</span>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
