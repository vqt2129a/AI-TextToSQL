import { FaBrain, FaBars } from 'react-icons/fa6';

export default function Header({ isConnected, onToggleSidePanel }) {
  return (
    <header className="glass border-b border-gray-800/50 px-4 md:px-6 py-2.5 md:py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2.5 md:gap-3">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
          <FaBrain className="text-cyan-400 text-sm md:text-lg" />
        </div>
        <div>
          <h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-gray-100 to-cyan-300 bg-clip-text text-transparent">
            AI Tra Cứu
          </h1>
          <span className="hidden sm:block text-xs text-gray-500">Tra cứu thông tin hành chính Việt Nam</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`flex items-center gap-1.5 text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full border ${
          isConnected
            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
            : 'text-red-400 border-red-500/30 bg-red-500/10'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="hidden sm:inline">{isConnected ? 'Đã kết nối' : 'Mất kết nối'}</span>
        </span>

        {/* Toggle side panel button on mobile */}
        <button
          onClick={onToggleSidePanel}
          className="md:hidden w-8 h-8 rounded-lg glass-light flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <FaBars className="text-sm" />
        </button>
      </div>
    </header>
  );
}
