import { FaRobot, FaUser, FaCopy, FaCode } from 'react-icons/fa6';
import { useState } from 'react';

function SqlBlock({ sql }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-gray-700/50">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800/80 text-xs text-gray-400">
        <span className="flex items-center gap-1.5"><FaCode /> Câu lệnh SQL</span>
        <button onClick={handleCopy} className="flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer">
          <FaCopy /> {copied ? 'Đã sao chép!' : 'Sao chép'}
        </button>
      </div>
      <pre className="px-4 py-3 bg-gray-900/80 text-sm text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap">
        {sql}
      </pre>
    </div>
  );
}

function ResultTable({ data }) {
  if (!Array.isArray(data) || data.length === 0) return null;
  const columns = Object.keys(data[0]);

  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-gray-700/50">
      <div className="px-3 py-2 bg-cyan-500/10 text-xs text-cyan-400 font-medium">
        📋 Kết quả: {data.length} dòng
      </div>
      <div className="overflow-x-auto max-h-64">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800/60">
              {columns.map(col => (
                <th key={col} className="px-3 py-2 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                {columns.map(col => (
                  <td key={col} className="px-3 py-2 text-gray-300 whitespace-nowrap">
                    {String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-slide-up">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xs shrink-0">
        <FaRobot />
      </div>
      <div className="glass-light rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
          <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
          <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
        </div>
      </div>
    </div>
  );
}

export default function MessageBubble({ msg, isTyping }) {
  if (isTyping) return <TypingIndicator />;

  if (msg.role === 'user') {
    return (
      <div className="flex items-start gap-3 justify-end animate-slide-up">
        <div className="max-w-[75%] bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 
                        rounded-2xl rounded-br-sm px-4 py-3 shadow-lg">
          <p className="text-sm leading-relaxed">{msg.content}</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-xs shrink-0">
          <FaUser />
        </div>
      </div>
    );
  }

  if (msg.role === 'error') {
    return (
      <div className="flex items-start gap-3 animate-slide-up">
        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 text-xs shrink-0">
          ⚠
        </div>
        <div className="max-w-[75%] bg-red-500/10 border border-red-500/30 rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-sm text-red-300">{msg.content}</p>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex items-start gap-3 animate-slide-up">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xs shrink-0">
        <FaRobot />
      </div>
      <div className="max-w-[80%] glass-light rounded-2xl rounded-tl-sm px-4 py-3">
        {msg.message && (
          <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
        )}
        {msg.sql && <SqlBlock sql={msg.sql} />}
        {msg.result && <ResultTable data={msg.result} />}
        {msg.time && (
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span>⏱ {msg.time}s</span>
            {Array.isArray(msg.result) && <span>📋 {msg.result.length} kết quả</span>}
          </div>
        )}
      </div>
    </div>
  );
}
