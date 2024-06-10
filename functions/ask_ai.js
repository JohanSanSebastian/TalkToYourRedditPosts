const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyAissym6sFqnDRh_IMeanC2DGUc-2qOsUg"; // Ensure your API key is set in your environment variables
const genAI = new GoogleGenerativeAI(apiKey);

exports.handler = async (event, context) => {
    const { question, conversation_history } = JSON.parse(event.body);

    try {
        // Initialize the Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Prepare the prompt by combining the conversation history and the user's question
        const prompt = `${conversation_history}\n\nUser: ${question}\nAI:`;

        // Generate the response from the Gemini API
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResponse = await response.text();

        // Update the conversation history
        const updatedConversationHistory = `${conversation_history}\nUser: ${question}\nAI: ${aiResponse}`;

        return {
            statusCode: 200,
            body: JSON.stringify({
                ai_response: aiResponse,
                conversation_history: updatedConversationHistory
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
