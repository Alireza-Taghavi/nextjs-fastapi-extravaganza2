import requests

api_key = "269556-sinatestapikey2212"
text = "🎃🍓🪙"
sender = "50004075013231"
recipient = "09035013471"

url = f"https://api.sms-webservice.com/api/V3/Send?ApiKey={api_key}&Text={text}&Sender={sender}&Recipients={recipient}"

payload = {}
headers = {}

try:
    response = requests.get(url, headers=headers, data=payload)
    response.raise_for_status()
    print(response.text)
except requests.exceptions.HTTPError as err:
    print(err)

