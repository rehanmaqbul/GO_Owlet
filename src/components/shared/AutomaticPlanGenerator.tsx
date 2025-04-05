import { useState } from 'react';
import { format, addDays } from 'date-fns';

interface Task {
  id: string;
  title: string;
  type: 'mixed_practice' | 'reading' | 'listening' | 'story' | 'image_upload';
  subject: string;
  chapter: string;
  lesson: string;
  description: string;
  questions?: number;
  dayOfWeek: string;
  date: Date;
}

interface StudyPlan {
  id: string;
  name: string;
  duration: 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  tasks: Task[];
}

const MIXED_PRACTICE_TYPES = ['mcq', 'fill_blank', 'multi_select', 'yes_no', 'true_false'];
const SPECIAL_TASK_TYPES = ['reading', 'listening', 'story', 'image_upload'] as const;

export const generateAutomaticPlan = (
  startDate: Date,
  duration: 'weekly' | 'monthly',
  subjects: Array<{ id: string; name: string }>,
  chapters: Record<string, string[]>,
  lessons: Record<string, Record<string, string[]>>
): StudyPlan => {
  const daysCount = duration === 'weekly' ? 7 : 30;
  const endDate = addDays(startDate, daysCount - 1);
  const tasks: Task[] = [];

  // Helper function to get random item from array
  const getRandomItem = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Helper function to generate a mixed practice set
  const generateMixedPracticeSet = (date: Date, setNumber: number): Task => {
    const subject = getRandomItem(subjects);
    const chapter = getRandomItem(chapters[subject.id]);
    const lesson = getRandomItem(lessons[subject.id][chapter]);
    
    return {
      id: `mixed_${date.getTime()}_${setNumber}`,
      title: `Mixed Practice Set ${setNumber}`,
      type: 'mixed_practice',
      subject: subject.id,
      chapter,
      lesson,
      description: 'A comprehensive set of questions including multiple choice, true/false, yes/no, multi-select, and fill-in-the-blanks',
      questions: Math.floor(Math.random() * 3) + 2, // 2-4 questions
      dayOfWeek: format(date, 'EEEE'),
      date
    };
  };

  // Helper function to generate a special task
  const generateSpecialTask = (date: Date, type: typeof SPECIAL_TASK_TYPES[number]): Task => {
    const subject = getRandomItem(subjects);
    const chapter = getRandomItem(chapters[subject.id]);
    const lesson = getRandomItem(lessons[subject.id][chapter]);
    
    const descriptions = {
      reading: 'Read a passage and answer questions about its content',
      listening: 'Listen to the audio and answer questions from the audio\'s content',
      story: 'Read the story and answer questions from the story content',
      image_upload: 'Complete the physical task and upload an image as proof'
    };

    return {
      id: `${type}_${date.getTime()}`,
      title: type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      type: type,
      subject: subject.id,
      chapter,
      lesson,
      description: descriptions[type],
      dayOfWeek: format(date, 'EEEE'),
      date
    };
  };

  // Generate tasks for each day
  for (let i = 0; i < daysCount; i++) {
    const currentDate = addDays(startDate, i);
    const dayOfWeek = format(currentDate, 'EEEE');

    // Add two mixed practice sets per day
    tasks.push(generateMixedPracticeSet(currentDate, 1));
    tasks.push(generateMixedPracticeSet(currentDate, 2));

    // Add one special task per day, rotating through the types
    const specialTaskType = SPECIAL_TASK_TYPES[i % SPECIAL_TASK_TYPES.length];
    tasks.push(generateSpecialTask(currentDate, specialTaskType));
  }

  return {
    id: Date.now().toString(),
    name: `${duration.charAt(0).toUpperCase() + duration.slice(1)} Study Plan`,
    duration,
    startDate,
    endDate,
    tasks
  };
}; 