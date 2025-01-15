
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# In-memory storage
users = {}

@app.route("/status", methods=["POST"])
def set_status():
    data = request.json
    username = data.get("username")
    status = data.get("status")
    if username:
        users[username] = users.get(username, {})
        users[username]['status'] = status
        return jsonify({"message": "Status updated", "status": status}), 200
    return jsonify({"error": "Invalid data"}), 400

@socketio.on("send_message")
def handle_message(data):
    sender = data.get("sender")
    receiver = data.get("receiver")
    message = data.get("message")
    if receiver in users:
        users[receiver]['messages'] = users[receiver].get('messages', [])
        users[receiver]['messages'].append({"sender": sender, "message": message})
        emit("receive_message", {"sender": sender, "message": message}, room=receiver)
    else:
        emit("error", {"error": "User not found"})

@socketio.on("join")
def on_join(data):
    username = data.get("username")
    if username:
        users[username] = users.get(username, {"status": "Online", "messages": []})
        join_room(username)
        emit("user_list", list(users.keys()), broadcast=True)

if __name__ == "__main__":
    socketio.run(app, debug=True)
        