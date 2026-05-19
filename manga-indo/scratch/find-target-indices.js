import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/decrypted-rb-strings.json', 'utf8'));

const targets = ['x-wm-', 'request-', 'si', 'accses-key', 'request-time', 'request-signature', 'Signature', 'signature', 'request'];

for (const t of targets) {
  const matches = data.filter(d => d.value === t || d.value.includes(t));
  console.log(`\nMatches for "${t}":`);
  console.log(JSON.stringify(matches, null, 2));
}
