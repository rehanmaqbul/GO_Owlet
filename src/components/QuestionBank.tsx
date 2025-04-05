
import { useState } from 'react';
import { Question, QuestionType, Curriculum, Subject } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const generateId = () => `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const QuestionBank = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    curriculum: 'american',
    subject: 'math' as Subject,
    text: '',
    type: 'multiple_choice',
    options: ['', '', '', ''],
    correctAnswer: '',
  });
  
  const [filters, setFilters] = useState({
    curriculum: '' as Curriculum | '',
    subject: '' as Subject,
    type: '' as QuestionType | '',
  });

  const curriculumOptions: { value: Curriculum; label: string }[] = [
    { value: 'american', label: 'American' },
    { value: 'england', label: 'England' },
    { value: 'scotland', label: 'Scotland' },
    { value: 'australia', label: 'Australia' },
    { value: 'new_zealand', label: 'New Zealand' },
    { value: 'canada', label: 'Canada' },
    { value: 'uae', label: 'UAE' },
  ];

  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'fill_blank', label: 'Fill in the Blank' },
    { value: 'true_false', label: 'True/False' },
    { value: 'yes_no', label: 'Yes/No' },
  ];

  const subjectOptions = [
    { value: 'math', label: 'Math' },
    { value: 'french', label: 'French' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'social_studies', label: 'Social Studies' },
    { value: 'critical_thinking', label: 'Critical Thinking' },
    { value: 'mindset', label: 'Mindset' },
    { value: 'arts', label: 'Arts' },
    { value: 'decision_making_skills', label: 'Decision Making Skills' },
    { value: 'general_skills', label: 'General Skills' },
    { value: 'open_book_test', label: 'Open Book Test' },
    { value: 'learning_from_reading', label: 'Learning from Reading' }
  ];

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...(newQuestion.options || [])];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const addOption = () => {
    const updatedOptions = [...(newQuestion.options || []), ''];
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const removeOption = (index: number) => {
    const updatedOptions = (newQuestion.options || []).filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleAddQuestion = () => {
    if (!newQuestion.subject || !newQuestion.text || !newQuestion.curriculum) {
      toast({
        title: "Incomplete Question",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (newQuestion.type === 'multiple_choice' && (!newQuestion.options || newQuestion.options.some(opt => !opt))) {
      toast({
        title: "Invalid Options",
        description: "Please provide all options for multiple choice questions.",
        variant: "destructive",
      });
      return;
    }

    if (!newQuestion.correctAnswer) {
      toast({
        title: "Missing Answer",
        description: "Please provide the correct answer for the question.",
        variant: "destructive",
      });
      return;
    }

    const question: Question = {
      id: generateId(),
      curriculum: newQuestion.curriculum as Curriculum,
      subject: newQuestion.subject as Subject,
      text: newQuestion.text as string,
      type: newQuestion.type as QuestionType,
      options: newQuestion.options,
      correctAnswer: newQuestion.correctAnswer as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setQuestions([...questions, question]);
    
    setNewQuestion({
      curriculum: newQuestion.curriculum,
      subject: newQuestion.subject as Subject,
      text: '',
      type: 'multiple_choice',
      options: ['', '', '', ''],
      correctAnswer: '',
    });

    toast({
      title: "Question Added",
      description: "Your question has been added to the bank.",
    });
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast({
      title: "Question Removed",
      description: "The question has been removed from the bank.",
    });
  };

  const filteredQuestions = questions.filter(question => {
    return (
      (!filters.curriculum || question.curriculum === filters.curriculum) &&
      (!filters.subject || question.subject === filters.subject) &&
      (!filters.type || question.type === filters.type)
    );
  });

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-subtle p-6 space-y-6">
        <h3 className="text-lg font-medium">Add New Question</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Curriculum</label>
              <Select 
                value={newQuestion.curriculum} 
                onValueChange={(value) => setNewQuestion({ ...newQuestion, curriculum: value as Curriculum })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select curriculum" />
                </SelectTrigger>
                <SelectContent>
                  {curriculumOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Select 
                value={newQuestion.subject} 
                onValueChange={(value) => setNewQuestion({ ...newQuestion, subject: value as Subject })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Question Type</label>
              <Select 
                value={newQuestion.type} 
                onValueChange={(value) => setNewQuestion({ ...newQuestion, type: value as QuestionType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question Text</label>
              <Textarea 
                placeholder="Enter your question here..." 
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                className="h-24 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Correct Answer</label>
              <Input 
                placeholder="Enter the correct answer" 
                value={newQuestion.correctAnswer}
                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
              />
            </div>
          </div>
        </div>
        
        {newQuestion.type === 'multiple_choice' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Options</label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={addOption}
                className="h-8 text-owl-blue"
              >
                <PlusCircle size={16} className="mr-1" />
                Add Option
              </Button>
            </div>
            
            <div className="space-y-3">
              {newQuestion.options?.map((option, index) => (
                <div key={index} className="flex space-x-2">
                  <Input 
                    placeholder={`Option ${index + 1}`} 
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeOption(index)}
                    className="h-10 w-10 text-owl-slate hover:text-destructive"
                    disabled={newQuestion.options?.length === 2}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="pt-2">
          <Button onClick={handleAddQuestion} className="w-full sm:w-auto">
            <PlusCircle size={18} className="mr-2" />
            Add Question
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-subtle p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-medium">Question Bank</h3>
          
          <div className="flex flex-wrap gap-3">
            <Select 
              value={filters.curriculum} 
              onValueChange={(value) => setFilters({ ...filters, curriculum: value as Curriculum })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Curricula" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Curricula</SelectItem>
                {curriculumOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filters.subject}
              onValueChange={(value) => setFilters({ ...filters, subject: value as Subject })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {subjectOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.type} 
              onValueChange={(value) => setFilters({ ...filters, type: value as QuestionType })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {questionTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No questions added yet. Use the form above to add questions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div 
                key={question.id} 
                className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-owl-blue-light text-owl-blue-dark rounded-full font-medium">
                        {question.curriculum.charAt(0).toUpperCase() + question.curriculum.slice(1)}
                      </span>
                      <span className="text-xs px-2 py-1 bg-owl-neutral text-owl-slate-dark rounded-full font-medium">
                        {question.subject}
                      </span>
                      <span className="text-xs px-2 py-1 bg-owl-neutral-dark text-owl-slate-dark rounded-full font-medium">
                        {questionTypes.find(t => t.value === question.type)?.label}
                      </span>
                    </div>
                    <p className="font-medium">{question.text}</p>
                    
                    {question.type === 'multiple_choice' && question.options && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {question.options.map((option, index) => (
                          <div 
                            key={index} 
                            className={`text-sm p-2 rounded-md ${
                              option === question.correctAnswer 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-muted'
                            }`}
                          >
                            {option}
                            {option === question.correctAnswer && ' ✓'}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.type !== 'multiple_choice' && (
                      <div className="mt-2">
                        <span className="text-sm font-medium">Answer: </span>
                        <span className="text-sm">{question.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex flex-col space-y-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="h-8 w-8 text-owl-slate hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;
