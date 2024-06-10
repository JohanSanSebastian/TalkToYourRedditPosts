
# TalkToYourRedditPosts

TalkToYourRedditPosts is a Python-based program designed to streamline the process of summarizing and extracting valuable insights from Reddit posts. By leveraging the power of the Google Gemini API, this tool provides users with the ability to generate concise summaries and answer specific questions related to the content of a given Reddit post.

### Key Features
- Summarization: Utilize the Google Gemini API to generate summaries of lengthy Reddit posts, allowing users to grasp the main points quickly.
- Question Answering: Seamlessly answer user-generated questions based on the information contained within Reddit posts, enhancing comprehension and accessibility.


### How it works

The program functions by fetching the specified Reddit post URL in JSON, processing the content through and then sending it to the Google Gemini API for summarization, and enabling users to interact with the data by posing questions to extract specific details or insights.

## Environment Variables

To run this project, you will need to add the following environment variables to app.py

`API_KEY`


## Run Locally

Clone the project

```bash
  git clone https://github.com/JohanSanSebastian/TalkToYourRedditPosts.git
```

Install dependencies

```bash
  pip install -r requirements.txt
```

Start the server

```bash
  python app.py
```


## Roadmap

- Browser support using the official Reddit API as the current method cannot be scaled beyond running locally

- Add more integrations/features


## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.


## Acknowledgements

 - [Google Gemini API](https://aistudio.google.com)
 - [My friend Keegan for being the reason I made this](https://www.instagram.com/keegannnn_/)

## License

[MIT](https://choosealicense.com/licenses/mit/)


## Feedback

If you have any feedback, please open an issue.

