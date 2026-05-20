import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const markers = [')(Rb,', ')(cs,', ')(Yo,', ')(us,', ')(Lb,', ')(Fb,'];
for (const m of markers) {
  let idx = 0;
  while (true) {
    idx = code.indexOf(m, idx);
    if (idx === -1) break;
    console.log(`Found marker ${m} at index ${idx}:`);
    console.log(code.substring(idx - 100, idx + m.length + 50));
    idx += m.length;
  }
}
