import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  type: 'mixed_practice' | 'listening' | 'reading' | 'story' | 'physical_activity';
  subject: string;
  chapter: string;
  lesson: string;
  description: string;
  questions: {
    type: 'mcq' | 'yes_no' | 'true_false' | 'fill_blank' | 'select_choice';
    count: number;
  }[];
  dayOfWeek: string;
  date: Date;
}

interface TaskEditModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  subjects: { id: string; name: string; }[];
  chapters: Record<string, string[]>;
  lessons: Record<string, Record<string, string[]>>;
}

export const TaskEditModal = ({
  task,
  isOpen,
  onClose,
  onSave,
  subjects,
  chapters,
  lessons,
}: TaskEditModalProps) => {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(0);

  useEffect(() => {
    if (task) {
      setEditedTask(task);
      setSelectedSubject(task.subject);
      setSelectedChapter(task.chapter);
      setSelectedLesson(task.lesson);
      setQuestionCount(task.questions.reduce((acc, q) => acc + q.count, 0));
    }
  }, [task]);

  const handleSave = () => {
    if (!editedTask) return;

    const updatedTask: Task = {
      ...editedTask,
      subject: selectedSubject,
      chapter: selectedChapter,
      lesson: selectedLesson,
      questions: editedTask.type === 'mixed_practice' ? [
        { type: 'mcq', count: Math.floor(questionCount * 0.4) },
        { type: 'true_false', count: Math.floor(questionCount * 0.2) },
        { type: 'fill_blank', count: Math.floor(questionCount * 0.2) },
        { type: 'select_choice', count: Math.floor(questionCount * 0.2) }
      ] : [],
    };

    onSave(updatedTask);
  };

  if (!editedTask) return null;

  const handleQuestionTypeChange = (index: number, newType: Task['questions'][0]['type']) => {
    const newQuestions = [...editedTask.questions];
    newQuestions[index] = { ...newQuestions[index], type: newType };
    setEditedTask({ ...editedTask, questions: newQuestions });
  };

  const handleQuestionCountChange = (index: number, newCount: number) => {
    const newQuestions = [...editedTask.questions];
    newQuestions[index] = { ...newQuestions[index], count: newCount };
    setEditedTask({ ...editedTask, questions: newQuestions });
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = editedTask.questions.filter((_, i) => i !== index);
    setEditedTask({ ...editedTask, questions: newQuestions });
  };

  const handleAddQuestion = () => {
    setEditedTask({
      ...editedTask,
      questions: [...editedTask.questions, { type: 'mcq', count: 1 }]
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSubject && (
            <div className="grid gap-2">
              <Label htmlFor="chapter">Chapter</Label>
              <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chapter" />
                </SelectTrigger>
                <SelectContent>
                  {chapters[selectedSubject]?.map(chapter => (
                    <SelectItem key={chapter} value={chapter}>
                      {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedChapter && (
            <div className="grid gap-2">
              <Label htmlFor="lesson">Lesson</Label>
              <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lesson" />
                </SelectTrigger>
                <SelectContent>
                  {lessons[selectedSubject]?.[selectedChapter]?.map(lesson => (
                    <SelectItem key={lesson} value={lesson}>
                      {lesson}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {editedTask.type === 'mixed_practice' && (
            <div className="grid gap-2">
              <Label htmlFor="questionCount">Total Questions</Label>
              <Input
                id="questionCount"
                type="number"
                min="1"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value) || 0)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 