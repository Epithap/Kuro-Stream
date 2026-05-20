import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const targetIdx = 585500;
console.log('Context around index 585500:');
console.log(code.substring(targetIdx, targetIdx + 3500));
