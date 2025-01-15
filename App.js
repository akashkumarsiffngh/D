
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function App() {
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on("user_list", (userList) => setUsers(userList));
        socket.on("receive_message", (data) =>
            setMessages((prev) => [...prev, data])
        );
    }, []);

    const joinChat = () => {
        socket.emit("join", { username });
    };

    const updateStatus = async () => {
        await axios.post("http://localhost:5000/status", { username, status });
    };

    const sendMessage = () => {
        socket.emit("send_message", { sender: username, receiver, message });
        setMessages((prev) => [...prev, { sender: "You", message }]);
    };

    return (
        <div>
            <h1>Chat App</h1>
            <div>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button onClick={joinChat}>Join</button>
            </div>
            <div>
                <input
                    placeholder="Set Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
                <button onClick={updateStatus}>Update Status</button>
            </div>
            <div>
                <h2>Users</h2>
                {users.map((user, index) => (
                    <div key={index}>{user}</div>
                ))}
            </div>
            <div>
                <h2>Chat</h2>
                <input
                    placeholder="Receiver"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                />
                <input
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                <h2>Messages</h2>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.message}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
        