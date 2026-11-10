import React from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { Palette, Type, Square, Sparkles, Check } from 'lucide-react';
import { ButtonDesign, BorderRadiusSize } from '../../types/index.ts';

const colorPalettes = [
  {
    name: 'Blue Wien Sovereign (Recommended)',
    primary: '#1d4ed8', // Royal Blue
    secondary: '#09152b', // Navy Blue
    accent: '#eab308', // Subtle Gold
    bg: '#f8fafc',
    text: '#0f172a'
  },
  {
    name: 'Zurich Private Banking',
    primary: '#1e3a8a',
    secondary: '#0f172a',
    accent: '#d97706',
    bg: '#ffffff',
    text: '#111827'
  },
  {
    name: 'Wall Street Executive',
    primary: '#2563eb',
    secondary: '#020617',
    accent: '#f59e0b',
    bg: '#f1f5f9',
    text: '#090d16'
  },
  {
    name: 'Mayfair Financial Crest',
    primary: '#0369a1',
    secondary: '#082f49',
    accent: '#ca8a04',
    bg: '#f8fafc',
    text: '#0c1a2e'
  }
];

export const ThemeColorsTab: React.FC = () => {
  const { theme, updateTheme } = useBuilder();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-400" />
          <span>Theme, Color Palette &amp; Typography</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize brand colors, typography stacks, button geometries, and design aesthetics across the entire portal.
        </p>
      </div>

      {/* Preset Palettes */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Curated Financial Color Palettes
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {colorPalettes.map((p, idx) => {
            const isSelected = theme.primaryColor === p.primary && theme.secondaryColor === p.secondary;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => updateTheme({
                  primaryColor: p.primary,
                  secondaryColor: p.secondary,
                  accentColor: p.accent,
                  backgroundColor: p.bg,
                  textColor: p.text
                })}
                className={`p-3.5 rounded-xl border text-left space-y-3 transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500' 
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{p.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                </div>
                <div className="flex h-5 rounded-lg overflow-hidden border border-slate-700">
                  <div className="flex-1" style={{ backgroundColor: p.primary }} title="Primary" />
                  <div className="flex-1" style={{ backgroundColor: p.secondary }} title="Secondary" />
                  <div className="w-4" style={{ backgroundColor: p.accent }} title="Accent Gold" />
                  <div className="w-4" style={{ backgroundColor: p.bg }} title="Background" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Individual Color Pickers */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Custom Color Definitions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Primary Color */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">Primary (Royal Blue)</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={e => updateTheme({ primaryColor: e.target.value })}
                className="w-9 h-9 rounded-md border border-slate-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={theme.primaryColor}
                onChange={e => updateTheme({ primaryColor: e.target.value })}
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400">Buttons, highlights, badges</p>
          </div>

          {/* Secondary Color */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">Secondary (Navy Blue)</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.secondaryColor}
                onChange={e => updateTheme({ secondaryColor: e.target.value })}
                className="w-9 h-9 rounded-md border border-slate-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={theme.secondaryColor}
                onChange={e => updateTheme({ secondaryColor: e.target.value })}
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400">Headers, hero panels, deep footers</p>
          </div>

          {/* Accent Gold */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">Accent (Subtle Gold)</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.accentColor}
                onChange={e => updateTheme({ accentColor: e.target.value })}
                className="w-9 h-9 rounded-md border border-slate-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={theme.accentColor}
                onChange={e => updateTheme({ accentColor: e.target.value })}
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400">Rates, star ratings, crest accents</p>
          </div>

          {/* Background Color */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">Page Background</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.backgroundColor}
                onChange={e => updateTheme({ backgroundColor: e.target.value })}
                className="w-9 h-9 rounded-md border border-slate-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={theme.backgroundColor}
                onChange={e => updateTheme({ backgroundColor: e.target.value })}
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400">Main portal body backdrop</p>
          </div>
        </div>
      </div>

      {/* Typography & Geometry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Typography Stack */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Typography &amp; Scale</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Font Family</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(['Plus Jakarta Sans', 'Inter', 'Manrope', 'Cinzel', 'Playfair Display'] as const).map(font => (
                <button
                  key={font}
                  type="button"
                  onClick={() => updateTheme({ fontFamily: font })}
                  className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                    theme.fontFamily === font
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Heading Scale</label>
              <select
                value={theme.headingFontSize}
                onChange={e => updateTheme({ headingFontSize: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="normal">Standard (h1: 32px)</option>
                <option value="large">Prominent (h1: 40px)</option>
                <option value="xlarge">Executive Hero (h1: 48px)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Body Text Scale</label>
              <select
                value={theme.bodyFontSize}
                onChange={e => updateTheme({ bodyFontSize: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="small">Compact (14px)</option>
                <option value="normal">Standard (15px)</option>
                <option value="medium">Enhanced (16px)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Button & Border Geometries */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Square className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Component Geometry</h3>
          </div>

          {/* Button Design */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Button Style</label>
            <div className="grid grid-cols-3 gap-2">
              {(['rounded', 'pill', 'sharp', 'glass', 'shadow'] as ButtonDesign[]).map(btn => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => updateTheme({ buttonDesign: btn })}
                  className={`py-2 px-3 text-xs font-medium capitalize rounded-lg border transition-all ${
                    theme.buttonDesign === btn
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Card &amp; Input Corner Radius</label>
            <div className="grid grid-cols-5 gap-2">
              {(['none', 'sm', 'md', 'lg', 'full'] as BorderRadiusSize[]).map(radius => (
                <button
                  key={radius}
                  type="button"
                  onClick={() => updateTheme({ borderRadius: radius })}
                  className={`py-2 text-center text-xs font-medium uppercase rounded-lg border transition-all ${
                    theme.borderRadius === radius
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {radius}
                </button>
              ))}
            </div>
          </div>

          {/* Sample Button Preview */}
          <div className="pt-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2">Interactive Button Preview</span>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
              <button
                type="button"
                style={{ backgroundColor: theme.primaryColor }}
                className={`px-5 py-2 text-xs font-bold text-white transition-all shadow-md ${
                  theme.borderRadius === 'none' ? 'rounded-none' :
                  theme.borderRadius === 'sm' ? 'rounded-sm' :
                  theme.borderRadius === 'md' ? 'rounded-md' :
                  theme.borderRadius === 'lg' ? 'rounded-xl' : 'rounded-full'
                }`}
              >
                Apply Now Button
              </button>
              <button
                type="button"
                style={{ borderColor: theme.accentColor, color: theme.accentColor }}
                className={`px-5 py-2 text-xs font-bold border transition-all ${
                  theme.borderRadius === 'none' ? 'rounded-none' :
                  theme.borderRadius === 'sm' ? 'rounded-sm' :
                  theme.borderRadius === 'md' ? 'rounded-md' :
                  theme.borderRadius === 'lg' ? 'rounded-xl' : 'rounded-full'
                }`}
              >
                Explore Rates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
