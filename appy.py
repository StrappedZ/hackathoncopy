from flask import Flask, request, jsonify
from google.cloud import vision
from PIL import Image
import io
import os

app = Flask(__name__)
client = vision.ImageAnnotatorClient()

@app.route('/api/ocr', methods=['POST'])
def ocr():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Read image data
    img_bytes = file.read()
    image = vision.Image(content=img_bytes)
    response = client.text_detection(image=image)

    if response.error.message:
        return jsonify({'error': response.error.message}), 500

    text = response.full_text_annotation.text if response.full_text_annotation else ""
    # Return both pretty JSON and plain text for your frontend
    return jsonify({
        'text': text,
        'raw': response.full_text_annotation.text if response.full_text_annotation else ""
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)