import fs from 'fs';

const data = fs.readFileSync('scratch/all-k3.json', 'utf8');
const lines = data.split('\n').filter(l => l.trim() !== '' && !l.startsWith('---'));
const json = JSON.parse(lines.join('\n'));

console.log('--- K3U2 values ---');
for (const item of json) {
  if (item.val && /^[a-zA-Z0-9_\-]{3,15}$/.test(item.val)) {
    console.log(`Lb(${item.indexInLb}): "${item.val}"`);
  }
}
