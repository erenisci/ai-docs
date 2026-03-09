import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';

interface Settings {
  ANTHROPIC_API_KEY: string;
  MODEL: string;
  SYSTEM_PROMPT: string;
}

interface SettingsModalProps {
  settings: Settings;
  setSettings: (settings: {
    ANTHROPIC_API_KEY: string;
    MODEL: string;
    SYSTEM_PROMPT: string;
  }) => void;
  setSettingsOpen: (open: boolean) => void;
  fetchSettings: () => Promise<void>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  setSettings,
  setSettingsOpen,
  fetchSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const updateSettings = async () => {
    try {
      const trimmedSettings = {
        ANTHROPIC_API_KEY: localSettings.ANTHROPIC_API_KEY.replace(/^\s+|\s+$/g, ''),
        MODEL: localSettings.MODEL.replace(/^\s+|\s+$/g, ''),
        SYSTEM_PROMPT: localSettings.SYSTEM_PROMPT.replace(/^\s+|\s+$/g, ''),
      };
      setLocalSettings(trimmedSettings);
      setSettings(trimmedSettings);

      await axios.post('http://127.0.0.1:8000/update-settings/', localSettings, {
        headers: { 'Content-Type': 'application/json' },
      });

      alert('Settings updated successfully!');
      await fetchSettings();

      setSettingsOpen(false);
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings.');
    }
  };

  const labelClass = 'block mb-1 text-xs font-medium text-[#8892a4] uppercase tracking-wider';
  const inputClass =
    'w-full bg-[#0a0d14] border border-[#2a3347] focus:border-[#6366f1] text-[#e8eaf0] rounded-xl px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder-[#505a70]';

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50'>
      <div className='bg-[#0f1320] border border-[#1e2840] rounded-2xl p-6 w-[30rem] shadow-2xl shadow-black/50'>
        {/* Modal Header */}
        <div className='flex justify-between items-center mb-5'>
          <h2 className='text-base font-semibold text-[#e8eaf0]'>Settings</h2>
          <button
            onClick={() => setSettingsOpen(false)}
            className='p-1.5 rounded-lg text-[#8892a4] hover:text-[#e8eaf0] hover:bg-[#1c2236] transition-all duration-200'
          >
            <FiX size={16} />
          </button>
        </div>

        {/* API Key */}
        <div className='mb-4'>
          <label className={labelClass}>Anthropic API Key</label>
          <div className='flex items-center bg-[#0a0d14] border border-[#2a3347] focus-within:border-[#6366f1] rounded-xl px-3 py-2.5 transition-colors duration-200'>
            <input
              type={showApiKey ? 'text' : 'password'}
              className='flex-1 bg-transparent outline-none text-sm text-[#e8eaf0] placeholder-[#505a70]'
              placeholder='sk-ant-...'
              value={localSettings.ANTHROPIC_API_KEY}
              onChange={e =>
                setLocalSettings({ ...localSettings, ANTHROPIC_API_KEY: e.target.value })
              }
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className='ml-2 text-[#505a70] hover:text-[#8892a4] transition-colors'
            >
              {showApiKey ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
        </div>

        {/* Model */}
        <div className='mb-4'>
          <label className={labelClass}>Model</label>
          <select
            className={inputClass + ' cursor-pointer'}
            value={localSettings.MODEL}
            onChange={e => setLocalSettings({ ...localSettings, MODEL: e.target.value })}
          >
            <optgroup label='Claude Haiku'>
              <option value='claude-haiku-4-5'>Claude Haiku 4.5</option>
            </optgroup>
            <optgroup label='Claude Sonnet'>
              <option value='claude-sonnet-4-5'>Claude Sonnet 4.5</option>
              <option value='claude-sonnet-4-6'>Claude Sonnet 4.6</option>
            </optgroup>
            <optgroup label='Claude Opus'>
              <option value='claude-opus-4-5'>Claude Opus 4.5</option>
              <option value='claude-opus-4-6'>Claude Opus 4.6</option>
            </optgroup>
          </select>
        </div>

        {/* System Prompt */}
        <div className='mb-5'>
          <label className={labelClass}>System Prompt</label>
          <textarea
            className={inputClass + ' h-32 resize-none overflow-y-auto'}
            placeholder='You are a helpful assistant...'
            value={localSettings.SYSTEM_PROMPT}
            onChange={e => setLocalSettings({ ...localSettings, SYSTEM_PROMPT: e.target.value })}
          />
        </div>

        {/* Actions */}
        <div className='flex justify-end gap-2'>
          <button
            onClick={() => setSettingsOpen(false)}
            className='px-4 py-2 rounded-xl text-sm text-[#8892a4] hover:text-[#e8eaf0] hover:bg-[#1c2236] transition-all duration-200'
          >
            Cancel
          </button>
          <button
            onClick={updateSettings}
            className='px-5 py-2 rounded-xl text-sm bg-[#6366f1] hover:bg-[#4f52d8] text-white font-medium transition-all duration-200 shadow-lg shadow-indigo-900/30'
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
