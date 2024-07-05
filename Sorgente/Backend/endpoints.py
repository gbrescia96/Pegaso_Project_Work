from flask import Flask, jsonify, request
from flask_cors import CORS
from services import get_hello_message, get_greet_message

app = Flask(__name__)
CORS(app)  # Abilita CORS per tutte le route

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify(get_hello_message())

@app.route('/api/greet', methods=['POST'])
def greet():
    data = request.json
    name = data.get('name')
    return jsonify(get_greet_message(name))

if __name__ == '__main__':
    app.run(debug=True)
