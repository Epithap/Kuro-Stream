import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const helpers = ['IRCZp', 'Qtzdi', 'JQXji', 'JsUnG'];

for (const h of helpers) {
  let idx = 0;
  while ((idx = content.indexOf(h + ':', idx)) !== -1) {
    console.log(`Found "${h}" definition at index ${idx}:`);
    console.log(content.substring(idx, idx + 200));
    idx += h.length;
  }
}
