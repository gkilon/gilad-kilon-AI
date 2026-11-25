import { Handler } from '@netlify/functions';
import { readFileSync } from 'fs';
import { join } from 'path';

const indexHtml = readFileSync(join(__dirname, '../../dist/index.html'), 'utf-8');

export const handler: Handler = async (event) => {
  const userAgent = event.headers['user-agent'] || event.headers['User-Agent'] || '';
  const isBot = /facebookexternalhit|WhatsApp|LinkedInBot|Twitterbot|Slackbot|Googlebot|Bingbot|TelegramBot/i.test(userAgent);

  if (!isBot) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: indexHtml,
    };
  }

  const title = 'Feedback Boost | ממשוב לשינוי התנהגותי';
  const description = 'תוכנית פיתוח ממוקדת בת שלושה מפגשים, שמחברת בין יעדי המשוב לבין שינוי התנהגותי אמיתי בעבודה.';
  const url = 'https://kilon-consulting.com/obt';

  const html = indexHtml
    .replace(/<title>.*?<\\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="title" content=".*?">/, `<meta name="title" content="${title}">`)
    .replace(/<meta name="description"\\s+content=".*?">/s, `<meta name="description" content="${description}">`)
    .replace(/<meta property="og:url" content=".*?">/, `<meta property="og:url" content="${url}">`)
    .replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${title}">`)
    .replace(/<meta property="og:description"\\s+content=".*?">/s, `<meta property="og:description" content="${description}">`)
    .replace(/<meta property="og:image:alt" content=".*?">/, '<meta property="og:image:alt" content="Feedback Boost — ממשוב לשינוי התנהגותי">');

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: html,
  };
};
