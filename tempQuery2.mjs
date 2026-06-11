import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
(async () => {
  const { data, error } = await supabase.from('blog_posts').select('id,title,slug,status,published,cover_image_url');
  console.log('Error:', error);
  console.log('Data length:', data?.length);
  console.log('Data:', data);
})();