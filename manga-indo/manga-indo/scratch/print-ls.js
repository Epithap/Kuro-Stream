import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

function extractFunction(name) {
  const startStr = `function ${name}(`;
  let startIdx = code.indexOf(startStr);
  if (startIdx === -1) {
    const startStr2 = `var ${name}=function`;
    startIdx = code.indexOf(startStr2);
    if (startIdx === -1) {
      const startStr3 = `let ${name}=function`;
      startIdx = code.indexOf(startStr3);
      if (startIdx === -1) return null;
    }
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

const funcs = ['Yo', 'qo', 'cs', 'us', 'ls'];
for (const f of funcs) {
  const c = extractFunction(f);
  console.log(`--- ${f} (length: ${c?.length}) ---`);
  console.log(c?.substring(0, 150));
}

