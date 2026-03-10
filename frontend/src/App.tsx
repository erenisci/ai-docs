import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { FaBars, FaRegFileAlt } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';

import ChatMessages from './components/ChatMessages';
import InputField from './components/InputField';
import PDFModal from './components/PdfModal';
import SettingsModal from './components/SettingsModal';
import Sidebar from './components/Sidebar';
import SplashScreen from './components/SplashScreen';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(() => {
    if (sessionStorage.getItem('splashShown')) return false;
    sessionStorage.setItem('splashShown', 'true');
    return true;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [FileOpen, setFileOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([]);
  const [chats, setChats] = useState<{ chat_id: string; title: string }[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    ANTHROPIC_API_KEY: '',
    MODEL: 'claude-opus-4-6',
    SYSTEM_PROMPT: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/get-chats/');
      setChats(response.data.chats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    if (activeChat) {
      loadChatHistory(activeChat);
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/get-settings/');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const loadChatHistory = async (chat_id: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get-chat-history/${chat_id}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleSendMessage = async (message: { text: string; sender: 'user' | 'ai' }) => {
    setMessages(prevMessages => [...prevMessages, message]);

    if (message.sender === 'ai') return;

    try {
      const response = await axios.post('http://127.0.0.1:8000/ask/', {
        chat_id: activeChat,
        question: message.text,
        chat_history: messages,
      });

      const aiMessage = { text: response.data.answer, sender: 'ai' } as const;
      setMessages(prevMessages => [...prevMessages, aiMessage]);

      if (!activeChat) {
        setActiveChat(response.data.chat_id);
        fetchChats();
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError;

      console.error('Error sending message:', axiosError);

      const message =
        axiosError.response?.status === 401
          ? 'API key not set. Please configure it in settings.'
          : 'Error getting response from AI.';

      setMessages(prevMessages => [...prevMessages, { text: message, sender: 'ai' }]);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className='flex h-screen bg-[#0a0d14] text-[#e8eaf0]'
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveChat={setActiveChat}
        activeChat={activeChat}
        chats={chats}
        fetchChats={fetchChats}
      />
      <div
        className={`flex-1 flex flex-col md:w-[75%] ${
          sidebarOpen && window.innerWidth < 768 ? 'hidden' : 'block'
        }`}
      >
        {/* Header */}
        <div className='flex justify-between items-center bg-[#0f1320] border-b border-[#1e2840] px-5 py-3.5 text-[#e8eaf0]'>
          <button
            onClick={() => setSidebarOpen(e => !e)}
            className='p-2 rounded-lg transition-all duration-200 hover:bg-[#1c2236] text-[#8892a4] hover:text-[#e8eaf0]'
          >
            {!sidebarOpen ? <FaBars size={16} /> : ' '}
          </button>
          <h1 className='text-sm font-medium text-[#e8eaf0] text-center flex-1 ml-14 truncate max-w-[50%]'>
            {activeChat ? (chats.find(c => c.chat_id === activeChat)?.title ?? 'Chat') : 'New Chat'}
          </h1>
          <div className='flex gap-2'>
            <button
              onClick={() => setFileOpen(true)}
              className='p-2 rounded-lg transition-all duration-200 hover:bg-[#1c2236] text-[#8892a4] hover:text-[#818cf8]'
              title='Manage PDFs'
            >
              <FaRegFileAlt size={16} />
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className='p-2 rounded-lg transition-all duration-200 hover:bg-[#1c2236] text-[#8892a4] hover:text-[#818cf8]'
              title='Settings'
            >
              <FiSettings size={16} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <ChatMessages
          messages={messages}
          chatId={activeChat}
        />

        {/* Input Field */}
        <InputField onSendMessage={handleSendMessage} />
      </div>

      {/* PDF Modal */}
      {FileOpen && <PDFModal setPdfModalOpen={setFileOpen} />}

      {/* Settings Modal */}
      {settingsOpen && (
        <SettingsModal
          setSettingsOpen={setSettingsOpen}
          fetchSettings={fetchSettings}
          settings={settings}
          setSettings={setSettings}
        />
      )}
    </div>
  );
};

export default App;
