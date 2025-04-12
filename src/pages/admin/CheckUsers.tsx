import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '@/services/dashboard/dashboardService';

// This is just a diagnostic component to check database connectivity
const CheckUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [directCount, setDirectCount] = useState<number | null>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [debug, setDebug] = useState<any>(null);

  // Check for tables in the database
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const { data, error } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public');
          
        if (error) {
          setError('Error fetching tables: ' + error.message);
          setDebug({ error });
        } else {
          setTables(data?.map(t => t.tablename) || []);
        }
      } catch (err: any) {
        setError('Exception fetching tables: ' + err.message);
        setDebug({ err });
      }
    };
    
    fetchTables();
  }, []);

  // Try to fetch users directly
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Method 1: Direct query
        const { data, error, count } = await supabase
          .from('users')
          .select('*', { count: 'exact' });

        if (error) {
          setError('Error fetching users: ' + error.message);
          setDebug({ error });
        } else {
          setUsers(data || []);
          setDirectCount(data?.length || 0);
          setDebug({ count, data: data?.slice(0, 2) });
        }
        
        // Method 2: Through dashboard service
        try {
          const stats = await dashboardService.getDashboardStats();
          setDashboardStats(stats);
          console.log("Dashboard stats:", stats);
        } catch (dashboardErr: any) {
          console.error("Dashboard service error:", dashboardErr);
          setDebug(prev => ({ ...prev, dashboardError: dashboardErr.message }));
        }
      } catch (err: any) {
        setError('Exception fetching users: ' + err.message);
        setDebug({ err });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Check service file path
  const checkServicePath = () => {
    try {
      return dashboardService?.toString() || "Could not stringify service";
    } catch (e) {
      return "Error getting service info";
    }
  };

  return (
    <div className="p-8">
      <Card className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/admin-dashboard')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Database Diagnostics</h1>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">User Count Comparison</h2>
          {loading ? (
            <div className="flex items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 border-amber-200">
                <h3 className="font-medium mb-2">Direct Query</h3>
                <p>Users found: <span className="font-bold text-lg">{directCount}</span></p>
                {users.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500">First user: {users[0]?.name || users[0]?.email || JSON.stringify(users[0]?.id)}</p>
                )}
              </Card>
              
              <Card className="p-4 border-blue-200">
                <h3 className="font-medium mb-2">Dashboard Service</h3>
                <p>Users count: <span className="font-bold text-lg">{dashboardStats?.totalUsers || 'N/A'}</span></p>
                <p className="mt-2 text-sm text-gray-500">Service path: {checkServicePath()}</p>
              </Card>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Available Tables ({tables.length})</h2>
          {tables.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tables.map(table => (
                <div key={table} className="bg-gray-50 p-2 rounded">
                  {table}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tables found or error querying tables.</p>
          )}
        </div>
        
        {users.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">User Sample</h2>
            <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-60 text-sm">
              {JSON.stringify(users[0], null, 2)}
            </pre>
          </div>
        )}
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Debug Info</h2>
          <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-60 text-sm">
            {JSON.stringify({...debug, dashboardStats}, null, 2)}
          </pre>
        </div>
      </Card>
    </div>
  );
};

export default CheckUsers; 