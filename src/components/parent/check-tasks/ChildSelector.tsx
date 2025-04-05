
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Child {
  id: string;
  name: string;
  age: number;
  grade: string;
}

interface ChildSelectorProps {
  children: Child[];
  selectedChild: string;
  setSelectedChild: (value: string) => void;
}

const ChildSelector = ({ children, selectedChild, setSelectedChild }: ChildSelectorProps) => {
  return (
    <div className="relative">
      <Select onValueChange={setSelectedChild} value={selectedChild}>
        <SelectTrigger className="w-full p-3 text-sm text-left bg-white/70 backdrop-blur-md rounded-lg shadow-sm h-auto">
          <SelectValue placeholder="Select Child" />
        </SelectTrigger>
        <SelectContent>
          {children.map((child) => (
            <SelectItem key={child.id} value={child.id}>
              {child.name} ({child.grade})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ChildSelector;
