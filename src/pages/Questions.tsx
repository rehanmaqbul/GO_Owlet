
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '@/lib/animations';
import Navbar from '@/components/Navbar';
import { BookOpen } from 'lucide-react';
import { Curriculum, QuestionType, Subject } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import QuestionBank from '@/components/QuestionBank';
import { CurriculumStep } from '@/components/questions/CurriculumStep';
import { SubjectStep } from '@/components/questions/SubjectStep';
import { QuestionTypeStep } from '@/components/questions/QuestionTypeStep';
import { CreateQuestionsStep } from '@/components/questions/CreateQuestionsStep';
import { 
  QuestionFormValues, 
  initialQuestionForm 
} from '@/data/curriculum-data';

const Questions = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | ''>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<QuestionType[]>([]);
  const [questions, setQuestions] = useState<QuestionFormValues[]>([]);
  const [step, setStep] = useState<'curriculum' | 'subject' | 'question_type' | 'create' | 'question_bank'>('curriculum');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Only admins should access this page
    if (user?.role !== 'admin' && user?.role !== 'teacher') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setStep('question_type');
  };

  const handleQuestionTypeToggle = (type: QuestionType) => {
    setSelectedQuestionTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleProceedToCreate = () => {
    if (selectedQuestionTypes.length === 0) {
      toast({
        title: "Please select at least one question type",
        variant: "destructive",
      });
      return;
    }
    
    // Initialize questions array with one empty question for each selected type
    const initialQuestions = selectedQuestionTypes.map(type => {
      let options: string[] = [];
      
      if (type === 'multiple_choice') {
        options = ['', '', '', ''];
      } else if (type === 'true_false') {
        options = ['True', 'False'];
      } else if (type === 'yes_no') {
        options = ['Yes', 'No'];
      }
      
      return {
        text: '',
        type,
        options,
        correctAnswer: '',
      };
    });
    
    setQuestions(initialQuestions);
    setStep('create');
  };

  const handleQuestionChange = (index: number, field: keyof QuestionFormValues, value: string) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions(prev => {
      const updated = [...prev];
      const options = [...updated[questionIndex].options];
      options[optionIndex] = value;
      updated[questionIndex] = {
        ...updated[questionIndex],
        options,
      };
      return updated;
    });
  };

  const handleAddQuestion = (type: QuestionType) => {
    let newQuestion: QuestionFormValues = {
      text: '',
      type,
      options: [],
      correctAnswer: '',
    };
    
    if (type === 'multiple_choice') {
      newQuestion.options = ['', '', '', ''];
    } else if (type === 'true_false') {
      newQuestion.options = ['True', 'False'];
    } else if (type === 'yes_no') {
      newQuestion.options = ['Yes', 'No'];
    }
    
    setQuestions(prev => [...prev, newQuestion]);
  };

  const handleSaveQuestions = () => {
    // Validation checks
    const hasEmptyQuestions = questions.some(q => !q.text);
    if (hasEmptyQuestions) {
      toast({
        title: "Incomplete questions",
        description: "Please fill in all question texts.",
        variant: "destructive",
      });
      return;
    }
    
    const hasEmptyAnswers = questions.some(q => !q.correctAnswer);
    if (hasEmptyAnswers) {
      toast({
        title: "Missing answers",
        description: "Please provide correct answers for all questions.",
        variant: "destructive",
      });
      return;
    }
    
    const hasEmptyOptions = questions.some(q => 
      q.type === 'multiple_choice' && q.options.some(opt => !opt)
    );
    if (hasEmptyOptions) {
      toast({
        title: "Incomplete options",
        description: "Please fill in all options for multiple choice questions.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would save to a database
    toast({
      title: "Questions saved successfully",
      description: `${questions.length} questions added to ${selectedSubject} in ${selectedCurriculum} curriculum.`,
    });
    
    // Reset the form for a new entry
    setSelectedQuestionTypes([]);
    setQuestions([]);
    setStep('curriculum');
  };

  const handleViewQuestionBank = () => {
    setStep('question_bank');
  };

  if (!user || (user.role !== 'admin' && user.role !== 'teacher')) return null;

  return (
    <div className="min-h-screen bg-owl-neutral">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
        <motion.div className="space-y-6" {...fadeIn}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-medium text-owl-slate-dark">Insert Questions</h1>
              <p className="text-owl-slate mt-1">
                Add curriculum-specific questions for student assessments
              </p>
            </div>
            
            <Button 
              variant="outline"
              onClick={handleViewQuestionBank}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Question Bank
            </Button>
          </div>
          
          {step === 'curriculum' && (
            <CurriculumStep
              selectedCurriculum={selectedCurriculum}
              selectedGrade={selectedGrade}
              selectedAge={selectedAge}
              setSelectedCurriculum={setSelectedCurriculum}
              setSelectedGrade={setSelectedGrade}
              setSelectedAge={setSelectedAge}
              onNext={() => setStep('subject')}
            />
          )}
          
          {step === 'subject' && selectedCurriculum && (
            <SubjectStep onSubjectSelect={handleSubjectSelect} />
          )}
          
          {step === 'question_type' && selectedSubject && (
            <QuestionTypeStep 
              selectedQuestionTypes={selectedQuestionTypes}
              onQuestionTypeToggle={handleQuestionTypeToggle}
              onNext={handleProceedToCreate}
            />
          )}
          
          {step === 'create' && (
            <CreateQuestionsStep
              selectedQuestionTypes={selectedQuestionTypes}
              questions={questions}
              onQuestionChange={handleQuestionChange}
              onOptionChange={handleOptionChange}
              onAddQuestion={handleAddQuestion}
              onSaveQuestions={handleSaveQuestions}
            />
          )}
          
          {step === 'question_bank' && (
            <motion.div {...slideUp}>
              <Card className="shadow-subtle">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Question Bank</CardTitle>
                    <Button 
                      variant="outline" 
                      onClick={() => setStep('curriculum')}
                    >
                      Back to Question Creation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <QuestionBank />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Questions;
