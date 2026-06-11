import dotenv from 'dotenv';
import fetch from 'node-fetch'; // fallback if needed, but Node has fetch built-in

dotenv.config({ path: '.env.local' });
(async () => {
  try {
    const res = await fetch('http://localhost:3000/admin/blog');
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('First 500 chars:', text.substring(0, 500));
  } catch (e) {
    console.error('Error:', e);
  }
})();