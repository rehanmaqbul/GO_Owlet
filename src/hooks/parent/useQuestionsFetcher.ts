import { useState, useEffect } from 'react';
import { Question } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

export const useQuestionsFetcher = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.rpc('get_all_questions');
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data) {
          const formattedQuestions = data.map((q: any) => ({
            id: q.id,
            text: q.question_text,
            type: q.question_type,
            options: q.answers ? JSON.parse(q.answers) : [],
            correctAnswer: q.correct_answer || '',
            curriculum: q.curriculum_id || 'american',
            subject: q.subject || '',
            storyText: q.explanation,
            audioUrl: q.audio_url,
            imageUrl: q.image_url,
            videoUrl: q.video_url,
            createdAt: new Date(q.created_at),
            updatedAt: new Date(q.updated_at || q.created_at)
          }));
          
          setQuestions(formattedQuestions);
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch questions'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuestions();
  }, []);
  
  const filterQuestions = (searchQuery: string, selectedCurriculum: string, selectedSubject: string) => {
    // Filter logic based on the search query and selected filters
    return questions.filter(question => {
      const matchesSearch = question.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCurriculum = !selectedCurriculum || question.curriculum === selectedCurriculum;
      const matchesSubject = !selectedSubject || question.subject === selectedSubject;
      
      return matchesSearch && matchesCurriculum && matchesSubject;
    });
  };
  
  return {
    questions,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    filterQuestions
  };
};
