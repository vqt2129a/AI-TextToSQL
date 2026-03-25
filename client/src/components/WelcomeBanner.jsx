import { FaWandMagicSparkles, FaCity, FaMapLocationDot, FaChartBar } from 'react-icons/fa6';

const suggestions = [
  { icon: <FaCity />, text: 'Danh sách tỉnh thành' },
  { icon: <FaMapLocationDot />, text: 'Hà Nội có bao nhiêu quận huyện?' },
  { icon: <FaChartBar />, text: 'Tổng số phường xã cả nước' },
];

export default function WelcomeBanner({ onSuggestionClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 md:py-16 animate-slide-up px-2">
      <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl mb-4 md:mb-6 animate-pulse">
        <FaWandMagicSparkles className="text-cyan-400 text-xl md:text-3xl" />
      </div>

      <h2 className="text-lg md:text-2xl font-bold text-gray-100 mb-2 text-center">
        Chào mừng đến với AI Tra Cứu!
      </h2>
      <p className="text-sm md:text-base text-gray-400 mb-6 md:mb-8 text-center max-w-sm md:max-w-md">
        Hãy đặt câu hỏi bằng tiếng Việt, AI sẽ tìm kiếm và trả kết quả cho bạn.
      </p>

      <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3 justify-center w-full sm:w-auto">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s.text)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-light text-sm text-gray-300 
                       hover:text-cyan-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 
                       transition-all duration-200 cursor-pointer w-full sm:w-auto justify-center sm:justify-start"
          >
            <span className="text-cyan-400">{s.icon}</span>
            {s.text}
          </button>
        ))}
      </div>
    </div>
  );
}
