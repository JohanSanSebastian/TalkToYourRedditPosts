let conversationHistory = '';
const redditUrl = new URLSearchParams(window.location.search).get('reddit_url');

async function fetchRedditData() {
    const response = await fetch(`https://www.reddit.com/${redditUrl}.json`);
    const data = await response.json();
    if (data) {
        const combinedTexts = extractCommentsAndPost(data);
        conversationHistory = combinedTexts;

        const summaryResponse = await fetch('https://api.example.com/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: conversationHistory })
        });
        const summaryData = await summaryResponse.json();
        const summary = summaryData.summary;

        addMessageToChat('AI', summary, true); // Add summary as the first message
    } else {
        alert('Error fetching Reddit data');
    }
}

function extractCommentsAndPost(jsonData) {
    const comments = jsonData[1].data.children;
    let combinedTexts = '';

    comments.forEach(comment => {
        combinedTexts += comment.data.body + '\n';
    });

    return combinedTexts;
}

function addMessageToChat(sender, message, isMarkdown = false) {
    const conversation = document.getElementById('conversation');
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'User' ? 'user-message chat' : 'ai-message chat';
    
    if (isMarkdown) {
        messageElement.innerHTML = marked.parse(message);
    } else {
        messageElement.innerText = message;
    }
    
    conversation.appendChild(messageElement);
    conversation.scrollTop = conversation.scrollHeight;
}

async function askQuestion() {
    const userInput = document.getElementById('userInput').value;
    if (!userInput) return;

    addMessageToChat('User', userInput);

    addMessageToChat('AI', "<span class='loading'></span>");

    const response = await fetch('https://api.example.com/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            question: userInput,
            conversation_history: conversationHistory
        })
    });

    const data = await response.json();
    conversationHistory += `\nUser: ${userInput}\nAI: ${data.ai_response}`;
    addMessageToChat('AI', data.ai_response, true);

    document.getElementById('userInput').value = '';
}

document.getElementById('userInput').addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        askQuestion();
    }
});

window.onload = fetchRedditData;
