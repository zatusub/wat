import { AIResponse } from "../actions";

interface ResultViewProps {
  data: AIResponse;
  onReset: () => void;
}

export default function ResultView({ data, onReset }: ResultViewProps) {
  return (
    <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header / Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          解説結果
        </h2>
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-primary underline underline-offset-4"
        >
          もう一度質問する
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border shadow-sm mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {data.detected.language}
          </span>
          <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs font-bold">
            {data.detected.errorType}
          </span>
        </div>

        <h3 className="text-xl md:text-3xl font-bold mb-4 leading-tight">
          {data.summary.oneLiner}
        </h3>

        <div className="space-y-2 text-gray-600 dark:text-gray-300">
          <p><span className="font-semibold">日本語訳:</span> {data.summary.translated}</p>
        </div>
      </div>

      {/* Patterns */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold px-2">考えられる原因と対策</h3>

        {data.patterns.map((pattern) => (
          <div key={pattern.id} className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-border bg-surface/30">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 rounded textxs font-bold uppercase ${pattern.likelihood === 'high' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                  pattern.likelihood === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                  {pattern.likelihood === 'high' ? '高確率' : pattern.likelihood === 'medium' ? '中確率' : '低確率'}
                </span>
                <h4 className="text-lg font-bold">{pattern.title}</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{pattern.explanation}</p>
            </div>

            <div className="p-6 grid gap-6 md:grid-cols-2 bg-black/5 dark:bg-white/5">
              {/* Bad Code */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                  <span>NGなコード</span>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-lg p-4 overflow-x-auto font-mono text-sm">
                  <pre className="text-red-900 dark:text-red-100">{pattern.codeExample.bad}</pre>
                </div>
              </div>

              {/* Good Code */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  <span>修正後のコード</span>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/40 rounded-lg p-4 overflow-x-auto font-mono text-sm">
                  <pre className="text-green-900 dark:text-green-100">{pattern.codeExample.good}</pre>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface/50 border-t border-border text-sm">
              <p className="font-semibold mb-1">💡 ポイント</p>
              <p className="text-gray-600 dark:text-gray-400">{pattern.codeExample.why}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
