
export type ContactType = 'parent' | 'teacher' | 'child';

export interface Contact {
  id: string;
  name: string;
  type: ContactType;
  avatar?: string;
  lastMessage?: string;
  unread: number;
  email?: string; // Added to support teacher contacts
}
