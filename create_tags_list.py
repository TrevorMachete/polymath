import requests
import json

# The direct URL of the API endpoint that lists all tags
url = 'https://the-trivia-api.com/v2/tags'

# Make the GET request to the API
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the JSON response
    data = response.json()
    
    # Since data is a list of strings, we can directly use each string as both the key and the value
    options_json = {tags: tags for tags in data}
    
    # Save the data to a JSON file
    with open('tags_list.json', 'w') as file:
        json.dump(options_json, file, indent=4)
    
    print("Tags with codes saved to 'tags_list.json'")
else:
    print(f"Failed to fetch data. Status code: {response.status_code}")