from flask import Flask, request, jsonify
from flask_cors import CORS
from jobspy import scrape_jobs
import csv
import numpy

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/chat/completions', methods=['POST'])
def chat_completions():
    data = request.json
    user_message = data.get('messages')[0].get('content')

    jobs = scrape_jobs(
        site_name=["indeed", "linkedin"],
        search_term=user_message,
        results_wanted=4,
        hours_old=72,
        country_indeed='USA',
    )
    
    records_as_strings = []
    for index, row in jobs.iterrows():
        record_string = (
            f"ID: {row['id']}\n"
            f"Site: {row['site']}\n"
            f"Job URL: {row['job_url']}\n"
            f"Title: {row['title']}\n"
            f"Company: {row['company']}\n"
            f"Location: {row['location']}\n"
            f"Date Posted: {row['date_posted']}\n"
            f"Job Type: {row['job_type']}\n"
            f"Salary: {row['min_amount']} - {row['max_amount']} {row['currency']}\n"
            f"Description: {row['description']}\n"
            "-----------------------------------"
        )
        records_as_strings.append(record_string)

    response = "".join(records_as_strings)
    
    return jsonify({
        'choices': [{
            'message': {
                'content': response
            }
        }]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5021)