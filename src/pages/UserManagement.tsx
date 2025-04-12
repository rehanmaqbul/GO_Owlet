import React from 'react';
import Layout from '../components/Layout';

const UserManagement: React.FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Users</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex justify-between">
                <span>Active Users</span>
                <span className="font-semibold">1,000</span>
              </div>
              <div className="flex justify-between">
                <span>New Users (30 days)</span>
                <span className="font-semibold">100</span>
              </div>
            </div>
          </div>

          {/* User Roles */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">User Roles</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Parents</span>
                <span className="font-semibold">500</span>
              </div>
              <div className="flex justify-between">
                <span>Teachers</span>
                <span className="font-semibold">200</span>
              </div>
              <div className="flex justify-between">
                <span>Students</span>
                <span className="font-semibold">500</span>
              </div>
              <div className="flex justify-between">
                <span>Admins</span>
                <span className="font-semibold">34</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Add New User
              </button>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Import Users
              </button>
              <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
                Export Users
              </button>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Sample data - replace with actual data */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                  <td className="px-6 py-4 whitespace-nowrap">john@example.com</td>
                  <td className="px-6 py-4 whitespace-nowrap">Parent</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
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
    </Layout>
  );
};

export default UserManagement; 