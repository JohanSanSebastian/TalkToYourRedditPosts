from flask import Flask, render_template, request, jsonify, redirect, url_for
import google.generativeai as genai
import requests
import json

# Configure the Google Generative AI with your API key
genai.configure(api_key='AIzaSyAissym6sFqnDRh_IMeanC2DGUc-2qOsUg')

app = Flask(__name__)

# Function to recursively extract comments from Reddit JSON data
def extract_comments(json_data):
    comments = json.loads(json_data)
    comment_texts = []
    
    def extract_comments_recursively(comments):
        for comment in comments:
            if 'body' in comment['data']:
                comment_texts.append(comment['data']['body'])
            if 'replies' in comment['data'] and comment['data']['replies']:
                extract_comments_recursively(comment['data']['replies']['data']['children'])
    
    extract_comments_recursively(comments[1]['data']['children'])
    return comment_texts

# Function to extract post text from Reddit JSON data
def extract_post_text(json_data):
    data = json.loads(json_data)
    texts = []
    for item in data:
        if 'data' in item and 'children' in item['data']:
            for child in item['data']['children']:
                if 'data' in child and 'selftext' in child['data']:
                    texts.append(child['data']['selftext'])
    return texts

# Function to generate a summary using AI
def generate_summary(texts):
    combined_text = '\n'.join(texts)
    model = genai.GenerativeModel('gemini-1.5-flash')
    summary_response = model.generate_content(f'Summarize the following:\n\n{combined_text}')
    return summary_response.text.strip()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    reddit_url = request.form['reddit_url']
    return redirect(url_for('chat_page', reddit_url=reddit_url))

@app.route('/chat_page')
def chat_page():
    reddit_url = request.args.get('reddit_url')
    reddit_json_url = reddit_url + '.json'
    response = requests.get(reddit_json_url, headers={'User-agent': 'your bot 0.1'})

    if response.status_code == 200:
        json_data = response.text
        comments = extract_comments(json_data)
        post_texts = extract_post_text(json_data)
        combined_texts = comments + post_texts
        summary = generate_summary(combined_texts)
        return render_template('chat.html', reddit_url=reddit_url, summary=summary)
    else:
        return jsonify({"error": "Error fetching Reddit data", "status_code": response.status_code})


@app.route('/fetch_reddit', methods=['GET'])
def fetch_reddit():
    reddit_url = request.args.get('reddit_url')
    reddit_json_url = reddit_url + '.json'
    response = requests.get(reddit_json_url, headers={'User-agent': 'your bot 0.1'})

    if response.status_code == 200:
        json_data = response.text
        comments = extract_comments(json_data)
        post_texts = extract_post_text(json_data)
        combined_texts = comments + post_texts
        return jsonify({"combined_texts": "\n".join(combined_texts)})
    else:
        return jsonify({"error": "Error fetching Reddit data", "status_code": response.status_code})

@app.route('/ask_ai', methods=['POST'])
def ask_ai():
    user_question = request.json.get('question')
    conversation_history = request.json.get('conversation_history')
    
    # Combine the user's question with the conversation history
    combined_input = conversation_history + "\n\nUser Question: " + user_question
    model = genai.GenerativeModel('gemini-1.5-flash')
    ai_response = model.generate_content(combined_input)
    
    # Return the AI's response
    return jsonify({"ai_response": ai_response.text.strip(), "conversation_history": combined_input + "\n\nAI Answer: " + ai_response.text.strip()})

if __name__ == '__main__':
    app.run(debug=True)
