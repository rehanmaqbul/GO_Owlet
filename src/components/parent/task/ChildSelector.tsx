
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Child {
  id: string;
  name: string;
}

interface ChildSelectorProps {
  selectedChild: string;
  setSelectedChild: (childId: string) => void;
}

const ChildSelector = ({ 
  selectedChild, 
  setSelectedChild 
}: ChildSelectorProps) => {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      setIsLoading(true);
      try {
        if (!user?.id) return;

        // Fetch child profiles where the current user is the parent
        const { data, error } = await supabase.rpc('get_profile_by_id', { user_id: user.id });
        
        if (error) {
          console.error('Error fetching children:', error);
          throw error;
        }
        
        if (data) {
          // Process the data more safely with error handling
          const childrenData = Array.isArray(data) ? data : [];
          const formattedChildren = childrenData.map(child => ({
            id: child.id || 'unknown',
            name: child.name || 'Unnamed Child',
          }));
          
          setChildren(formattedChildren);
        }
      } catch (error) {
        console.error('Error fetching children:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChildren();
  }, [user]);

  return (
    <div className="mt-6 p-4 bg-white/80 rounded-lg shadow-sm border border-gray-200">
      <Label htmlFor="childSelect" className="text-gray-800 block mb-2">
        Select Child
      </Label>
      <select
        id="childSelect"
        value={selectedChild}
        onChange={(e) => setSelectedChild(e.target.value)}
        className="block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        disabled={isLoading}
      >
        <option value="">Select a child</option>
        {children.map(child => (
          <option key={child.id} value={child.id}>
            {child.name}
          </option>
        ))}
      </select>
      {children.length === 0 && !isLoading && (
        <p className="mt-2 text-sm text-red-500">
          No children found. Please add a child to your profile first.
        </p>
      )}
    </div>
  );
};

export default ChildSelector;
