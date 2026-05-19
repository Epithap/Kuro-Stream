import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

let idx = 0;
while ((idx = content.indexOf('function Rb', idx)) !== -1) {
  console.log(`Rb at index ${idx}:`);
  console.log(content.substring(idx, idx + 150));
  idx += 11;
}

let idx2 = 0;
while ((idx2 = content.indexOf('function Lb', idx2)) !== -1) {
  console.log(`Lb at index ${idx2}:`);
  console.log(content.substring(idx2, idx2 + 150));
  idx2 += 11;
}
