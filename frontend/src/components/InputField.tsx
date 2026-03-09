import { useRef, useState } from 'react';
import { LuSendHorizontal } from 'react-icons/lu';

interface InputFieldProps {
  onSendMessage: (message: { text: string; sender: 'user' | 'ai' }) => void;
}

const InputField: React.FC<InputFieldProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    onSendMessage({ text: input, sender: 'user' });
    setInput('');

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    });
  };

  return (
    <div className='pb-6 px-4 flex justify-center'>
      <div className='flex items-end gap-2 bg-[#151929] border border-[#2a3347] rounded-2xl px-4 py-3 w-full max-w-[37rem] shadow-xl shadow-black/20 focus-within:border-[#6366f1] transition-colors duration-200'>
        <textarea
          ref={textareaRef}
          placeholder='Message AI-Docs...'
          className='flex-1 bg-transparent text-[#e8eaf0] placeholder-[#505a70] resize-none overflow-hidden min-h-[24px] max-h-40 text-sm outline-none leading-relaxed'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
        />
        <button
          onClick={handleSend}
          className='flex-shrink-0 p-2 rounded-xl transition-all duration-200 bg-[#6366f1] hover:bg-[#4f52d8] text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/30'
          disabled={!input.trim()}
        >
          <LuSendHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};

export default InputField;
