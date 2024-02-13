from fastapi import FastAPI,Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List  # Import List type for handling list of questions
import string
from collections import Counter

import matplotlib.pyplot as plt
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from typing import Annotated

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  
    allow_headers=["*"],
)
nltk.download('vader_lexicon')
class SentimentResponse(BaseModel):
    sentiment: str
    emotion_counter: dict

@app.get("/")
def sentiment(questions: List[str] = Query(..., title="Questions")):
    import string
    from collections import Counter
    import nltk
    from nltk.sentiment.vader import SentimentIntensityAnalyzer

    stop_words = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself",
                "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself",
                "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these",
                "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do",
                "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while",
                "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before",
                "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again",
                "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each",
                "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than",
                "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]

    # Function to clean and tokenize text
    def clean_and_tokenize(text):
        lower_case = text.lower()
        cleaned_text = lower_case.translate(str.maketrans('', '', string.punctuation))
        tokenized_words = cleaned_text.split()
        final_words = [word for word in tokenized_words if word not in stop_words]
        return final_words
    def remove_duplicate_half(questions):
        length = len(questions)
        half_length = length // 2  # Calculate the index to split the list in half
        first_half = questions[:half_length]
        second_half = questions[half_length:]

        # Check if the first half is the same as the second half
        if first_half == second_half:
            return first_half  # If they are the same, return only the first half
        else:
            return questions 
    # Function to perform sentiment analysis
    def sentiment_analyse(sentiment_text):
        score = SentimentIntensityAnalyzer().polarity_scores(sentiment_text)
        neg = score["neg"]
        pos = score["pos"]
        if neg > pos:
            return "Negative"
        elif pos > neg:
            return "Positive"
        else:
            return "Neutral"

    # Reading emotions from file
    emotion_list = []
    with open('emotions.txt', 'r') as file:
        for line in file:
            clear_line = line.replace("\n", '').replace(",", '').replace("'", '').strip()
            word, emotion = clear_line.split(':')
            emotion_list.append((word, emotion))

    # List to store responses for each question
    responses = []
    questions = remove_duplicate_half(questions)
    print(len(questions))
    # Sentiment analysis for each text in the list
    for text in questions:
        # Clean and tokenize text
        final_words = clean_and_tokenize(text)

        # Emotion analysis
        emotions_in_text = []
        for word, emotion in emotion_list:
            if word in final_words:
                emotions_in_text.append(emotion)

        # Count emotions
        emotion_counter = Counter(emotions_in_text)

        # Perform sentiment analysis
        sentiment_result = sentiment_analyse(text)

        # Append sentiment and emotion counter to responses
        response = SentimentResponse(sentiment=sentiment_result, emotion_counter=emotion_counter)
        responses.append(response)

    print(responses)
    return {"response":responses}




