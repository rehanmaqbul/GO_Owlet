import React from 'react';
import Layout from '../components/Layout';

const ContentManagement: React.FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Content Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Content Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Content Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Lessons</span>
                <span className="font-semibold">150</span>
              </div>
              <div className="flex justify-between">
                <span>Active Lessons</span>
                <span className="font-semibold">120</span>
              </div>
              <div className="flex justify-between">
                <span>Draft Lessons</span>
                <span className="font-semibold">30</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Create New Lesson
              </button>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Import Content
              </button>
              <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
                Export Content
              </button>
            </div>
          </div>

          {/* Content Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Content Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Published</span>
                <span className="font-semibold">80%</span>
              </div>
              <div className="flex justify-between">
                <span>In Review</span>
                <span className="font-semibold">15%</span>
              </div>
              <div className="flex justify-between">
                <span>Draft</span>
                <span className="font-semibold">5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Content</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Introduction to Algebra</td>
                    <td className="px-6 py-4 whitespace-nowrap">Lesson</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Published
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">2 days ago</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Basic Geometry</td>
                    <td className="px-6 py-4 whitespace-nowrap">Lesson</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        In Review
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">1 day ago</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContentManagement; 