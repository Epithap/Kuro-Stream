import fs from 'fs';
import vm from 'vm';

const runner = fs.readFileSync('scratch/decrypters-rotated.js', 'utf8');

const context = vm.createContext({
  globalThis: {},
  console: console
});

vm.runInContext(runner, context);

const { Fb } = context.globalThis;

function r(e, t) {
  return Fb(t - 244, e);
}

console.log('Method name:', r('J#Yc', 1094) + 'ceptR' + r('1JJx', 880) + 't');
