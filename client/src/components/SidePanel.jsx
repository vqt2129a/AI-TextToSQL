import { useState, useEffect } from 'react';
import { FaClock, FaDatabase, FaTrash, FaXmark } from 'react-icons/fa6';
import { getDbInfo } from '../utils/api';

function HistoryTab({ history, clearHistory }) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 text-sm">
        <FaClock className="text-2xl mb-2 opacity-50" />
        <p>Chưa có lịch sử</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800/50">
        <span className="text-xs text-gray-500">{history.length} mục</span>
        <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer">
          <FaTrash className="text-[10px]" /> Xoá
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {history.map((item, i) => (
          <div key={i} className="px-3 py-2.5 border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-600">{item.timestamp}</span>
              {item.time && <span className="text-[10px] text-emerald-500">✓ {item.time}s</span>}
            </div>
            <p className="text-xs text-gray-300 font-medium truncate">{item.question}</p>
            {item.sql && (
              <p className="text-[10px] text-gray-500 mt-0.5 truncate font-mono">{item.sql}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DbInfoTab() {
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    getDbInfo().then(setSchema).catch(() => {});
  }, []);

  return (
    <div className="p-3">
      {schema ? (
        <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono leading-relaxed">
          {schema.schema || 'Không có dữ liệu schema'}
        </pre>
      ) : (
        <div className="text-center text-gray-500 text-sm py-8">
          <FaDatabase className="text-2xl mx-auto mb-2 opacity-50" />
          <p>Đang tải...</p>
        </div>
      )}
    </div>
  );
}

export default function SidePanel({ history, clearHistory, isOpen, onClose }) {
  const [tab, setTab] = useState('history');

  return (
    <>
      {/* Overlay backdrop on mobile/tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Side panel */}
      <aside className={`
        fixed top-0 right-0 h-full w-72 z-40
        lg:relative lg:z-auto
        glass border-l border-gray-800/50 flex flex-col overflow-hidden
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Close button on mobile/tablet */}
        <div className="flex items-center justify-between px-3 py-2 lg:hidden border-b border-gray-800/50">
          <span className="text-sm text-gray-300 font-medium">Panel</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 cursor-pointer">
            <FaXmark />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800/50">
          <button
            onClick={() => setTab('history')}
            className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              tab === 'history' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <FaClock /> Lịch sử
            {history.length > 0 && (
              <span className="bg-cyan-500/20 text-cyan-400 text-[10px] px-1.5 py-0.5 rounded-full">
                {history.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('db')}
            className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              tab === 'db' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <FaDatabase /> CSDL
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-hidden">
          {tab === 'history' ? (
            <HistoryTab history={history} clearHistory={clearHistory} />
          ) : (
            <DbInfoTab />
          )}
        </div>
      </aside>
    </>
  );
}
