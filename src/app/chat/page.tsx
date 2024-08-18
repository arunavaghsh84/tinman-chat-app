"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { decodeToken } from "../lib/auth";
import moment from "moment";

let socket: Socket;

export default function Chat() {
  const router = useRouter();
  const messagesRef = useRef<HTMLDivElement>(null);

  const [sender, setSender] = useState<string | null>(null);
  const [receiver, setReceiver] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [users, setUsers] = useState([]);
  const [messageText, setMessageText] = useState<string>("");
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return router.push("/login");
    }

    setSender(decodeToken(token)?.userId);

    // Initialize the socket connection only once
    !socket && socketInitializer();
  }, []);

  useEffect(() => {
    sender && fetcUsers();
  }, [sender]);

  useEffect(() => {
    receiver && fetchMessages();
  }, [receiver]);

  useEffect(() => {
    if (messagesRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  const fetcUsers = async () => {
    const res = await fetch("/api/chat/users");

    if (res.ok) {
      const data = await res.json();
      setUsers(data.filter((user) => user._id !== sender));
    } else {
      setUsers([]);
      console.error("Error fetching users");
    }

    setLoadingUsers(false);
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);

    const res = await fetch(`/api/chat/logs?sender=${sender}&receiver=${receiver}`);

    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    } else {
      setMessages([]);
      console.error("Error fetching messages");
    }

    setLoadingMessages(false);
  };

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const socketInitializer = async () => {
    // Initialize the socket connection
    socket = io();

    // Listen for new messages
    socket.on("new-message", (message) => {
      const token = localStorage.getItem("token");
      const sender = decodeToken(token)?.userId;      

      if (message.receiver._id === sender || message.sender._id === sender) {
        setTimeout(() => setMessages((currentMessages) => [...currentMessages, message]));
      }
    });
  };

  const sendMessage = async (message) => {
    // Send a message to the server
    socket.emit("send-message", message);
  };

  const saveMessage = async () => {
    const res = await fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, receiver, messageText }),
    });

    if (res.ok) {
      const data = await res.json();
      sendMessage(data.message);
      setMessageText("");
    } else {
      console.error("Error saving message");
    }
  };

  const handleClose = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleCancel = () => {
    setReceiver(null);
  };

  return (
    <div className="container min-vh-100 d-flex py-5" style={{ maxHeight: "100vh" }}>
      <div className="d-flex flex-fill mh-100 border border-light-subtle shadow-sm rounded-1 overflow-hidden">
        <div
          className="d-flex flex-column border-end border-light flex-shrink-0"
          style={{ width: "350px" }}
        >
          <div className="px-3 py-2 fs-3 fw-bold">Chats</div>
          <div className="flex-fill overflow-auto">
            {users.length > 0 ? (
              <>
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="bg-hover-light-subtle"
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      key={user._id}
                      onClick={() => setReceiver(user._id)}
                      className={`p-3 ${user._id === receiver && "bg-primary-subtle"}`}
                    >
                      {user.nickname}
                    </div>
                    <div className="border-bottom border-light-subtle mx-3"></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {loadingUsers ? (
                  <div className="text-center text-muted py-5">Loading users...</div>
                ) : (
                  <div className="text-center text-muted py-5">No users available!</div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="d-flex flex-column flex-fill bg-light text-end">
          <div className="px-3 py-2 fs-3 fw-bold bg-body">
            <button onClick={handleClose} className="btn btn-sm px-3 btn-dark">
              Logout
            </button>
          </div>
          <div className="flex-fill overflow-auto" ref={messagesRef}>
            {receiver ? (
              <>
                {loadingMessages ? (
                  <div className="text-center text-muted py-5">Loading messages...</div>
                ) : (
                  <div>
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-3 ${
                          msg.receiver?._id === sender ? "text-start" : "text-end"
                        }`}
                      >
                        <div
                          className="d-inline-block bg-body p-2 rounded shadow-sm"
                          style={{ maxWidth: "80%" }}
                        >
                          <div className="text-start" style={{ whiteSpace: "pre-wrap" }}>
                            {msg.messageText}
                          </div>
                          <div className="mt-2 small text-muted text-end">
                            {moment(msg.timestamp).fromNow()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-muted py-5">Select a user to start chat</div>
            )}
          </div>
          {receiver && (
            <div className="p-3 border-top border-light-subtle d-flex ">
              <textarea
                className="form-control form-control-lg"
                rows={1}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
              />
              <button onClick={saveMessage} className="btn btn-primary ms-2">
                Send
              </button>
              <button onClick={handleCancel} className="btn btn-secondary ms-2">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
