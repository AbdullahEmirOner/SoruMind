
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  
  try {
    // There isn't a direct listModels on the main client in some versions, 
    // but we can try to find a model that works or infer from error.
    // Actually, let's just try 'gemini-1.5-flash-latest' as a last resort in code.
    // But better:
    console.log("Testing API Key...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    // Just try to count tokens which is a lightweight call
    const result = await model.countTokens("Hello");
    console.log("Count Tokens Result:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

run();
