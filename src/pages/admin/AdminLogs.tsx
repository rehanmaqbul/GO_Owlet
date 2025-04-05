import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  User,
  Server,
  Settings,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types for log entries
type LogLevel = 'info' | 'warning' | 'error' | 'debug' | 'success';

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
  user?: string;
  details?: string;
}

// Mock data for log entries
const mockLogs: LogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2023-07-15T09:23:45Z',
    level: 'error',
    message: 'Database connection failed',
    source: 'API Server',
    details: 'Connection timeout after 30s. Database server might be down.'
  },
  {
    id: 'log-002',
    timestamp: '2023-07-15T09:25:12Z',
    level: 'info',
    message: 'User logged in',
    source: 'Auth Service',
    user: 'teacher@example.com'
  },
  {
    id: 'log-003',
    timestamp: '2023-07-15T10:12:33Z',
    level: 'warning',
    message: 'High CPU usage detected',
    source: 'System Monitor',
    details: 'CPU usage at 85% for the last 15 minutes'
  },
  {
    id: 'log-004',
    timestamp: '2023-07-15T10:45:21Z',
    level: 'success',
    message: 'Daily backup completed',
    source: 'Backup Service',
    details: 'All data successfully backed up to cloud storage'
  },
  {
    id: 'log-005',
    timestamp: '2023-07-15T11:03:45Z',
    level: 'debug',
    message: 'Cache refresh initiated',
    source: 'Content Service',
    details: 'Manual cache refresh triggered by admin'
  },
  {
    id: 'log-006',
    timestamp: '2023-07-15T11:15:22Z',
    level: 'info',
    message: 'New content published',
    source: 'Content Management',
    user: 'content_admin@example.com',
    details: 'Published "Introduction to Fractions" lesson'
  },
  {
    id: 'log-007',
    timestamp: '2023-07-15T11:30:05Z',
    level: 'error',
    message: 'Payment processing failed',
    source: 'Payment Gateway',
    user: 'parent@example.com',
    details: 'Card declined by payment processor'
  },
  {
    id: 'log-008',
    timestamp: '2023-07-15T12:05:18Z',
    level: 'info',
    message: 'System update scheduled',
    source: 'System Admin',
    details: 'Update scheduled for tonight at 3:00 AM'
  },
  {
    id: 'log-009',
    timestamp: '2023-07-15T12:45:33Z',
    level: 'warning',
    message: 'API rate limit approaching',
    source: 'API Gateway',
    details: 'External API service quota at 80% for today'
  },
  {
    id: 'log-010',
    timestamp: '2023-07-15T13:10:27Z',
    level: 'success',
    message: 'Database optimization completed',
    source: 'Database Service',
    details: 'Optimization reduced database size by 15%'
  },
  {
    id: 'log-011',
    timestamp: '2023-07-15T14:05:42Z',
    level: 'debug',
    message: 'Session cleanup run',
    source: 'Auth Service',
    details: 'Removed 245 expired sessions'
  },
  {
    id: 'log-012',
    timestamp: '2023-07-15T14:30:19Z',
    level: 'error',
    message: 'Email service unavailable',
    source: 'Notification Service',
    details: 'Unable to connect to SMTP server'
  }
];

// Helper function to format timestamps
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// Component to display log level with appropriate icon
const LogLevelBadge = ({ level }: { level: LogLevel }) => {
  const levelConfig = {
    info: { icon: Info, bg: 'bg-blue-100', text: 'text-blue-700' },
    warning: { icon: AlertCircle, bg: 'bg-yellow-100', text: 'text-yellow-700' },
    error: { icon: XCircle, bg: 'bg-red-100', text: 'text-red-700' },
    debug: { icon: Settings, bg: 'bg-gray-100', text: 'text-gray-700' },
    success: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-700' }
  };
  
  const { icon: Icon, bg, text } = levelConfig[level];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3 mr-1" />
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};

// Main component
const AdminLogs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [logLevel, setLogLevel] = useState<string>('all');
  const [source, setSource] = useState<string>('all');
  const [dateRange, setDateRange] = useState('today');
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  
  // Filter logs based on search and filters
  const filteredLogs = mockLogs.filter(log => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Log level filter
    const matchesLevel = logLevel === 'all' || log.level === logLevel;
    
    // Source filter
    const matchesSource = source === 'all' || log.source === source;
    
    return matchesSearch && matchesLevel && matchesSource;
  });
  
  // Pagination logic
  const logsPerPage = 10;
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (page - 1) * logsPerPage,
    page * logsPerPage
  );
  
  // Get unique sources for the filter
  const sources = Array.from(new Set(mockLogs.map(log => log.source)));
  
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
              <h1 className="text-2xl font-bold text-gray-800">System Logs</h1>
              <p className="text-gray-500">View and analyze system events and errors</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Logs
            </Button>
            <Button variant="default" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={logLevel} onValueChange={setLogLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select log level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map(src => (
                  <SelectItem key={src} value={src}>{src}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last-7">Last 7 days</SelectItem>
                <SelectItem value="last-30">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
        
        {/* Logs Table */}
        <Card className="mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[100px]">Level</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[150px]">Source</TableHead>
                <TableHead className="w-[150px]">User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <TableRow 
                    key={log.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedLog(log)}
                  >
                    <TableCell className="font-mono text-xs">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <LogLevelBadge level={log.level} />
                    </TableCell>
                    <TableCell className="font-medium">{log.message}</TableCell>
                    <TableCell>{log.source}</TableCell>
                    <TableCell>{log.user || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No log entries found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
        
        {/* Pagination */}
        {filteredLogs.length > logsPerPage && (
          <Pagination className="mb-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={pageNum === page}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        
        {/* Selected Log Details */}
        {selectedLog && (
          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{selectedLog.message}</h3>
                <div className="flex items-center gap-3">
                  <LogLevelBadge level={selectedLog.level} />
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(selectedLog.timestamp)}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedLog(null)}
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-1">Source</h4>
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{selectedLog.source}</span>
                </div>
              </div>
              
              {selectedLog.user && (
                <div>
                  <h4 className="font-medium text-sm text-gray-500 mb-1">User</h4>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{selectedLog.user}</span>
                  </div>
                </div>
              )}
            </div>
            
            {selectedLog.details && (
              <div className="mb-4">
                <h4 className="font-medium text-sm text-gray-500 mb-1">Details</h4>
                <p className="text-gray-800 p-3 bg-gray-50 rounded border border-gray-100">
                  {selectedLog.details}
                </p>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Copy ID
              </Button>
              <Button variant="outline" size="sm">
                Forward
              </Button>
              <Button variant="default" size="sm">
                Resolve Issue
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminLogs; 