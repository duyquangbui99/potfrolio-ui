// api/chat.js

const { OpenAI } = require("openai");

module.exports = async function (context, req) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, // Do NOT use REACT_APP_ prefix here, it's backend only
    });

    const userMessage = req.body?.message;

    if (!userMessage) {
        context.res = {
            status: 400,
            body: { error: "No message provided" },
        };
        return;
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: userMessage }]
        });

        context.res = {
            status: 200,
            body: { reply: response.choices[0].message.content },
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: { error: error.message || "Internal Server Error" },
        };
    }
};
