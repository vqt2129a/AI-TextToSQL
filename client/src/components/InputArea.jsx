import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa6';

export default function InputArea({ onSend, isProcessing }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!isProcessing) textareaRef.current?.focus();
  }, [isProcessing]);

  const handleSend = () => {
    if (!text.trim() || isProcessing) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="border-t border-gray-800/50 bg-gray-950/80 backdrop-blur-xl px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-end gap-3">
        <div className="flex-1 glass rounded-xl px-4 py-2.5 flex items-end gap-2 focus-within:border-cyan-500/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi bằng tiếng Việt... (Ctrl+Enter để gửi)"
            rows={1}
            disabled={isProcessing}
            className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500 resize-none max-h-[120px]"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={isProcessing || !text.trim()}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 text-white 
                     flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer
                     hover:scale-105 hover:shadow-lg hover:shadow-black/30
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isProcessing ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FaPaperPlane className="text-sm" />
          )}
        </button>
      </div>
      <p className="text-center text-xs text-gray-600 mt-1.5">
        <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 text-[10px]">Ctrl</kbd>
        {' + '}
        <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 text-[10px]">Enter</kbd>
        {' để gửi'}
      </p>
    </div>
  );
}
