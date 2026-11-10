import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { Eye, Monitor, Tablet, Smartphone, Maximize2, RefreshCw } from 'lucide-react';
import { PublicAppView } from '../public/PublicAppView.tsx';

export const LivePreviewTab: React.FC = () => {
  const { previewDevice, setPreviewDevice, setActiveView, branding } = useBuilder();
  const [refreshKey, setRefreshKey] = useState(0);

  const getViewportWidth = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'max-w-[390px] h-[780px] rounded-[36px] border-[8px] border-slate-800 shadow-2xl';
      case 'tablet':
        return 'max-w-[768px] h-[850px] rounded-[24px] border-[6px] border-slate-800 shadow-2xl';
      default:
        return 'w-full min-h-[800px] rounded-xl border border-slate-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <span>Responsive Live Viewport Simulation</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Test real-time interactive responsive layouts, EMI calculation widgets, and navigation across device screens.
          </p>
        </div>

        {/* Viewport Device Controls */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          <button
            onClick={() => setPreviewDevice('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              previewDevice === 'desktop'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setPreviewDevice('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              previewDevice === 'tablet'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet (768px)</span>
          </button>
          <button
            onClick={() => setPreviewDevice('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              previewDevice === 'mobile'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile (390px)</span>
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1" />

          <button
            onClick={() => setRefreshKey(k => k + 1)}
            title="Reload Viewport"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveView('public')}
            title="Open Fullscreen View"
            className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-slate-800"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex justify-center p-2 sm:p-6 bg-slate-950/80 rounded-2xl border border-slate-800/80 overflow-hidden">
        <div 
          key={refreshKey}
          className={`${getViewportWidth()} bg-white overflow-y-auto transition-all duration-300 relative`}
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          {/* Simulated Mobile Top Speaker Notch */}
          {previewDevice === 'mobile' && (
            <div className="sticky top-0 z-50 bg-slate-900 h-6 flex items-center justify-center">
              <div className="w-20 h-3 bg-slate-800 rounded-full" />
            </div>
          )}

          <div className="pointer-events-auto">
            <PublicAppView isEmbeddedPreview={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
