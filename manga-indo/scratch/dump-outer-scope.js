import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const idx = content.indexOf('fetchApi:async(e,t)=>{');
if (idx !== -1) {
  // Let's print the outer function containing fetchApi to see where "r" is defined!
  console.log('--- OUTER SCOPE ---');
  console.log(content.substring(idx - 1500, idx));
}
