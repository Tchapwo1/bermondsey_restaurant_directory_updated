const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET_NAME = 'restaurant-images';
const BASE_DIR = path.join(__dirname, '../../');
const RESTAURANTS_JSON = path.join(BASE_DIR, 'restaurants.json');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: Supabase environment variables missing in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function uploadFile(localPath, supabasePath) {
  const fileBuffer = fs.readFileSync(localPath);
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(supabasePath, fileBuffer, {
      upsert: true,
      contentType: 'image/jpeg'
    });

  if (error) {
    console.error(`  - Failed to upload ${localPath}:`, error.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(supabasePath);

  return publicUrl;
}

async function migrate() {
  console.log('--- Starting Photo Migration ---');
  
  const restaurants = JSON.parse(fs.readFileSync(RESTAURANTS_JSON, 'utf8'));
  
  for (const res of restaurants) {
    console.log(`\nProcessing: ${res.name} (${res.slug})...`);
    const resFolder = path.join(BASE_DIR, res.folder_name);
    
    if (!fs.existsSync(resFolder)) {
      console.warn(`  - Warning: Folder ${res.folder_name} not found locally.`);
      continue;
    }

    let coverUrl = null;
    let galleryUrls = [];

    // 1. Process Cover
    const coverPath = path.join(resFolder, 'cover.jpg');
    if (fs.existsSync(coverPath)) {
      console.log(`  - Uploading cover...`);
      coverUrl = await uploadFile(coverPath, `${res.slug}/cover.jpg`);
    }

    // 2. Process Subfolders (food, interior, branding, etc.)
    const subdirs = ['food', 'interior', 'branding', 'chef', 'drinks', 'exterior'];
    for (const subdir of subdirs) {
      const subdirPath = path.join(resFolder, subdir);
      if (fs.existsSync(subdirPath) && fs.lstatSync(subdirPath).isDirectory()) {
        const files = fs.readdirSync(subdirPath).filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png') || f.toLowerCase().endsWith('.jpeg'));
        
        console.log(`  - Found ${files.length} images in ${subdir}...`);
        for (const file of files) {
          const filePath = path.join(subdirPath, file);
          const supabasePath = `${res.slug}/${subdir}/${file}`;
          const url = await uploadFile(filePath, supabasePath);
          if (url) galleryUrls.push(url);
        }
      }
    }

    // 3. Update Database
    console.log(`  - Updating database for ${res.slug}...`);
    const updateData = {
      cover_image_url: coverUrl || undefined,
      gallery_images: galleryUrls.length > 0 ? galleryUrls : undefined,
    };

    const { error: updateError } = await supabase
      .from('restaurants')
      .update(updateData)
      .eq('slug', res.slug);

    if (updateError) {
      console.error(`  - Error updating database for ${res.slug}:`, updateError.message);
    } else {
      console.log(`  - Successfully updated ${res.name}. ${galleryUrls.length} gallery images uploaded.`);
    }
  }

  console.log('\n--- Migration Complete! ---');
}

migrate();
