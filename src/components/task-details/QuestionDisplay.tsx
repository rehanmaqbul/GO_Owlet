import React from 'react';
import { AudioWaveform, Book, Check, ExternalLink, FilmIcon, X } from 'lucide-react';
import { Question } from '@/components/parent/check-tasks/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DonutChart } from '@/components/ui/chart';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon } from "lucide-react";

interface ResponseDistribution {
  label: string;
  count: number;
  percentage: number;
  isCorrect: boolean;
  category?: string;
  value?: number;
}

interface QuestionDisplayProps {
  question: Question;
  index: number;
  responses: {
    totalStudents: number;
    totalAnswers?: number;
    optionCounts?: number[];
    correctPercentage?: number;
    distribution: ResponseDistribution[];
  };
}

export function QuestionDisplay({ 
  question,
  index,
  responses
}: QuestionDisplayProps) {
  // Use totalStudents as fallback for totalAnswers
  const totalAnswers = responses.totalAnswers || responses.totalStudents;
  
  // Fix null check for options by adding a guard clause and filtering out null values
  const safeOptions = React.useMemo(() => {
    if (!question.options || !Array.isArray(question.options)) return [];
    return question.options.filter((opt): opt is NonNullable<typeof opt> => opt !== null && opt !== undefined);
  }, [question.options]);
  
  // Color palette for chart segments - vibrant colors (no black)
  const optionColors = ["blue", "amber", "indigo", "rose", "cyan", "purple", "orange", "teal"];
  
  // Process distribution data with consistent colors
  const processedChartData = React.useMemo(() => {
    // Create a map to track which label gets which color
    const colorMap = new Map<string, string>();
    
    // Always assign green to correct answers
    responses.distribution.forEach(item => {
      if (item.isCorrect || item.category === "Correct") {
        colorMap.set(item.label || item.category || "", "emerald");
      }
    });
    
    // For non-correct answers, assign distinct colors from our palette
    let colorIndex = 0;
    responses.distribution.forEach(item => {
      const key = item.label || item.category || "";
      if (!colorMap.has(key)) {
        colorMap.set(key, optionColors[colorIndex % optionColors.length]);
        colorIndex++;
      }
    });
    
    return {
      data: responses.distribution.map(item => ({
        name: item.category || item.label || "",
        value: item.value || item.count
      })),
      colors: responses.distribution.map(item => 
        colorMap.get(item.label || item.category || "") || "blue"
      )
    };
  }, [responses.distribution, optionColors]);
  
  return (
    <div>
      {/* Standard style element without jsx prop */}
      <style>
        {`
          .recharts-pie-label-text {
            font-size: 9px !important;
            font-weight: 500 !important;
          }
        `}
      </style>
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs py-0.5 px-2">Question {index + 1}</Badge>
            <h4 className="text-sm font-medium">{question.text}</h4>
    </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <InfoIcon className="h-3 w-3" />
            <span>{totalAnswers} responses</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Tabs defaultValue="options" className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-8">
              <TabsTrigger value="options" className="text-xs">Options</TabsTrigger>
              <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="options" className="pt-4">
        <div className="space-y-3">
                {safeOptions.length > 0 ? (
                  safeOptions.map((option, i) => {
                    // Type guards to handle different option formats
                    const isObject = typeof option === 'object';
                    
                    // Handle object options (with text and isCorrect properties)
                    let isCorrect = false;
                    let optionText = '';
                    
                    if (isObject) {
                      // For object options, check if it has isCorrect property
                      const optionObj = option as Record<string, any>;
                      isCorrect = Boolean(optionObj.isCorrect);
                      optionText = optionObj.text ? String(optionObj.text) : '';
                    } else {
                      // For string options, check if it matches correctAnswer
                      optionText = String(option);
                      isCorrect = optionText === question.correctAnswer;
                    }
                    
                    return (
                      <div key={i} className="flex flex-col space-y-1">
                        <div className="flex justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                              isCorrect ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span>{optionText}</span>
                </div>
                          {responses.optionCounts && (
                            <span className="font-medium">
                              {responses.optionCounts[i]} ({Math.round((responses.optionCounts[i] / totalAnswers) * 100)}%)
                            </span>
              )}
            </div>
                        {responses.optionCounts && (
                          <Progress 
                            value={(responses.optionCounts[i] / totalAnswers) * 100} 
                            className="h-1.5"
                            indicatorClassName={isCorrect ? "bg-green-500" : "bg-blue-500"}
                          />
                        )}
        </div>
      );
                  })
                ) : (
                  <div className="text-xs text-muted-foreground">
                    No options available for this question type
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <div className="text-xs space-y-3">
                <p><strong>Question Type:</strong> {question.type}</p>
                {/* Check if these properties exist on the question object */}
                {'difficulty' in question && <p><strong>Difficulty:</strong> {question.difficulty as string}</p>}
                {'topic' in question && <p><strong>Topic:</strong> {question.topic as string}</p>}
                {responses.correctPercentage && (
                  <p><strong>Correct Answer Rate:</strong> {responses.correctPercentage}%</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex flex-col justify-center">
          <DonutChart
            className="text-xs font-medium h-full"
            data={processedChartData.data}
            category="value"
            index="name"
            colors={processedChartData.colors}
            valueFormatter={(value) => `${value}%`}
            showAnimation={false}
            showTooltip={true}
          />
            </div>
          </div>
        </div>
      );
}
