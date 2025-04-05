import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Extended jsPDF type to include autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface StudentData {
  id: string;
  name: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  submissionTime: string;
  grade: string;
}

export interface SubjectData {
  name: string;
  percentage: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
}

export interface QuestionData {
  id: string;
  text: string;
  type: string;
  isCorrect: boolean;
  correctAnswer: string;
}

export interface PdfExportOptions {
  includePerformanceMetrics?: boolean;
  includeQuestionAnalysis?: boolean;
  includeStudentTable?: boolean;
  includeClassHeaderInfo?: boolean;
  teacherName?: string;
  className?: string;
  schoolName?: string;
  dateRange?: string;
}

const defaultOptions: PdfExportOptions = {
  includePerformanceMetrics: true,
  includeQuestionAnalysis: true,
  includeStudentTable: true,
  includeClassHeaderInfo: true
};

export const generatePdf = async (
  subject: SubjectData,
  students: StudentData[],
  questions: QuestionData[],
  options: PdfExportOptions = {}
) => {
  // Merge with default options
  const exportOptions = { ...defaultOptions, ...options };
  
  // Initialize PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add document title and header
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246); // Indigo-500 color
  doc.text(`${subject.name} - Class Performance Report`, 15, 20);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128); // Gray-500 color
  const now = new Date();
  doc.text(`Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 15, 27);
  
  // Add class info header if included
  if (exportOptions.includeClassHeaderInfo) {
    doc.setDrawColor(229, 231, 235); // Gray-200 color
    doc.setLineWidth(0.5);
    doc.line(15, 31, 195, 31);
    
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55); // Gray-800 color
    let yPos = 38;
    
    if (exportOptions.teacherName) {
      doc.text(`Teacher: ${exportOptions.teacherName}`, 15, yPos);
      yPos += 6;
    }
    
    if (exportOptions.className) {
      doc.text(`Class: ${exportOptions.className}`, 15, yPos);
      yPos += 6;
    }
    
    if (exportOptions.schoolName) {
      doc.text(`School: ${exportOptions.schoolName}`, 15, yPos);
      yPos += 6;
    }
    
    if (exportOptions.dateRange) {
      doc.text(`Period: ${exportOptions.dateRange}`, 15, yPos);
      yPos += 6;
    }
    
    doc.line(15, yPos, 195, yPos);
    yPos += 8;
  } else {
    // If no header info, just add some space
    doc.line(15, 31, 195, 31);
    doc.setLineWidth(0.5);
  }
  
  let yPosition = exportOptions.includeClassHeaderInfo ? 45 : 35;
  
  // Performance Summary
  if (exportOptions.includePerformanceMetrics) {
    yPosition += 5;
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55); // Gray-800 color
    doc.text('Performance Summary', 15, yPosition);
    yPosition += 5;
    
    // Add metrics boxes
    doc.setFillColor(243, 244, 246); // Gray-100 color
    doc.roundedRect(15, yPosition, 180, 30, 3, 3, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55); // Gray-800 color
    yPosition += 8;
    
    // Draw metric boxes in a row
    const metrics = [
      {
        label: 'Class Average',
        value: `${subject.percentage}%`,
        color: subject.percentage >= 70 ? [34, 197, 94] : subject.percentage >= 50 ? [234, 179, 8] : [239, 68, 68] // Color based on performance
      },
      {
        label: 'Total Questions',
        value: subject.totalQuestions.toString(),
        color: [59, 130, 246] // Blue color
      },
      {
        label: 'Correct Answers',
        value: subject.correctAnswers.toString(),
        color: [34, 197, 94] // Green color
      },
      {
        label: 'Incorrect Answers',
        value: subject.wrongAnswers.toString(),
        color: [239, 68, 68] // Red color
      }
    ];
    
    metrics.forEach((metric, index) => {
      const boxWidth = 40;
      const xPos = 20 + (index * 45);
      
      // Box label
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128); // Gray-500 color
      doc.text(metric.label, xPos, yPosition);
      
      // Box value
      doc.setFontSize(16);
      doc.setTextColor(metric.color[0], metric.color[1], metric.color[2]);
      doc.text(metric.value, xPos, yPosition + 10);
    });
    
    yPosition += 20;
    
    // Add student grade distribution
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55); // Gray-800 color
    doc.text('Grade Distribution', 15, yPosition);
    yPosition += 5;
    
    // Count grades
    const gradeCounts = {
      A: students.filter(s => s.grade === 'A').length,
      B: students.filter(s => s.grade === 'B').length,
      C: students.filter(s => s.grade === 'C').length,
      D: students.filter(s => s.grade === 'D').length,
      F: students.filter(s => s.grade === 'F').length,
    };
    
    // Draw grade boxes
    const gradeColors = {
      A: [34, 197, 94],  // Green
      B: [59, 130, 246], // Blue
      C: [234, 179, 8],  // Yellow
      D: [249, 115, 22], // Orange
      F: [239, 68, 68]   // Red
    };
    
    Object.entries(gradeCounts).forEach(([grade, count], index) => {
      const boxWidth = 30;
      const xPos = 20 + (index * 35);
      const color = gradeColors[grade as keyof typeof gradeColors];
      
      // Box
      doc.setFillColor(color[0], color[1], color[2], 0.2); // Light version of the color
      doc.roundedRect(xPos, yPosition, boxWidth, 25, 2, 2, 'F');
      
      // Grade label
      doc.setFontSize(14);
      doc.setTextColor(color[0], color[1], color[2]); 
      doc.text(grade, xPos + 12, yPosition + 10);
      
      // Count
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55); // Gray-800 color
      doc.text(count.toString(), xPos + 12, yPosition + 20);
    });
    
    yPosition += 30;
  }
  
  // Students table
  if (exportOptions.includeStudentTable && students.length > 0) {
    yPosition += 8;
    
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55); // Gray-800 color
    doc.text('Student Performance', 15, yPosition);
    yPosition += 8;
    
    // Create table data
    const tableData = students.map(student => [
      student.name,
      `${student.score}%`,
      `${student.correctAnswers}/${student.totalQuestions}`,
      student.grade,
      new Date(student.submissionTime).toLocaleDateString()
    ]);
    
    // Add auto table
    doc.autoTable({
      startY: yPosition,
      head: [['Student Name', 'Score', 'Correct', 'Grade', 'Submission Date']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { 
        fillColor: [79, 70, 229], // Indigo-600 color 
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 40 }
      },
      alternateRowStyles: { fillColor: [249, 250, 251] } // Gray-50 color
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // Questions analysis
  if (exportOptions.includeQuestionAnalysis && questions.length > 0) {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55); // Gray-800 color
    doc.text('Question Analysis', 15, yPosition);
    yPosition += 8;
    
    // Create question data
    const questionData = questions.map((q, idx) => [
      (idx + 1).toString(),
      q.text.length > 50 ? q.text.substring(0, 47) + '...' : q.text,
      q.type.charAt(0).toUpperCase() + q.type.slice(1).replace('_', ' '),
      q.isCorrect ? 'Yes' : 'No',
      countStudentsWithCorrectAnswer(students, q.id)
    ]);
    
    // Add question auto table
    doc.autoTable({
      startY: yPosition,
      head: [['#', 'Question', 'Type', 'Correct?', 'Students Correct']],
      body: questionData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { 
        fillColor: [79, 70, 229], // Indigo-600 color 
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 90 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 30, halign: 'center' }
      },
      alternateRowStyles: { fillColor: [249, 250, 251] } // Gray-50 color
    });
  }
  
  // Add page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128); // Gray-500 color
    doc.text(`Page ${i} of ${totalPages}`, 180, 287);
  }
  
  // Save the PDF
  doc.save(`${subject.name.replace(/\s+/g, '_')}_Class_Report.pdf`);
};

// Helper function to count students with correct answers (mock implementation)
const countStudentsWithCorrectAnswer = (students: StudentData[], questionId: string): string => {
  // In a real app, this would use actual data about which students answered each question correctly
  const correctCount = Math.floor(Math.random() * students.length);
  return `${correctCount}/${students.length}`;
};

// Function to capture HTML elements as images for charts
export const captureChartAsImage = async (chartElement: HTMLElement): Promise<string> => {
  const canvas = await html2canvas(chartElement, { scale: 2 });
  return canvas.toDataURL('image/png');
};

// Example function to add captured charts to PDF
export const addChartToPdf = (doc: jsPDF, chartDataUrl: string, x: number, y: number, width: number, height: number) => {
  doc.addImage(chartDataUrl, 'PNG', x, y, width, height);
  return y + height + 10; // Return the new Y position
}; 