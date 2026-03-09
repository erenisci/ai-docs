import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

interface ChatMessagesProps {
  messages: { text: string; sender: 'user' | 'ai' }[];
  chatId: string | null;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages = [] }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className='flex-1 flex flex-col overflow-y-auto px-[6%] sm:px-[8%] md:px-[6%] lg:px-[10%] xl:px-[14%] 2xl:px-[18%] py-8 space-y-3 items-center w-full self-center'>
      {messages.length === 0 && (
        <div className='flex flex-col items-center justify-center flex-1 gap-3 text-center mt-20'>
          <div className='w-12 h-12 rounded-2xl bg-[#1e2040] flex items-center justify-center'>
            <span className='text-[#818cf8] text-xl'>✦</span>
          </div>
          <p className='text-[#505a70] text-sm'>Start a conversation</p>
        </div>
      )}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`px-4 py-3 rounded-2xl max-w-[75%] break-words text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-[#6366f1] text-white rounded-br-sm shadow-lg shadow-indigo-900/20'
                : 'ai-message bg-[#151929] text-[#c8ccd8] border border-[#1e2840] rounded-bl-sm'
            }`}
          >
            {msg.sender === 'ai' ? (
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {msg.text}
              </ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
