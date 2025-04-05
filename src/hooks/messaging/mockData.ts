
import { Message } from '@/lib/types';
import { Contact, ContactType } from '@/components/messages/types';

// Mock data
export const mockMessages: Record<string, Message[]> = {
  // Parent-Teacher messages
  'parent-1_teacher-1': [
    {
      id: 'm1',
      senderId: 'parent-1',
      receiverId: 'teacher-1',
      text: 'Hello, I wanted to ask about the upcoming math test.',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      id: 'm2',
      senderId: 'teacher-1',
      receiverId: 'parent-1',
      text: 'Hi! The math test will be on Friday and will cover chapters 5-7.',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5) // 1.5 hours ago
    },
    {
      id: 'm3',
      senderId: 'parent-1',
      receiverId: 'teacher-1',
      text: 'Thank you for the information! Alex will be prepared.',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
    }
  ],
  'parent-1_teacher-2': [
    {
      id: 'm4',
      senderId: 'teacher-2',
      receiverId: 'parent-1',
      text: 'Just wanted to let you know that Jamie did very well on the science project!',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    }
  ],
  // Parent-Child messages
  'parent-1_child-1': [
    {
      id: 'mc1',
      senderId: 'parent-1',
      receiverId: 'child-1',
      text: 'Hello sweetie! How was school today?',
      read: true,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: 'mc2',
      senderId: 'child-1',
      receiverId: 'parent-1',
      text: 'Hi mom! School was great. I learned about planets today.',
      read: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'mc3',
      senderId: 'parent-1',
      receiverId: 'child-1',
      text: 'That sounds fun! Did you complete the math task I sent you?',
      read: true,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: 'mc4',
      senderId: 'child-1',
      receiverId: 'parent-1',
      text: 'Not yet, I\'ll do it after dinner!',
      read: true,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    }
  ],
  // Teacher-Parent messages (duplicate of parent-teacher but with diff key format)
  'teacher-1_parent-1': [
    {
      id: 'msg-1',
      senderId: 'teacher-1',
      receiverId: 'parent-1',
      text: 'Hello! I wanted to discuss Alex\'s progress in science class.',
      read: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'msg-2',
      senderId: 'parent-1',
      receiverId: 'teacher-1',
      text: 'Hi! Thanks for reaching out. How is Alex doing?',
      read: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    },
    {
      id: 'msg-3',
      senderId: 'teacher-1',
      receiverId: 'parent-1',
      text: 'Alex is doing well! Particularly strong in chemistry concepts. I\'ve assigned some extra practice for the areas needing improvement.',
      read: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    }
  ],
  'teacher-1_parent-2': [
    {
      id: 'msg-4',
      senderId: 'teacher-1',
      receiverId: 'parent-2',
      text: 'Good afternoon! Taylor did great on the recent math quiz!',
      read: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'msg-5',
      senderId: 'parent-2',
      receiverId: 'teacher-1',
      text: 'That\'s wonderful news! We\'ve been practicing at home.',
      read: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
    }
  ],
  // Teacher-Student messages
  'teacher-1_child-1': [
    {
      id: 'ts-1',
      senderId: 'teacher-1',
      receiverId: 'child-1',
      text: 'Alex, I wanted to check in about your progress on the science project.',
      read: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'ts-2',
      senderId: 'child-1',
      receiverId: 'teacher-1',
      text: 'Hi Ms. Adams! I\'ve finished the research part and started building the model.',
      read: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    },
    {
      id: 'ts-3',
      senderId: 'teacher-1',
      receiverId: 'child-1',
      text: 'That sounds great! Let me know if you need any help with the next steps.',
      read: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    }
  ],
  'teacher-2_child-1': [
    {
      id: 'ts-5',
      senderId: 'teacher-2',
      receiverId: 'child-1',
      text: 'Alex, I\'ve added some extra science resources to your homework folder.',
      read: true,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'ts-6',
      senderId: 'child-1',
      receiverId: 'teacher-2',
      text: 'Thank you, Mr. Brown! I\'ll check them out tonight.',
      read: true,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
    }
  ],
  'teacher-1_child-2': [
    {
      id: 'ts-4',
      senderId: 'teacher-1',
      receiverId: 'child-2',
      text: 'Jamie, don\'t forget that your math homework is due tomorrow.',
      read: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    }
  ]
};

// Mock data for contacts
export const mockContacts = {
  teachers: [
    { id: 'teacher-1', name: 'Ms. Adams', subject: 'Math', avatar: '' },
    { id: 'teacher-2', name: 'Mr. Brown', subject: 'Science', avatar: '' },
  ],
  parents: [
    { id: 'parent-1', name: 'Mom / Dad', email: 'parent1@example.com', childId: 'child-1' },
    { id: 'parent-2', name: 'Casey Jones', email: 'parent2@example.com', childId: 'child-2' },
    { id: 'parent-3', name: 'Morgan Lee', email: 'parent3@example.com', childId: 'child-3' },
  ],
  children: [
    { id: 'child-1', name: 'Alex Smith', age: 10, grade: 'Grade 5', avatar: '', teacherId: 'teacher-1' },
    { id: 'child-2', name: 'Jamie Johnson', age: 8, grade: 'Grade 3', avatar: '', teacherId: 'teacher-1' },
    { id: 'child-3', name: 'Taylor Wilson', age: 9, grade: 'Grade 4', avatar: '', teacherId: 'teacher-2' },
  ]
};
