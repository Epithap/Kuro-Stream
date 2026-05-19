import fs from 'fs';

const content = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const idx = content.indexOf('function ls(');
if (idx !== -1) {
  console.log('ls function found!');
  console.log(content.substring(idx, idx + 1000));
} else {
  // Let's search for "ls(" definition in different ways
  const idx2 = content.indexOf('ls=function');
  if (idx2 !== -1) {
    console.log('ls definition found (2):');
    console.log(content.substring(idx2 - 100, idx2 + 1000));
  } else {
    // Let's search for "function Lb(" or similar helper since "Lb" was in our dump
    const idx3 = content.indexOf('function Lb(');
    if (idx3 !== -1) {
      console.log('Lb function found:');
      console.log(content.substring(idx3, idx3 + 1200));
    }
  }
}
