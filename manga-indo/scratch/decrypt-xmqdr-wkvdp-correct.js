import fs from 'fs';
import vm from 'vm';

const code = fs.readFileSync('scratch/js_files/components-_yy6KL6v.js', 'utf8');

const rbStartStr = 'function Rb(){';
const rbEndStr = 'Rb=function(){return e},Rb()}';

const rbStartIdx = code.indexOf(rbStartStr);
const rbEndIdx = code.indexOf(rbEndStr, rbStartIdx);

const rbCode = code.substring(rbStartIdx, rbEndIdx + rbEndStr.length);

const lbStartStr = 'function Lb(e,t){';
const lbEndStr = 'Lb.HFNctz={},Lb.FwagKh=!0}let a=n[0],o=e+a,s=Lb.HFNctz[o];return s?r=s:(Lb.HNhjCk===void 0&&(Lb.HNhjCk=!0),r=Lb.lIkQXZ(r,t),Lb.HFNctz[o]=r),r}';

const lbStartIdx = code.indexOf(lbStartStr);
const lbEndIdx = code.indexOf(lbEndStr, lbStartIdx);

const lbCode = code.substring(lbStartIdx, lbEndIdx + lbEndStr.length);

const runner = `
${rbCode}
${lbCode}
globalThis.lbDecrypted = Lb;
`;

const context = vm.createContext({ globalThis: {} });
vm.runInContext(runner, context);

function t(key, val) {
  return context.globalThis.lbDecrypted(val - 805, key);
}

try {
  // WgsBD: t('!WeR', 1548)
  console.log('WgsBD (1548, !WeR) =', t('!WeR', 1548));
  // EMKAd: t('wpLQ', 1131) + t('6$g&', 1580)
  console.log('EMKAd (1131, wpLQ) + (1580, 6$g&) =', t('wpLQ', 1131) + t('6$g&', 1580));
  // HvXyX: t('dZre', 1113) + t('1JJx', 1790) + 'en'
  console.log('HvXyX (1113, dZre) + (1790, 1JJx) + en =', t('dZre', 1113) + t('1JJx', 1790) + 'en');
  // Hgtyg: t('iJ(q', 1888) + 'GVkX1' + t('&EGx', 1872) + t('dZre', 1387) + t('9rau', 1909) + 'a4P2x' + t('RDIL', 1707) + t('dZre', 1195) + t('l3mC', 1499) + t('*L]q', 1127) + t('tmg)', 1722) + t('6$g&', 1330) + t('60GJ', 1620)
  const hgtyg = t('iJ(q', 1888) + 'GVkX1' + t('&EGx', 1872) + t('dZre', 1387) + t('9rau', 1909) + 'a4P2x' + t('RDIL', 1707) + t('dZre', 1195) + t('l3mC', 1499) + t('*L]q', 1127) + t('tmg)', 1722) + t('6$g&', 1330) + t('60GJ', 1620);
  console.log('Hgtyg (HMAC Key candidate?):', hgtyg);

  // Let's print out what we get!
} catch (e) {
  console.error('Error:', e.message);
}
