const OpenAI = require("openai");

// ---- 1. Initialize DeepSeek Client ----
const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com/v1"
});

// ---- 2. Generate System Prompt ----
function getSystemPrompt(title, description, testCases, startCode) {
    return `
You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems. Your role is strictly limited to DSA-related assistance only.

## CURRENT PROBLEM CONTEXT:
[PROBLEM_TITLE]: ${title}
[PROBLEM_DESCRIPTION]: ${description}
[EXAMPLES]: ${JSON.stringify(testCases)}
[startCode]: ${JSON.stringify(startCode)}

## YOUR CAPABILITIES:
1. **Hint Provider**: Give step-by-step hints without revealing the complete solution
2. **Code Reviewer**: Debug and fix code submissions with explanations
3. **Solution Guide**: Provide optimal solutions with detailed explanations
4. **Complexity Analyzer**: Explain time and space complexity trade-offs
5. **Approach Suggester**: Recommend different algorithmic approaches
6. **Test Case Helper**: Help create additional test cases for edge case validation

## INTERACTION GUIDELINES:
- Break down problems into smaller sub-problems
- Ask guiding questions to help them think through the solution
- Provide algorithmic intuition without giving away the complete approach
- Identify bugs and logic errors with clear explanations
- Provide clean, well-commented code when needed

## RESPONSE FORMAT:
- Use clear, concise explanations
- Format code with proper syntax highlighting
- Use examples to illustrate concepts
- Always respond in the language the user is comfortable with

## STRICT LIMITATIONS:
- ONLY discuss topics related to the current DSA problem
- DO NOT help with non-DSA topics
- If asked about unrelated topics, politely redirect

Remember: Your goal is to help users learn and understand DSA concepts.
`;
}

// ---- 3. Convert Frontend Format (Gemini style) to DeepSeek/OpenAI Format ----
function convertToDeepSeekMessages(messages) {
    return messages.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : msg.role,
        content: msg.parts.map(p => p.text).join(' ')
    }));
}

// ---- 4. Call DeepSeek API with Retry Logic (Handles Temporary Errors) ----
async function callDeepSeek(messages, systemPrompt, retries = 3) {
    const deepSeekMessages = [
        { role: "system", content: systemPrompt },
        ...convertToDeepSeekMessages(messages)
    ];

    let lastError = null;
    let delay = 1000; // Start with 1 second

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await deepseek.chat.completions.create({
                model: "deepseek-chat", // Use "deepseek-coder" for code-specific tasks
                messages: deepSeekMessages,
                temperature: 0.7,
                max_tokens: 2048,
            });

            return response.choices[0]?.message?.content || null;
        } catch (error) {
            lastError = error;
            console.log(`DeepSeek Attempt ${attempt} failed:`, error.message || error.status);

            // Only retry on rate limits or server errors (429, 503)
            const status = error.status || error.statusCode;
            if (status !== 429 && status !== 503) {
                break; // Don't retry on auth errors or bad requests
            }

            if (attempt < retries) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff: 1s, 2s, 4s
            }
        }
    }

    // If all retries fail, throw the last error
    throw lastError || new Error("DeepSeek API failed after retries");
}

// ---- 5. Static Fallback (100% Guaranteed Response) ----
function getStaticFallbackResponse(title) {
    return `⚠️ **AI service is temporarily busy.** Here's a structured DSA approach for **"${title || "your problem"}"**:

1️⃣ **Understand the Problem**: Read the input/output format carefully.  
2️⃣ **Brute Force First**: Write the simplest working solution.  
3️⃣ **Optimize**: Look for repeated work (use HashMaps, Two Pointers, or DP).  
4️⃣ **Edge Cases**: Test for empty inputs, large numbers, and negative values.  
5️⃣ **Complexity**: Aim for O(n log n) or better if possible.

💡 **Try asking again in a few minutes**, or share your code and I can review it!`;
}

// ---- 6. Main Controller ----
const solveDoubt = async (req, res) => {
    try {
        const { messages, title, description, testCases, startCode } = req.body;

        // Validate input
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                message: "Invalid messages array. Please provide a valid conversation.",
                used: "Validation"
            });
        }

        const systemPrompt = getSystemPrompt(title, description, testCases, startCode);

        // ----- Attempt DeepSeek -----
        try {
            const reply = await callDeepSeek(messages, systemPrompt);
            if (reply) {
                return res.status(200).json({
                    message: reply,
                    used: "DeepSeek AI"
                });
            }
        } catch (error) {
            console.error("DeepSeek Final Error:", error.message || error);
            // Fall through to static response
        }

        // ----- If DeepSeek completely fails, return static fallback -----
        console.log("⚠️ Returning static fallback response.");
        return res.status(200).json({
            message: getStaticFallbackResponse(title),
            used: "Static Fallback"
        });

    } catch (error) {
        console.error("Critical Error in solveDoubt:", error);
        // Ultimate safety net
        return res.status(200).json({
            message: "🚀 Server encountered an issue. Here's a pro tip: Always start with a brute force solution to understand the problem, then optimize!",
            used: "Emergency Fallback"
        });
    }
};

module.exports = solveDoubt;