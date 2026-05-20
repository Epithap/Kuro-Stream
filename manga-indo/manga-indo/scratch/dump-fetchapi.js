import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const idx = content.indexOf('fetchApi:async(e,t)=>{');
if (idx !== -1) {
  console.log('--- fetchApi SOURCE ---');
  console.log(content.substring(idx - 200, idx + 3800));
} else {
  console.log('fetchApi target not found');
}
