import fs from 'fs';
import vm from 'vm';

const runner = fs.readFileSync('scratch/decrypters-rotated.js', 'utf8');
const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const context = vm.createContext({
  globalThis: {},
  console: console
});

vm.runInContext(runner, context);

const { qo, us, ls, Lb, Fb } = context.globalThis;

function H(e, t) {
  return qo(e - 771, t);
}

// Search for /api/ in the code and find the surrounding expression
let idx = 0;
const seenEndpoints = new Set();

while (true) {
  idx = code.indexOf('/api/', idx);
  if (idx === -1) break;
  
  // Let's grab the surrounding 300 characters
  const start = Math.max(0, idx - 100);
  const end = Math.min(code.length, idx + 200);
  const snippet = code.substring(start, end);
  
  // Try to find helper function definitions inside the same class/file block
  // A helper function usually looks like: function s(e,t){return H(t- -987,e)}
  // or function n(e,t){return H(e- -825,t)}
  // Let's scan backward from idx to find "function (s|n|r|i|a|o)\("
  const blockStart = Math.max(0, idx - 4000);
  const block = code.substring(blockStart, idx + 500);
  
  // Let's run a search for local functions inside block
  const localFuncs = {};
  const funcRegex = /function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)\s*\{\s*return\s+([^}]+)\}/g;
  let match;
  while ((match = funcRegex.exec(block)) !== null) {
    const name = match[1];
    const params = match[2].split(',').map(p => p.trim());
    const body = match[3];
    localFuncs[name] = { params, body };
  }
  
  // Let's look at the expression starting from `/api/`
  // We want to extract the full string concatenation.
  // It usually ends with a comma, semicolon, or closing bracket/parenthesis.
  // Let's parse it simply:
  const apiStart = snippet.indexOf('`/api/`');
  if (apiStart !== -1) {
    const exprSnippet = snippet.substring(apiStart);
    // Find the end of the expression (e.g. comma, semicolon, or object end)
    let exprEnd = 0;
    let parenCount = 0;
    let braceCount = 0;
    while (exprEnd < exprSnippet.length) {
      const char = exprSnippet[exprEnd];
      if (char === '(') parenCount++;
      else if (char === ')') parenCount--;
      else if (char === '{') braceCount++;
      else if (char === '}') braceCount--;
      
      if (parenCount === 0 && braceCount === 0 && (char === ',' || char === ';' || char === '\n')) {
        break;
      }
      exprEnd++;
    }
    const expr = exprSnippet.substring(0, exprEnd).trim();
    
    // Evaluate the expression by setting up a VM sandbox containing H and localFuncs
    try {
      const sandbox = { H, qo, us, ls, Lb, Fb, encodeURIComponent: (x) => `{${x}}` };
      // Inject local function definitions
      let setupCode = '';
      for (const [name, info] of Object.entries(localFuncs)) {
        setupCode += `function ${name}(${info.params.join(',')}){ return ${info.body}; }\n`;
      }
      const evalCode = `${setupCode} (${expr})`;
      const result = vm.runInNewContext(evalCode, sandbox);
      if (!seenEndpoints.has(result)) {
        seenEndpoints.add(result);
        console.log(`\nExpression: ${expr}`);
        console.log(`Decrypted:  ${result}`);
      }
    } catch (err) {
      // console.log(`Failed to eval: ${expr} - ${err.message}`);
    }
  }
  
  idx += 5;
}
