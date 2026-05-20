import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

let idx = 0;
while ((idx = content.indexOf('yb', idx)) !== -1) {
  // Let's filter out non-variable references
  const context = content.substring(idx - 20, idx + 40);
  console.log(`Found "yb" at index ${idx}: "${context}"`);
  idx += 2;
}
