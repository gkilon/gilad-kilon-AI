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
    body: `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${articleTitle} | גלעד קילון</title>
    <meta name="description" content="${articleDescription}">
    <meta property="og:title" content="${articleTitle} | גלעד קילון">
    <meta property="og:description" content="${articleDescription}">
    <meta property="og:url" content="${articleUrl}">
    <meta property="og:image" content="https://kilon.org/profile.jpg">
    <meta property="og:type" content="article">
    <meta name="twitter:title" content="${articleTitle} | גלעד קילון">
    <meta name="twitter:description" content="${articleDescription}">
    <meta name="twitter:image" content="https://kilon.org/profile.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${articleUrl}">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'brand-dark': '#0a0a0a',
                        'brand-beige': '#f8f6f1',
                        'brand-accent': '#4a6fa5',
                        'brand-muted': '#6b7280',
                        'brand-gold': '#b8956e',
                        'brand-sage': '#8fa38f',
                        'brand-navy': '#1a222e',
                        'brand-paper': '#ffffff',
                        'brand-touch': '#e55d2b',
                    },
                    fontFamily: {
                        sans: ['Assistant', 'sans-serif'],
                    },
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Assistant', sans-serif; background: #f4f3ef; color: #111111; margin: 0; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="importmap">
{
  "imports": {
    "firebase/": "https://esm.sh/firebase@^12.7.0/",
    "html2canvas": "https://esm.sh/html2canvas@^1.4.1",
    "react-router-dom": "https://esm.sh/react-router-dom@^7.11.0",
    "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
    "@vitejs/plugin-react": "https://esm.sh/@vitejs/plugin-react@^5.1.2",
    "@google/genai": "https://esm.sh/@google/genai@^1.34.0",
    "react/": "https://esm.sh/react@^19.2.3/",
    "react": "https://esm.sh/react@^19.2.3",
    "vite": "https://esm.sh/vite@^7.3.0"
  }
}
</script>
    <script type="module" src="./index.tsx"></script>
</body>
</html>`,
  };
};
