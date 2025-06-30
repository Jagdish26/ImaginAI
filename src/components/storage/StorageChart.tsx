import React from 'react';
import { BarChart3, TrendingUp, Upload, Trash2 } from 'lucide-react';

interface StorageData {
  date: string;
  uploads: number;
  deletions: number;
  storage: number;
}

interface StorageChartProps {
  data: StorageData[];
}

const StorageChart: React.FC<StorageChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.uploads, d.deletions, d.storage)));
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:bg-white/10">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-purple-400" />
        <h4 className="text-lg font-semibold text-white">Daily Activity</h4>
      </div>
      
      <div className="space-y-4">
        {data.slice(0, 7).reverse().map((day, index) => (
          <div key={day.date} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <div className="flex items-center gap-3 sm:gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Upload className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-400">{day.uploads}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trash2 className="w-3 h-3 text-red-400" />
                  <span className="text-red-400">{day.deletions}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">{day.storage}MB</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              {/* Uploads Bar */}
              <div className="flex items-center gap-2">
                <div className="w-8 sm:w-12 text-xs text-blue-400">Up</div>
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(day.uploads / maxValue) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Deletions Bar */}
              <div className="flex items-center gap-2">
                <div className="w-8 sm:w-12 text-xs text-red-400">Del</div>
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(day.deletions / maxValue) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Storage Bar */}
              <div className="flex items-center gap-2">
                <div className="w-8 sm:w-12 text-xs text-emerald-400">Stor</div>
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(day.storage / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div>
            <div className="text-base sm:text-lg font-bold text-blue-400">
              {data.reduce((sum, d) => sum + d.uploads, 0)}
            </div>
            <div className="text-xs text-gray-400">Total Uploads</div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-red-400">
              {data.reduce((sum, d) => sum + d.deletions, 0)}
            </div>
            <div className="text-xs text-gray-400">Total Deletions</div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-emerald-400">
              {Math.round(data.reduce((sum, d) => sum + d.storage, 0) / data.length)}MB
            </div>
            <div className="text-xs text-gray-400">Avg Storage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageChart;