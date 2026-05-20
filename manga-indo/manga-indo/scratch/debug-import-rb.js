import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const rbIdx = code.indexOf('function Rb(){');
const rbEndIdx = code.indexOf('function Lb', rbIdx);
const rbCodeRaw = code.substring(rbIdx, rbEndIdx);

const matches = rbCodeRaw.match(/import[\s\S]*?from[\s\S]*?/g);
console.log('Matches found:', matches ? matches.length : 0);
if (matches) {
  for (let i = 0; i < Math.min(matches.length, 5); i++) {
    console.log(`Match ${i}:`, matches[i].substring(0, 100));
  }
}

// Let's print any occurrences of "import" anywhere in rbCodeRaw
let idx = 0;
while ((idx = rbCodeRaw.indexOf('import', idx)) !== -1) {
  console.log('Occurence of "import":', rbCodeRaw.substring(idx, idx + 100));
  idx += 6;
}
