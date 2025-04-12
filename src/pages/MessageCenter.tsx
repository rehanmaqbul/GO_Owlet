import React from 'react';
import Layout from '../components/Layout';

const MessageCenter: React.FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Message Center</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Message Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Messages</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex justify-between">
                <span>Unread Messages</span>
                <span className="font-semibold">45</span>
              </div>
              <div className="flex justify-between">
                <span>Sent Today</span>
                <span className="font-semibold">23</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Compose New Message
              </button>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                View All Messages
              </button>
              <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
                Message Templates
              </button>
            </div>
          </div>

          {/* Message Categories */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Message Categories</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Announcements</span>
                <span className="font-semibold">150</span>
              </div>
              <div className="flex justify-between">
                <span>Notifications</span>
                <span className="font-semibold">300</span>
              </div>
              <div className="flex justify-between">
                <span>Alerts</span>
                <span className="font-semibold">50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">System Maintenance Notice</td>
                  <td className="px-6 py-4 whitespace-nowrap">Admin</td>
                  <td className="px-6 py-4 whitespace-nowrap">All Users</td>
                  <td className="px-6 py-4 whitespace-nowrap">2 hours ago</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Sent
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">New Feature Announcement</td>
                  <td className="px-6 py-4 whitespace-nowrap">Admin</td>
                  <td className="px-6 py-4 whitespace-nowrap">All Users</td>
                  <td className="px-6 py-4 whitespace-nowrap">1 day ago</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Sent
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessageCenter; 