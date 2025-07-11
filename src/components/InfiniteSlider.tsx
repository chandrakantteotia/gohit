import React from 'react';
import { Building2, Users, Award, TrendingUp } from 'lucide-react';

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

interface InfiniteSliderProps {
  stats: StatItem[];
  speed?: number;
  className?: string;
}

const InfiniteSlider: React.FC<InfiniteSliderProps> = ({ 
  stats, 
  speed = 30,
  className = '' 
}) => {
  // Duplicate stats for seamless infinite loop
  const duplicatedStats = [...stats, ...stats, ...stats];

  return (
    <div className={`overflow-hidden ${className}`}>
      <div 
        className="flex animate-infinite-scroll"
        style={{
          animationDuration: `${speed}s`,
          width: `${duplicatedStats.length * 300}px`
        }}
      >
        {duplicatedStats.map((stat, index) => (
          <div 
            key={index}
            className="flex-shrink-0 w-72 mx-4"
          >
            <div className="text-center group cursor-pointer bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-blue-700 group-hover:to-blue-800 dark:group-hover:from-blue-600 dark:group-hover:to-blue-700 transition-all duration-500 shadow-lg group-hover:shadow-xl transform group-hover:scale-110 group-hover:rotate-6">
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-500 transform group-hover:scale-110">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium text-lg group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-all duration-500">
                {stat.label}
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-150"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-200"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteSlider;