import fs from 'fs';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const targetIdx = 30800;
console.log('Context from index 30800 to 45800:');
// Let's write it to a separate file so we can view it cleanly or grep it
fs.writeFileSync('scratch/jo-class.js', code.substring(targetIdx, targetIdx + 15000));
console.log('Saved to scratch/jo-class.js');
