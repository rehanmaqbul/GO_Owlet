import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

export default function AddSchoolForm() {
  const { toast } = useToast();
  const [newSchool, setNewSchool] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    type: '',
    status: 'active',
    subscription: 'trial'
  });

  const handleAddSchool = async () => {
    try {
      // Validate required fields
      if (!newSchool.name || !newSchool.address || !newSchool.city || 
          !newSchool.state || !newSchool.postal_code || !newSchool.type) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      console.log('Attempting to add school:', newSchool); // Debug log

      const { data, error } = await supabase
        .from('schools')
        .insert([{
          ...newSchool,
          country: 'United States', // Default value
          students_count: 0, // Initialize counts
          teachers_count: 0
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error); // Debug log
        throw error;
      }

      console.log('School added successfully:', data); // Debug log

      toast({
        title: "Success",
        description: "School added successfully",
      });

      // Reset form
      setNewSchool({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        type: '',
        status: 'active',
        subscription: 'trial'
      });
    } catch (error: any) {
      console.error('Error adding school:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add school. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Add New School</h2>
      
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={newSchool.name}
            onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
            placeholder="School name"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newSchool.email}
              onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
              placeholder="school@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={newSchool.phone}
              onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
              placeholder="(123) 456-7890"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={newSchool.address}
            onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
            placeholder="Street address"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={newSchool.city}
              onChange={(e) => setNewSchool({ ...newSchool, city: e.target.value })}
              placeholder="City"
              required
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={newSchool.state}
              onChange={(e) => setNewSchool({ ...newSchool, state: e.target.value })}
              placeholder="State"
              required
            />
          </div>
          <div>
            <Label htmlFor="postal_code">Postal Code *</Label>
            <Input
              id="postal_code"
              value={newSchool.postal_code}
              onChange={(e) => setNewSchool({ ...newSchool, postal_code: e.target.value })}
              placeholder="Postal code"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="type">Type *</Label>
            <Select 
              value={newSchool.type} 
              onValueChange={(value) => setNewSchool({ ...newSchool, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="charter">Charter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={newSchool.status} 
              onValueChange={(value) => setNewSchool({ ...newSchool, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subscription">Subscription</Label>
            <Select 
              value={newSchool.subscription} 
              onValueChange={(value) => setNewSchool({ ...newSchool, subscription: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button 
          onClick={handleAddSchool}
          disabled={!newSchool.name || !newSchool.address || !newSchool.city || 
                   !newSchool.state || !newSchool.postal_code || !newSchool.type}
        >
          Add School
        </Button>
      </div>
      
      <p className="text-sm text-gray-500">* Required fields</p>
    </div>
  );
} 