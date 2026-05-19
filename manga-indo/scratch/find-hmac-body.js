import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const target = 'Fb(208';
let idx = 0;
while ((idx = content.indexOf(target, idx)) !== -1) {
  console.log(`Found "${target}" at index ${idx}:`);
  console.log(content.substring(idx - 100, idx + 400));
  idx += target.length;
}
