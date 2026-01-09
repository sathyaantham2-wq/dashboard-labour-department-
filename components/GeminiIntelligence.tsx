
import React, { useState } from 'react';
import { getActionableIntelligence } from '../services/geminiService';
import { DashboardState } from '../types';

interface Props {
  data: DashboardState;
}

export const GeminiIntelligence: React.FC<Props> = ({ data }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await getActionableIntelligence(data);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-xl shadow-lg mt-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10">
         <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="p-1 bg-indigo-500 rounded text-xs uppercase tracking-widest">AI</span>
            Gemini Actionable Intelligence
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Real-time analytics and strategic recommendations based on current jurisdiction data.
          </p>
        </div>
        {!insight && !loading && (
          <button 
            onClick={handleGenerate}
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-indigo-500/20 whitespace-nowrap"
          >
            Generate Report
          </button>
        )}
      </div>

      {loading && (
        <div className="mt-8 flex items-center justify-center space-x-3 text-slate-300">
          <div className="animate-spin h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full"></div>
          <span>Analyzing departmental databases...</span>
        </div>
      )}

      {insight && (
        <div className="mt-6 prose prose-invert max-w-none animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-5 bg-white/5 border border-white/10 rounded-lg text-slate-100 leading-relaxed whitespace-pre-wrap">
            {insight.split('\n').map((line, i) => (
              <div key={i} className="mb-2">
                {line.startsWith('- ') || line.startsWith('* ') ? (
                   <span className="flex gap-2">
                     <span className="text-indigo-400 mt-1">•</span>
                     <span>{line.substring(2)}</span>
                   </span>
                ) : line.match(/^\d+\./) ? (
                   <span className="font-semibold text-indigo-300">{line}</span>
                ) : (
                  line
                )}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setInsight(null)}
            className="mt-4 text-slate-400 hover:text-white text-xs underline"
          >
            Clear and Re-generate
          </button>
        </div>
      )}
    </div>
  );
};
