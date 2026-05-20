import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

let idx = 0;
while ((idx = content.indexOf('function Fb', idx)) !== -1) {
  console.log(`Fb definition at index ${idx}:`);
  console.log(content.substring(idx, idx + 100));
  idx += 11;
}

let idx2 = 0;
while ((idx2 = content.indexOf('Fb=', idx2)) !== -1) {
  console.log(`Fb assignment at index ${idx2}:`);
  console.log(content.substring(idx2 - 50, idx2 + 150));
  idx2 += 3;
}
