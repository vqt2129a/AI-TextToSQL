import { FaBrain } from 'react-icons/fa6';

export default function Header({ isConnected }) {
  return (
    <header className="glass border-b border-gray-800/50 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center shadow-lg">
          <FaBrain className="text-cyan-400 text-lg" />
        </div>
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-gray-100 to-cyan-300 bg-clip-text text-transparent">
            AI Tra Cứu
          </h1>
          <span className="text-xs text-gray-500">Tra cứu thông tin hành chính Việt Nam</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${
          isConnected
            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
            : 'text-red-400 border-red-500/30 bg-red-500/10'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
          {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
        </span>
      </div>
    </header>
  );
}
