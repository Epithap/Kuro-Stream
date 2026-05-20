import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/all-t-decrypted.json', 'utf8'));

const targets = ['x-wm-', 'request', 'signature', 'time', 'key', 'accse', 'sign'];

console.log('Searching for target substrings:');
for (const target of targets) {
  const matches = data.filter(d => d.val.toLowerCase().includes(target));
  console.log(`\nMatches for "${target}":`);
  console.log(JSON.stringify(matches, null, 2));
}
