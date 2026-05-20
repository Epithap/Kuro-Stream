import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const target = 'yb=`';
const idx = content.indexOf(target);
if (idx !== -1) {
  const start = idx + target.length;
  const end = content.indexOf('`', start);
  const val = content.substring(start, end);
  console.log('yb raw string:', val);
  console.log('yb length:', val.length);
  for (let i = 0; i < val.length; i++) {
    console.log(`${i}: "${val[i]}" (code: ${val.charCodeAt(i)})`);
  }
} else {
  console.log('yb not found');
}
