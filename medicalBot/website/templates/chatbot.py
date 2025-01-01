import json
import random

# Load the JSON data from the file
with open('question.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

def get_questions_by_tag(tag):
    # Iterate through the data to find the tag
    for item in data:
        if item.get('tag') == tag:
            return item.get('questions', [])
    return []

def ask_questions(tag):
    questions = get_questions_by_tag(tag)
    if not questions:
        print(f"No questions found for tag: {tag}")
        return

    # Shuffle the questions
    random.shuffle(questions)

    for question in questions:
        for content in question['content']:
            response = input(content + " ")
            print(f"Your response: {response}")

# Example usage
tag = input("Enter the tag: ")
ask_questions(tag)
