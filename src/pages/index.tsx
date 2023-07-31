import io from "socket.io-client";
import { useState, useEffect } from "react";

let socket;

type Message = {
  author: string;
  message: string;
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = () => {
    // We just call it because we don't need anything else out of it
    //await fetch("/api/socket");

    socket = io('https://acero.onrender.com');

    socket.on("newIncomingMessage", (msg) => {
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.message },
      ]);
      console.log(messages);
    });
  };

  const sendMessage = async () => {
    socket.emit("createdMessage", { author: chosenUsername, message });
    setMessages((currentMsg) => [
      ...currentMsg,
      { author: chosenUsername, message },
    ]);
    setMessage("");
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (message) {
        sendMessage();
      }
    }
  };

  return (
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center bg-black">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        {!chosenUsername ? (
          <>
            <h3 className="font-bold text-white text-xl">
              How people should call you?
            </h3>
            <input
              type="text"
              placeholder="Identity..."
              value={username}
              className="p-3 rounded-md outline-none"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={() => {
                setChosenUsername(username);
              }}
              className="bg-white rounded-md px-4 py-2 text-xl"
            >
              Go!
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col justify-end bg-black text-green-400 h-[40rem] min-w-[90%] shadow-md ">
              <div className="h-full last:border-b-0 overflow-y-scroll">
                {messages.map((msg, i) => {
                  return (
                    <div
                      className="w-full py-1 px-2"
                      key={i}
                    >
                      {msg.author} : {msg.message}
                    </div>
                  );
                })}
              </div>
              <div className="w-full flex">
                <input
                  type="text"
                  placeholder="New message..."
                  value={message}
                  className="outline-none py-2 px-2 rounded-bl-md flex-1 bg-black text-green-400"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyUp={handleKeypress}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
