import { Handler } from '@netlify/functions';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read index.html at build time
const indexHtml = readFileSync(join(__dirname, '../../dist/index.html'), 'utf-8');

export const handler: Handler = async (event, context) => {
  // Check if the request is from a social media bot
  const userAgent = event.headers['user-agent'] || event.headers['User-Agent'] || '';
  const isBot = /facebookexternalhit|WhatsApp|LinkedInBot|Twitterbot|Slackbot|Googlebot|Bingbot|TelegramBot/i.test(userAgent);

  // If not a bot, return the SPA HTML (rewrite, not redirect)
  if (!isBot) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
      body: indexHtml,
    };
  }

  // For bots, extract article ID from the path
  // The path will be like /article_detail/abc123 or /article_detail/abc123?fbclid=...
  const path = event.path;
  const pathParts = path.split('/');
  const articleId = pathParts[pathParts.length - 1].split('?')[0]; // Remove query string if present

  // For article pages, try to fetch article data from Firebase
  let articleTitle = 'מאמר מקצועי';
  let articleDescription = 'מאמר מקצועי מאת גלעד קילון - ייעוץ ארגוני ופיתוח מנהלים';
  
  console.log('Fetching article data for ID:', articleId);
  
  try {
    // Try to fetch from Firebase using the REST API
    const firebaseResponse = await fetch(`https://firestore.googleapis.com/v1/projects/gilad-kilon-ai-site/databases/(default)/documents/system/config`);
    console.log('Firebase response status:', firebaseResponse.status);
    
    if (firebaseResponse.ok) {
      const data = await firebaseResponse.json();
      console.log('Firebase data received:', JSON.stringify(data).substring(0, 500));
      
      if (data.fields && data.fields.articles && data.fields.articles.arrayValue) {
        const articles = data.fields.articles.arrayValue.values || [];
        console.log('Articles found:', articles.length);
        console.log('Article IDs:', articles.map((a: any) => a.mapValue.fields.id.stringValue));
        
        const article = articles.find((a: any) => a.mapValue.fields.id.stringValue === articleId);
        console.log('Found article:', article ? 'Yes' : 'No');
        
        if (article && article.mapValue.fields) {
          articleTitle = article.mapValue.fields.title.stringValue || articleTitle;
          articleDescription = article.mapValue.fields.subtitle?.stringValue || 
                               article.mapValue.fields.content?.stringValue?.substring(0, 160) || 
                               articleDescription;
          console.log('Article title set to:', articleTitle);
        }
      } else {
        console.log('No articles field in Firebase data');
      }
    } else {
      console.log('Firebase fetch failed with status:', firebaseResponse.status);
    }
  } catch (error) {
    console.log('Failed to fetch article data:', error);
  }

  const articleUrl = `https://kilon-consulting.com/article_detail/${articleId}`;
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
    body: indexHtml.replace(
      /<title>.*?<\/title>/,
      `<title>${articleTitle} | גלעד קילון</title>`
    ).replace(
      /<meta name="description" content=".*?">/,
      `<meta name="description" content="${articleDescription}">`
    ).replace(
      /<meta property="og:title" content=".*?">/,
      `<meta property="og:title" content="${articleTitle} | גלעד קילון">`
    ).replace(
      /<meta property="og:description" content=".*?">/,
      `<meta property="og:description" content="${articleDescription}">`
    ).replace(
      /<meta property="og:url" content=".*?">/,
      `<meta property="og:url" content="${articleUrl}">`
    ).replace(
      /<meta name="twitter:title" content=".*?">/,
      `<meta name="twitter:title" content="${articleTitle} | גלעד קילון">`
    ).replace(
      /<meta name="twitter:description" content=".*?">/,
      `<meta name="twitter:description" content="${articleDescription}">`
    ).replace(
      /<meta name="twitter:url" content=".*?">/,
      `<meta name="twitter:url" content="${articleUrl}">`
    ),
  };
};
