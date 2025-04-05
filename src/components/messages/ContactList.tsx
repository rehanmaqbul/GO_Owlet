
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Contact } from '@/components/messages/types';

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  searchPlaceholder?: string;
}

export const ContactList = ({ 
  contacts, 
  selectedContact, 
  onSelectContact,
  searchPlaceholder = "Search contacts..."
}: ContactListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="border-gray-200 shadow-md h-[600px] overflow-hidden">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-owl-slate h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <div
                key={contact.id}
                className={`p-3 border-b hover:bg-gray-50 cursor-pointer flex items-center ${
                  selectedContact?.id === contact.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => onSelectContact(contact)}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback className={contact.type === 'teacher' 
                      ? 'bg-blue-100 text-blue-800' 
                      : contact.type === 'parent' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'}>
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  {contact.unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
                
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate">{contact.name}</p>
                    <span className="text-xs text-gray-500">
                      {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                    </span>
                  </div>
                  {contact.lastMessage && (
                    <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No contacts found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
