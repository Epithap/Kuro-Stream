import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/all-t-decrypted.json', 'utf8'));

const targets = [
  { e: 10, key: '1Q1^' },
  { e: -155, key: '1!pJ' },
  { e: 52, key: '0cSO' },
  { e: 473, key: 'XLgh' },
  { e: 447, key: 'CQ#9' },
  { e: 638, key: 'G48x' },
  { e: -36, key: 'ipzp' },
  { e: 235, key: 'JviX' },
  { e: 426, key: '1!pJ' },
  { e: 427, key: '1Q1^' },
  { e: 648, key: '6$g&' },
  { e: 684, key: '&EGx' },
  { e: 96, key: 'U96T' },
  { e: 505, key: 'iJ(q' },
  { e: 686, key: 'Zowf' },
  { e: 575, key: 'wpLQ' },
  { e: 257, key: '&Vgz' },
  { e: 42, key: 'flu#' },
  { e: 84, key: 'qD3X' },
  { e: 400, key: 'rFVS' },
  { e: 507, key: 'H#$4' },
  { e: 159, key: 'rFVS' },
  { e: 723, key: 'G48x' },
  { e: 301, key: '9lff' },
  { e: 74, key: 'flu#' },
  { e: 671, key: '&Vgz' },
  { e: 351, key: 'LT*@' },
  { e: 223, key: '6$g&' }
];

console.log('Results:');
for (const t of targets) {
  const match = data.find(d => d.e === t.e && d.key === t.key);
  console.log(`t(${t.e}, "${t.key}") =`, match ? `"${match.val}"` : 'NOT FOUND');
}
