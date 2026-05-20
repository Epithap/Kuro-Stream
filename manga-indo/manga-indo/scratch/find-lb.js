import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const targets = ['function Lb(', 'function Rb(', 'Rb=function'];

for (const t of targets) {
  let idx = content.indexOf(t);
  if (idx !== -1) {
    console.log(`Found "${t}"`);
    console.log(content.substring(idx, idx + 800));
  }
}
