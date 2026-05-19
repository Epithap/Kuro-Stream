import * as cheerio from 'cheerio';
import fs from 'fs';

function checkInfoTable() {
  const html = fs.readFileSync('scratch/komikcast_detail.html', 'utf-8');
  const $ = cheerio.load(html);
  
  console.log('--- Printing outer HTML of the thumbook / info area ---');
  console.log($('.thumbook').html());
}

checkInfoTable();
