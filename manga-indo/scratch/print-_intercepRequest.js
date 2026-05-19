import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const targetIdx = 596600;
console.log('Context around index 596600:');
console.log(code.substring(targetIdx, targetIdx + 4000));
