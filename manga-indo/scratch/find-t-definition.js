import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const targetIdx = 584130;
console.log('Context around index 584130:');
console.log(code.substring(targetIdx - 500, targetIdx + 500));
