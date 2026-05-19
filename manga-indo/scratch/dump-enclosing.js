import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const idx = content.indexOf('fetchApi:async(e,t)=>{');
if (idx !== -1) {
  console.log('--- ENCLOSING STRUCTURE ---');
  console.log(content.substring(Math.max(0, idx - 8000), idx));
}
