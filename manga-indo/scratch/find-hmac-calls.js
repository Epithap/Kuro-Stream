import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const target = '_hmac';
let idx = 0;
while ((idx = content.indexOf(target, idx)) !== -1) {
  console.log(`Found "${target}" at index ${idx}:`);
  console.log(content.substring(idx - 150, idx + 150));
  idx += target.length;
}
