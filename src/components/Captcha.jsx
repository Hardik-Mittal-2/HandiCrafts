import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export const Captcha = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setUserInput('');
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (userInput.length === 6) {
      onVerify(userInput === captchaText);
    } else {
      onVerify(false);
    }
  }, [userInput, captchaText]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gradient-to-r from-bronze-gold/20 to-goldenrod/20 p-4 rounded-lg border-2 border-bronze-gold/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern"></div>
          <p className="relative text-2xl tracking-widest select-none" style={{ 
            fontFamily: 'monospace',
            letterSpacing: '0.3em',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            transform: 'skew(-5deg)'
          }}>
            {captchaText}
          </p>
        </div>
        <button
          type="button"
          onClick={generateCaptcha}
          className="p-3 bg-bronze-gold hover:bg-goldenrod text-white rounded-lg transition-colors"
          aria-label="Refresh captcha"
        >
          <RefreshCw size={20} />
        </button>
      </div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value.slice(0, 6))}
        placeholder="Enter captcha code"
        className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface"
        maxLength={6}
      />
      {userInput.length === 6 && userInput !== captchaText && (
        <p className="text-red-600 text-sm">Incorrect captcha. Please try again.</p>
      )}
    </div>
  );
};
