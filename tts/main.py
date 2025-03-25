import os
import time
import espeakng

from os import path
from flask import Flask, request, jsonify

server = Flask(__name__)
tts = espeakng.Speaker(voice="en-us")

bin_path = path.join(path.dirname(path.realpath(__file__)), "bin")

if not path.exists(bin_path):
    os.mkdir(bin_path)

@server.route("/synthesize", methods=["POST"])
def synthesize():
    data = request.get_json()
    print(data)

    text = data.get("text", None)

    if not text:
        return jsonify({"error": "No text was provided"}), 400

    tts.voice = data.get("voice", "en-us")
    tts.pitch = int(data.get("pitch", 50))
    tts.wpm = int(data.get("speed", 175))

    output_path = path.join(bin_path, f"{int(time.time())}.wav")

    tts.say(text, export_path=output_path)

    while not path.exists(output_path):
        time.sleep(0.1)

    with open(output_path, "rb") as audio:
        audio_data = audio.read()
        audio.close()

    os.remove(output_path)

    return audio_data, 200, {"Content-Type": "audio/wav"}

@server.route("/voices", methods=["POST"])
def voices():
    return jsonify(tts.list_voices()), 200

if __name__ == '__main__':
    server.run(host='0.0.0.0', port=5000)