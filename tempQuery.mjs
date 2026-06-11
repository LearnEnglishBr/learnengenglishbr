import { createClient } from './lib/supabase/server.js';
(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('blog_posts').select('id,title,slug,status,published,cover_image_url');
  console.log('Error:', error);
  console.log('Data:', data);
})();