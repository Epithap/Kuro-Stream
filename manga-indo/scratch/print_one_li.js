import * as cheerio from 'cheerio';
import fs from 'fs';

function printOneLi() {
  const html = fs.readFileSync('scratch/search.html', 'utf-8');
  const $ = cheerio.load(html);
  
  const firstLi = $('.chivsrc li').first();
  console.log('--- HTML of first search item ---');
  console.log(firstLi.html());
}

printOneLi();
