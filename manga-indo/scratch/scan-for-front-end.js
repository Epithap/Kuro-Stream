import fs from 'fs';
import path from 'path';

const dir = 'scratch/js_files';
const files = fs.readdirSync(dir);

for (const f of files) {
  const filePath = path.join(dir, f);
  const content = fs.readFileSync(filePath, 'utf8');
  const term = 'WM_WEB_FRONT_END';
  const idx = content.indexOf(term);
  if (idx !== -1) {
    console.log(`Found in: ${f} at index ${idx}`);
    console.log('Context:\n', content.substring(idx - 100, idx + 200));
  }
}
