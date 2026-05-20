import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('scratch/episode.html', 'utf-8');
const $ = cheerio.load(html);

console.log('--- MIRROR CONTAINER HTML ---');
$('.mirrorstream').each((i, el) => {
  console.log(`\nMirror Container ${i + 1} class="${$(el).attr('class')}":`);
  console.log($(el).html());
});

console.log('\n--- PLAYER AREA ---');
console.log($('#player_area').html() || 'No player_area');
console.log($('.responsive-embed-container').html() || 'No responsive-embed-container');
