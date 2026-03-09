import { FaChevronLeft } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import ConversationItem from './ConversationItem';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setActiveChat: (chat_id: string | null) => void;
  activeChat: string | null;
  chats: { chat_id: string; title: string }[];
  fetchChats: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  setActiveChat,
  activeChat,
  chats,
  fetchChats,
}) => {
  const handleNewChat = () => {
    setActiveChat(null);
  };

  return (
    <div
      className={`md:w-[25%] md:max-w-[20rem] bg-[#0f1320] border-r border-[#1e2840] p-4 h-screen flex flex-col ${
        sidebarOpen ? 'w-[100%]' : 'hidden'
      }`}
    >
      {/* Sidebar Header */}
      <div className='flex justify-center items-center w-full relative py-1'>
        <a href='#'>
          <h2 className='text-base font-semibold tracking-widest uppercase text-[#818cf8]'>
            AI-Docs
          </h2>
        </a>
        <button
          onClick={() => setSidebarOpen(false)}
          className='absolute right-0 p-2 rounded-lg transition-all duration-200 hover:bg-[#1c2236] text-[#8892a4] hover:text-[#e8eaf0]'
        >
          <FaChevronLeft size={14} />
        </button>
      </div>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className='w-full mt-6 p-2.5 bg-[#6366f1] hover:bg-[#4f52d8] transition-all duration-200 rounded-lg flex items-center justify-center gap-2 text-white text-sm font-medium shadow-lg shadow-indigo-900/30'
      >
        <FiPlus size={16} /> New Chat
      </button>

      {/* Chat List */}
      <div className='mt-3 mb-1 px-1'>
        <span className='text-[10px] font-semibold uppercase tracking-widest text-[#505a70]'>
          Conversations
        </span>
      </div>
      <ul className='mt-1 space-y-0.5 overflow-y-auto flex flex-col w-full flex-1'>
        {chats.map(({ chat_id, title }) => (
          <ConversationItem
            key={chat_id}
            chat_id={chat_id}
            title={title}
            onSelect={setActiveChat}
            activeChat={activeChat}
            refreshChats={fetchChats}
            handleNewChat={handleNewChat}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
