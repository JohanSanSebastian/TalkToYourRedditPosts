const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const redditUrl = event.queryStringParameters.reddit_url;
    const redditJsonUrl = `${redditUrl}.json`;

    try {
        const response = await fetch(redditJsonUrl, { headers: { 'User-agent': 'your bot 0.1' } });
        const json = await response.json();
        // Process the Reddit JSON to extract comments and post text
        const comments = extractComments(json);
        const postTexts = extractPostText(json);
        const combinedTexts = comments.concat(postTexts).join('\n\n');

        return {
            statusCode: 200,
            body: JSON.stringify({ combined_texts: combinedTexts })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

function extractComments(json) {
    const commentTexts = [];
    
    function extractCommentsRecursively(comments) {
        for (const comment of comments) {
            commentTexts.push(comment.data.body);
            if (comment.data.replies && comment.data.replies.data && comment.data.replies.data.children) {
                extractCommentsRecursively(comment.data.replies.data.children);
            }
        }
    }

    extractCommentsRecursively(json[1].data.children);
    return commentTexts;
}

function extractPostText(json) {
    const texts = [];
    for (const item of json) {
        if (item.data && item.data.children) {
            for (const child of item.data.children) {
                if (child.data && child.data.selftext) {
                    texts.push(child.data.selftext);
                }
            }
        }
    }
    return texts;
}
