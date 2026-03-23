import { FaWandMagicSparkles, FaCity, FaMapLocationDot, FaChartBar } from 'react-icons/fa6';

const suggestions = [
  { icon: <FaCity />, text: 'Danh sách tỉnh thành' },
  { icon: <FaMapLocationDot />, text: 'Hà Nội có bao nhiêu quận huyện?' },
  { icon: <FaChartBar />, text: 'Tổng số phường xã cả nước' },
];

export default function WelcomeBanner({ onSuggestionClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-slide-up">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl mb-6 animate-pulse">
        <FaWandMagicSparkles className="text-cyan-400 text-3xl" />
      </div>

      <h2 className="text-2xl font-bold text-gray-100 mb-2">
        Chào mừng đến với AI Tra Cứu!
      </h2>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Hãy đặt câu hỏi bằng tiếng Việt, AI sẽ tìm kiếm và trả kết quả cho bạn.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s.text)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-light text-sm text-gray-300 
                       hover:text-cyan-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 
                       transition-all duration-200 cursor-pointer"
          >
            <span className="text-cyan-400">{s.icon}</span>
            {s.text}
          </button>
        ))}
      </div>
    </div>
  );
}
