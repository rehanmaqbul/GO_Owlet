import { ContentType } from './types';

interface FormatGuidelinesProps {
  contentType?: ContentType | string;
}

export const FormatGuidelines = ({ contentType }: FormatGuidelinesProps) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Please ensure your files follow our required format:
      </p>
      
      <ul className="list-disc pl-5 space-y-2 text-gray-700">
        <li>CSV files only</li>
        <li>First row must contain headers</li>
        <li>Required columns depend on content type</li>
        <li>Maximum file size: 5MB</li>
      </ul>
      
      {contentType && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Columns for {getContentTypeDisplay(contentType)}:</h4>
          
          {contentType === 'curriculum_questions' && (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Curriculum_Name (required)</li>
              <li>Grade (required)</li>
              <li>Age (optional)</li>
              <li>Subject (required)</li>
              <li>Question_Text (required)</li>
              <li>Option_A, Option_B, Option_C, Option_D (required for multiple choice)</li>
              <li>Correct_Answer (required)</li>
              <li>Explanation (optional)</li>
            </ul>
          )}
          
          {contentType === 'practice_questions' && (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Curriculum_Name (required)</li>
              <li>Grade (required)</li>
              <li>Age (optional)</li>
              <li>Subject (required)</li>
              <li>Question_Text (required)</li>
              <li>Question_Type (required: multiple_choice, fill_blank, true_false, yes_no)</li>
              <li>Options (for multiple_choice, separate with commas)</li>
              <li>Correct_Answer (required)</li>
              <li>Explanation (optional)</li>
              <li>Difficulty (optional: easy, medium, hard)</li>
            </ul>
          )}
          
          {contentType === 'reading_materials' && (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Curriculum_Name (required)</li>
              <li>Grade_Level (required)</li>
              <li>Age (optional)</li>
              <li>Subject (required)</li>
              <li>Title (required)</li>
              <li>Author (optional)</li>
              <li>Content_Text (required)</li>
              <li>Questions (optional, separate with pipe |)</li>
              <li>Keywords (optional, separate with commas)</li>
            </ul>
          )}

          {contentType === 'audio_activities' && (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Title (required)</li>
              <li>Speaker (optional)</li>
              <li>Length_Seconds (optional)</li>
              <li>Transcript (required)</li>
              <li>Question_Text (required for questions)</li>
              <li>Question_Type (required: multiple_choice, fill_blank)</li>
              <li>Options (for multiple_choice, separate with commas)</li>
              <li>Correct_Answer (required for questions)</li>
              <li>Grade_Level (required)</li>
              <li>Subject (required)</li>
              <li>Instructions (optional)</li>
            </ul>
          )}

          {contentType === 'story_activities' && (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Story_Title (required)</li>
              <li>Author (optional)</li>
              <li>Age_Group (required)</li>
              <li>Story_Text (required)</li>
              <li>Question_Text (required for questions)</li>
              <li>Question_Type (required: multiple_choice, fill_blank)</li>
              <li>Options (for multiple_choice, separate with commas)</li>
              <li>Correct_Answer (required for questions)</li>
              <li>Moral_Lesson (optional)</li>
              <li>Keywords (optional, separate with commas)</li>
            </ul>
          )}

          {contentType === 'video_resources' && (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Title (required)</li>
              <li>Video_URL (required)</li>
              <li>Description (required)</li>
              <li>Duration_Minutes (optional)</li>
              <li>Grade_Level (required)</li>
              <li>Subject (required)</li>
              <li>Author_Source (optional)</li>
              <li>Keywords (optional, separate with commas)</li>
              <li>Related_Topics (optional)</li>
            </ul>
          )}

          {contentType === 'image_resources' && (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Title (required)</li>
              <li>Image_URL (required)</li>
              <li>Description (required)</li>
              <li>Grade_Level (required)</li>
              <li>Subject (required)</li>
              <li>Source (optional)</li>
              <li>Keywords (optional, separate with commas)</li>
              <li>License_Info (optional)</li>
            </ul>
          )}

          {contentType === 'document_resources' && (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Title (required)</li>
              <li>Document_URL (required)</li>
              <li>Document_Type (required: pdf, doc, worksheet)</li>
              <li>Description (required)</li>
              <li>Grade_Level (required)</li>
              <li>Subject (required)</li>
              <li>Author (optional)</li>
              <li>Page_Count (optional)</li>
              <li>Keywords (optional, separate with commas)</li>
            </ul>
          )}
        </div>
      )}
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h5 className="font-medium text-blue-700 mb-2">Pro Tips</h5>
        <ul className="list-disc pl-5 space-y-1 text-blue-700">
          <li>Use our template for correct formatting</li>
          <li>Validate your CSV before uploading</li>
          <li>For large datasets, split into multiple files</li>
          <li>Check for special characters that might cause issues</li>
        </ul>
      </div>
      
      <div className="text-center mt-4">
        <a 
          href="#"
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          onClick={(e) => {
            e.preventDefault();
            window.open('/help/bulk-upload-guide.pdf', '_blank');
          }}
        >
          Download Complete Format Guide
        </a>
      </div>
    </div>
  );
};

// Helper function to get a display name
function getContentTypeDisplay(type: string): string {
  const typeMap: Record<string, string> = {
    'curriculum_questions': 'Multiple-Choice Questions',
    'practice_questions': 'Practice Questions',
    'reading_materials': 'Reading Materials',
    'audio_activities': 'Audio Activities',
    'story_activities': 'Story Activities',
    'video_resources': 'Video Resources',
    'image_resources': 'Image Resources',
    'document_resources': 'Document Resources'
  };
  
  return typeMap[type] || type;
}
