import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

function extractFunction(name) {
  const startIdx = code.indexOf(`function ${name}(`);
  if (startIdx === -1) {
    // Try without space
    const startIdx2 = code.indexOf(`function ${name}`);
    if (startIdx2 === -1) return null;
    
    // Find matching braces
    let braceCount = 0;
    let endIdx = startIdx2;
    let foundStart = false;
    while (endIdx < code.length) {
      if (code[endIdx] === '{') {
        braceCount++;
        foundStart = true;
      } else if (code[endIdx] === '}') {
        braceCount--;
      }
      endIdx++;
      if (foundStart && braceCount === 0) {
        break;
      }
    }
    return code.substring(startIdx2, endIdx);
  }
  
  let braceCount = 0;
  let endIdx = startIdx;
  let foundStart = false;
  while (endIdx < code.length) {
    if (code[endIdx] === '{') {
      braceCount++;
      foundStart = true;
    } else if (code[endIdx] === '}') {
      braceCount--;
    }
    endIdx++;
    if (foundStart && braceCount === 0) {
      break;
    }
  }
  return code.substring(startIdx, endIdx);
}

// Let's print function locations and sizes
const funcs = ['Yo', 'qo', 'Lb', 'Rb', 'Fb', 'H'];
let runner = '';
for (const f of funcs) {
  const extracted = extractFunction(f);
  if (extracted) {
    console.log(`Extracted function ${f}, length: ${extracted.length}`);
    runner += extracted + '\n';
  } else {
    console.log(`Could not extract function ${f}`);
  }
}

// Let's define global wrappers or helpers
runner += `
globalThis.Yo = Yo;
globalThis.qo = qo;
globalThis.Lb = Lb;
globalThis.Rb = Rb;
globalThis.Fb = Fb;
globalThis.H = H;
`;

fs.writeFileSync('scratch/decrypters-extracted.js', runner);
console.log('Saved to scratch/decrypters-extracted.js');
