import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('scratch/episode.html', 'utf-8');
const $ = cheerio.load(html);

console.log('--- SCRIPT TAGS IN HTML ---');
$('script').each((i, el) => {
  const src = $(el).attr('src');
  const content = $(el).html();
  if (src) {
    console.log(`Script ${i + 1} src="${src}"`);
  } else {
    console.log(`Script ${i + 1} inline:`);
    console.log(content.slice(0, 500) + (content.length > 500 ? '\n...[truncated]' : ''));
  }
});
