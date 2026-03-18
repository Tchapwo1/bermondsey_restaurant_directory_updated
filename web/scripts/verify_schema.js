const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env from the web directory
dotenv.config({ path: path.join(__dirname, '../web/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('--- Verifying Database Schema ---');

  // 1. Check restaurants for owner_id
  const { data: resData, error: resError } = await supabase
    .from('restaurants')
    .select('owner_id')
    .limit(1);
  
  if (resError) {
    console.error('❌ Error checking owner_id in restaurants:', resError.message);
  } else {
    console.log('✅ restaurants.owner_id column exists.');
  }

  // 2. Check analytics table
  const { data: anaData, error: anaError } = await supabase
    .from('analytics')
    .select('count')
    .limit(1);
  
  if (anaError && anaError.code !== 'PGRST116') { // PGRST116 is just empty
    console.error('❌ Error checking analytics table:', anaError.message);
  } else {
    console.log('✅ analytics table exists and is accessible.');
  }

  // 3. Check blog_posts table
  const { data: blogData, error: blogError } = await supabase
    .from('blog_posts')
    .select('count')
    .limit(1);
  
  if (blogError && blogError.code !== 'PGRST116') {
    console.error('❌ Error checking blog_posts table:', blogError.message);
  } else {
    console.log('✅ blog_posts table exists and is accessible.');
  }

  process.exit(0);
}

verify();
