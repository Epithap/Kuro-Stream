import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('scratch/episode.html', 'utf-8');
const $ = cheerio.load(html);

$('script').each((i, el) => {
  const content = $(el).html();
  if (content.includes('mirrorstream a')) {
    console.log('--- SCRIPT 17 FULL CONTENT ---');
    console.log(content);
  }
});
