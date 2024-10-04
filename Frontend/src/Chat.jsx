import React, { useEffect, useRef, useState } from 'react';

const Chat = () => {
  const chatBoxRef = useRef(null);
  const [socketio, setSocketio] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    setSocketio(socket);

    const userName = prompt('Enter your Name to join');
    socket.emit('new-user-joined', userName);

    socket.on('user-joined', (name) => {
      append(`${name} has joined the chat`, 'left');
    });

    socket.on('receive', (data) => {
      append(`${data.name}: ${data.message}`, 'left');
    });

    socket.on('user-disconnected', (name) => {
      append(`${name} has left the chat`, 'left')
    })

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const formHandler = (e) => {
    e.preventDefault();

    const input = document.querySelector('#input-item');
    const msg = input.value.trim(); 

    if (msg) {
      socketio.emit('send', msg);
      append(`You: ${msg}`, 'right');
      input.value = '';
    }
  }
  const audio = new Audio('msgTone.mp3')

  const append = (message, position) => {
    if (chatBoxRef.current) {
      const newMsg = document.createElement('div');
      newMsg.innerText = message;
      newMsg.classList.add('chatMsg', position);
      chatBoxRef.current.appendChild(newMsg);
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      if(position == 'left'){
        audio.play()
      }
    }
  };

  return (
    <div className='chat-container my-1'>
      <div ref={chatBoxRef} id='chatBox' className="max-w-[400px] mx-auto overflow-auto
      scrollbar scrollbar-track-zinc-300 scrollbar-thumb-zinc-700 bg-zinc-300 rounded-lg h-[80vh] p-3 overflow-y-auto">
        {/* Chat messages will be appended here */}
      </div>
      <div className="chat-msg flex justify-center items-center">
        <form onSubmit={formHandler} className='form-item flex justify-between items-center max-w-[400px] my-1 w-full'>
          <div className="form-input w-full">
            <input
              type="text"
              name="message"
              placeholder='Send Message'
              id='input-item'
              className="w-full bg-zinc-900 text-zinc-200 focus:outline-none rounded-l-lg p-2 px-4"
            />
          </div>
          <div className="form-btn">
            <button type='submit' className='p-2 px-4 bg-green-500 text-white rounded-r-lg'>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;