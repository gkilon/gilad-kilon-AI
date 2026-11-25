import { Handler } from '@netlify/functions';
import { readFileSync } from 'fs';
import { join } from 'path';
const indexHtml = readFileSync(join(__dirname, '../../dist/index.html'), 'utf-8');
export const handler: Handler = async (event) => {
  const ua = event.headers['user-agent'] || event.headers['User-Agent'] || '';
  if (!/facebookexternalhit|WhatsApp|LinkedInBot|Twitterbot|Slackbot|Googlebot|Bingbot|TelegramBot/i.test(ua)) return { statusCode: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }, body: indexHtml };
  const title = 'Feedback Boost | ממשוב לשינוי התנהגותי';
  const description = 'תוכנית פיתוח ממוקדת בת שלושה מפגשים, שמחברת בין יעדי המשוב לבין שינוי התנהגותי אמיתי בעבודה.';
  const html = indexHtml.replace(/<title>[^<]*<\/title>/, '<title>' + title + '</title>').replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + title + '">').replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + description + '">').replace(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="https://kilon-consulting.com/obt">');
  return { statusCode: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }, body: html };
};
