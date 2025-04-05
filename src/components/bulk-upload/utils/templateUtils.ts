import { ContentType } from '../types';

/**
 * Returns the URL for a CSV template based on the content type
 */
export function getCSVTemplateURL(contentType: string): string {
  // In a real application, these would be actual URLs to CSV templates stored in your public folder or CDN
  // For demonstration purposes, we're using placeholder URLs
  
  const baseUrl = '/templates';
  
  const templateMap: Record<string, string> = {
    'curriculum_questions': `${baseUrl}/curriculum_questions_template.csv`,
    'practice_questions': `${baseUrl}/practice_questions_template.csv`,
    'reading_materials': `${baseUrl}/reading_materials_template.csv`,
    'audio_activities': `${baseUrl}/audio_activities_template.csv`,
    'story_activities': `${baseUrl}/story_activities_template.csv`,
    'video_resources': `${baseUrl}/video_resources_template.csv`,
    'image_resources': `${baseUrl}/image_resources_template.csv`,
    'document_resources': `${baseUrl}/document_resources_template.csv`,
  };
  
  return templateMap[contentType] || `${baseUrl}/generic_template.csv`;
}

/**
 * Returns the structure of a CSV template based on the content type
 * This could be used to dynamically generate templates if no static files are available
 */
export function getCSVTemplateStructure(contentType: string): string {
  switch (contentType) {
    case 'curriculum_questions':
      return 'Curriculum_Name,Grade,Age,Subject,Question_Text,Option_A,Option_B,Option_C,Option_D,Correct_Answer,Explanation';
      
    case 'practice_questions':
      return 'Curriculum_Name,Grade,Age,Subject,Question_Text,Question_Type,Options,Correct_Answer,Explanation,Difficulty';
      
    case 'reading_materials':
      return 'Curriculum_Name,Grade_Level,Age,Subject,Title,Author,Content_Text,Questions,Keywords';
      
    case 'audio_activities':
      return 'Title,Speaker,Length_Seconds,Transcript,Question_Text,Question_Type,Options,Correct_Answer,Grade_Level,Subject,Instructions';
      
    case 'story_activities':
      return 'Story_Title,Author,Age_Group,Story_Text,Question_Text,Question_Type,Options,Correct_Answer,Moral_Lesson,Keywords';
      
    case 'video_resources':
      return 'Title,Video_URL,Description,Duration_Minutes,Grade_Level,Subject,Author_Source,Keywords,Related_Topics';
      
    case 'image_resources':
      return 'Title,Image_URL,Description,Grade_Level,Subject,Source,Keywords,License_Info';
      
    case 'document_resources':
      return 'Title,Document_URL,Document_Type,Description,Grade_Level,Subject,Author,Page_Count,Keywords';
      
    default:
      return 'Title,Content,Type,Description';
  }
}

/**
 * Function to dynamically create a CSV file if static templates aren't available
 */
export function createDynamicCSVTemplate(contentType: string): string {
  const headers = getCSVTemplateStructure(contentType);
  // Add a sample row below the headers
  const sampleData = getSampleData(contentType);
  
  return `${headers}\n${sampleData}`;
}

/**
 * Helper function to get sample data for a dynamic CSV template
 */
function getSampleData(contentType: string): string {
  switch (contentType) {
    case 'curriculum_questions':
      return 'National Standard,3rd Grade,8-9,Mathematics,"What is 8 × 7?",54,56,58,62,56,"8 × 7 = 56 because 8 × 7 means 8 groups of 7, which equals 56"';
      
    case 'practice_questions':
      return 'National Standard,3rd Grade,8-9,Mathematics,"What is 8 + 7?",multiple_choice,"15,14,16,17",15,"8 + 7 = 15",medium\nNational Standard,3rd Grade,8-9,Mathematics,"Paris is the capital of _____",fill_blank,,France,"Paris is the capital of France",easy\nNational Standard,3rd Grade,8-9,Science,"The Earth is flat",true_false,"True,False",False,"The Earth is an oblate spheroid, not flat",medium';
      
    case 'reading_materials':
      return 'National Standard,2nd Grade,7-8,Science,"The Water Cycle",Earth Science Team,"Water constantly moves between Earth\'s surface and the atmosphere through a process called the water cycle. This cycle has several stages including: evaporation, condensation, precipitation, and collection...","1. What causes water to evaporate? 2. What is condensation?","water cycle,evaporation,condensation,precipitation"';
      
    case 'audio_activities':
      return '"Animal Habitats",Teacher Jones,120,"Today we\'ll learn about where animals live. Some animals live in forests...","What habitat was mentioned first in the recording?",multiple_choice,"Desert,Forest,Ocean,Mountain",Forest,3rd Grade,Science,"Listen carefully and identify the habitat mentioned first"';
      
    case 'story_activities':
      return '"The Tortoise and the Hare",Aesop,7-10,"Once upon a time, there was a tortoise and a hare...","Who won the race?",multiple_choice,"Tortoise,Hare,Both,Neither",Tortoise,"Slow and steady wins the race","patience,persistence,competition"';
      
    case 'video_resources':
      return '"Introduction to Photosynthesis","https://example.com/videos/photosynthesis.mp4","A clear explanation of how plants make their food using sunlight",8,"4th Grade",Science,"Biology Education Channel","photosynthesis,plants,biology,energy","plant biology,energy cycles"';
      
    case 'image_resources':
      return '"Solar System Diagram","https://example.com/images/solar-system.jpg","A detailed diagram showing the planets in our solar system","5th Grade",Science,"NASA","solar system,planets,astronomy","Creative Commons Attribution 4.0"';
      
    case 'document_resources':
      return '"Fractions Worksheet","https://example.com/docs/fractions-worksheet.pdf",pdf,"Practice worksheet with 20 fraction problems for beginners","3rd Grade",Mathematics,"Math Learning Center",4,"fractions,math,practice"';
      
    default:
      return 'Sample Title,Sample Content,Sample Type,Sample Description';
  }
} 