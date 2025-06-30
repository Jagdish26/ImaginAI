import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Zap, 
  Clock, 
  BarChart3, 
  PieChart, 
  Activity,
  Target,
  Award,
  Sparkles
} from 'lucide-react';

interface UsageData {
  date: string;
  transformations: number;
  processingTime: number;
  styles: Record<string, number>;
}

interface WeeklyStats {
  current: number;
  previous: number;
  limit: number;
  percentage: number;
}

const UsageAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    current: 3,
    previous: 5,
    limit: 5,
    percentage: 60
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with Supabase integration
  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: UsageData[] = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        transformations: Math.floor(Math.random() * 5) + 1,
        processingTime: Math.floor(Math.random() * 3000) + 1000,
        styles: {
          'Classic Ghibli': Math.floor(Math.random() * 3),
          'Spirited Away': Math.floor(Math.random() * 2),
          'Totoro': Math.floor(Math.random() * 2),
          'Howl\'s Castle': Math.floor(Math.random() * 1)
        }
      }));
      
      setUsageData(mockData);
      setIsLoading(false);
    };

    loadAnalytics();
  }, [timeRange]);

  const totalTransformations = usageData.reduce((sum, day) => sum + day.transformations, 0);
  const averageProcessingTime = usageData.reduce((sum, day) => sum + day.processingTime, 0) / usageData.length;
  
  const styleBreakdown = usageData.reduce((acc, day) => {
    Object.entries(day.styles).forEach(([style, count]) => {
      acc[style] = (acc[style] || 0) + count;
    });
    return acc;
  }, {} as Record<string, number>);

  const maxTransformations = Math.max(...usageData.map(d => d.transformations));

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          <div className="h-32 bg-white/10 rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 bg-white/10 rounded"></div>
            <div className="h-16 bg-white/10 rounded"></div>
            <div className="h-16 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Usage Overview */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Usage Analytics
          </h2>
          <div className="flex items-center bg-white/5 border border-white/20 rounded-xl p-1">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as 'week' | 'month' | 'year')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 capitalize ${
                  timeRange === range 
                    ? 'bg-purple-500/20 text-purple-300' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">This Week's Progress</h3>
            <div className="text-purple-400 font-medium">
              {weeklyStats.current} / {weeklyStats.limit} transforms
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${weeklyStats.percentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-300 mt-2">
              <span>0</span>
              <span>{weeklyStats.limit}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">
                {weeklyStats.current > weeklyStats.previous ? '+' : ''}
                {weeklyStats.current - weeklyStats.previous} vs last week
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300">
                {weeklyStats.limit - weeklyStats.current} remaining
              </span>
            </div>
          </div>
        </div>

        {/* Daily Activity Chart */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Activity</h3>
          <div className="grid grid-cols-7 gap-2 h-32">
            {usageData.slice().reverse().map((day, index) => (
              <div key={day.date} className="flex flex-col items-center">
                <div className="flex-1 flex items-end w-full">
                  <div 
                    className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg transition-all duration-1000 ease-out hover:from-purple-500 hover:to-pink-500 cursor-pointer"
                    style={{ 
                      height: `${(day.transformations / maxTransformations) * 100}%`,
                      minHeight: day.transformations > 0 ? '8px' : '2px'
                    }}
                    title={`${day.transformations} transformations`}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-xs text-purple-400 font-medium">
                  {day.transformations}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalTransformations}</div>
                <div className="text-sm text-gray-300">Total Transforms</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{(averageProcessingTime / 1000).toFixed(1)}s</div>
                <div className="text-sm text-gray-300">Avg Processing</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {Object.keys(styleBreakdown).length}
                </div>
                <div className="text-sm text-gray-300">Styles Used</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Style Breakdown */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Style Preferences
        </h3>
        
        <div className="space-y-4">
          {Object.entries(styleBreakdown)
            .sort(([,a], [,b]) => b - a)
            .map(([style, count]) => {
              const percentage = totalTransformations > 0 ? (count / totalTransformations) * 100 : 0;
              return (
                <div key={style} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{style}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300 text-sm">{count} uses</span>
                      <span className="text-purple-400 font-medium">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
        
        {Object.keys(styleBreakdown).length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-300">No style data available yet</p>
            <p className="text-gray-400 text-sm">Start creating transformations to see your preferences</p>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Performance Insights
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div>
                <h4 className="text-white font-medium">Peak Usage Day</h4>
                <p className="text-gray-300 text-sm">Your most active day this week</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-400">
                  {usageData.reduce((max, day) => day.transformations > max.transformations ? day : max, usageData[0])?.transformations || 0}
                </div>
                <div className="text-xs text-gray-400">transforms</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div>
                <h4 className="text-white font-medium">Fastest Processing</h4>
                <p className="text-gray-300 text-sm">Your quickest transformation</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">
                  {Math.min(...usageData.map(d => d.processingTime)) / 1000}s
                </div>
                <div className="text-xs text-gray-400">processing time</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div>
                <h4 className="text-white font-medium">Consistency Score</h4>
                <p className="text-gray-300 text-sm">How regularly you use ImaginAI</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-400">85%</div>
                <div className="text-xs text-gray-400">consistency</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div>
                <h4 className="text-white font-medium">Efficiency Rating</h4>
                <p className="text-gray-300 text-sm">Based on usage patterns</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-400">A+</div>
                <div className="text-xs text-gray-400">rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalytics;