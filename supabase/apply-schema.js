const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file if using dotenv
// require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Read the schema SQL file
const schemaFilePath = path.join(__dirname, 'schema.sql');
const schemaSql = fs.readFileSync(schemaFilePath, 'utf8');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function applySchema() {
  console.log('Starting schema application...');
  
  try {
    // Execute the schema SQL
    const { error } = await supabase.rpc('pgexec', { query: schemaSql });
    
    if (error) {
      console.error('Error applying schema:', error);
      return;
    }
    
    console.log('Schema successfully applied!');
    
  } catch (error) {
    console.error('Exception during schema application:', error);
  }
}

// Check if credentials are available
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  process.exit(1);
}

// Run the schema application
applySchema(); 