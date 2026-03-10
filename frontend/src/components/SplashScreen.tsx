import { useEffect, useState } from 'react';

interface Props {
  onDone: () => void;
}

const SplashScreen: React.FC<Props> = ({ onDone }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), 1500);
    const doneTimer = setTimeout(() => onDone(), 2500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0d14]'
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 1000ms ease',
        pointerEvents: 'none',
      }}
    >
      <h1
        style={{ fontFamily: "'Inter', sans-serif" }}
        className='text-6xl font-bold text-[#818cf8] tracking-tight'
      >
        AI-Docs
      </h1>
      <p className='mt-4 text-[#8892a4] text-lg tracking-wide'>
        Your intelligent document assistant
      </p>
    </div>
  );
};

export default SplashScreen;
