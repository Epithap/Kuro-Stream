import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const idx = code.indexOf('var Jo=class');
console.log('Index of var Jo=class:', idx);
if (idx !== -1) {
  console.log('Code around var Jo=class:');
  console.log(code.substring(idx - 100, idx + 2500));
}
