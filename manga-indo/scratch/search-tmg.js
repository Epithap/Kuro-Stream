import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

// Find all function Lb definitions
let idx = 0;
while (true) {
  idx = code.indexOf('Lb(', idx);
  if (idx === -1) break;
  // Let's see if it's a function definition
  const prevStr = code.substring(idx - 15, idx);
  if (prevStr.includes('function') || prevStr.includes('var') || prevStr.includes('let') || prevStr.includes('const')) {
    console.log(`Found definition of Lb at index ${idx}:`);
    console.log(code.substring(idx - 30, idx + 100));
  }
  idx += 3;
}
