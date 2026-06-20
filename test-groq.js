const Groq = require('groq-sdk');
try {
  const groq = new Groq({ apiKey: process.env.NON_EXISTENT });
  console.log("Success");
} catch (e) {
  console.log("Error:", e.message);
}
