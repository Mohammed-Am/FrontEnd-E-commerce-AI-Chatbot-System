import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import './App.css'; // Keep this for any custom CSS not handled by Tailwind

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true); // Start loading

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000'; // Fallback for local development

      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error from backend:', response.status, response.statusText, errorText);
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      
      const botMessage = {
        text: data.response, 
        sender: 'bot',
        products: data.products || []
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error) {
      console.error('Error fetching chat response:', error);
      let displayMessage = 'Sorry, something went wrong. Please try again.';
      if (error.message.includes('Failed to fetch')) {
        displayMessage = 'Could not connect to the server. Please ensure the backend is running and accessible.';
      }
      const errorMessage = { text: displayMessage, sender: 'bot', products: [] };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <header className="w-full max-w-3xl bg-white rounded-t-lg shadow-xl flex items-center justify-center p-4 border-b">
        <img src="https://i.pinimg.com/736x/e4/09/6f/e4096f0afce5bbb76ef00df733a2e951.jpg" alt="Bike Store Logo" className="h-10 w-10 mr-3"/>
        <h1 className="text-2xl font-bold text-gray-800">Bike Shop Assistant</h1>
      </header>
      <div className="w-full max-w-3xl bg-white rounded-b-lg shadow-xl flex flex-col h-[80vh]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                {msg.products && msg.products.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                    {msg.products.map(product => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 text-gray-900">
                <div className="flex items-center space-x-2">
                  <div className="dot-pulse">
                    <div className="dot-pulse-dot"></div>
                  </div>
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            </div>
          )}
          <div className='bg-red' ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about our bikes..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;