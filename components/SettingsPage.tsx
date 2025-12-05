import React from 'react';
import { Settings } from 'lucide-react';
import { Language } from '../types';

interface SettingsPageProps {
  lang: Language;
  setLang: (l: Language) => void;
  t: any;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ lang, setLang, t }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center z-20">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-lg shadow-2xl backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-purple-500 mb-6 flex items-center gap-2">
           <Settings /> {t.system_config}
        </h2>
        
        <div className="space-y-6">
           {/* Language Switcher */}
           <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold">{t.language}</span>
              <div className="flex bg-slate-800 rounded p-1 gap-1">
                 <button 
                   onClick={() => setLang('en')}
                   className={`px-3 py-1 rounded text-xs font-bold transition-colors ${lang === 'en' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'}`}
                 >
                   English
                 </button>
                 <button 
                   onClick={() => setLang('ar')}
                   className={`px-3 py-1 rounded text-xs font-bold transition-colors ${lang === 'ar' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'}`}
                 >
                   العربية
                 </button>
              </div>
           </div>

           <div className="flex items-center justify-between">
              <span className="text-slate-300">{t.holographic_hud}</span>
              <div className="w-12 h-6 bg-purple-900 rounded-full relative cursor-pointer shadow-inner">
                 <div className="absolute end-1 top-1 w-4 h-4 bg-purple-400 rounded-full shadow-md"></div>
              </div>
           </div>
           <div className="flex items-center justify-between">
              <span className="text-slate-300">{t.ambient_audio}</span>
              <div className="w-12 h-6 bg-slate-800 rounded-full relative cursor-pointer shadow-inner">
                 <div className="absolute start-1 top-1 w-4 h-4 bg-slate-500 rounded-full shadow-md"></div>
              </div>
           </div>
           <div className="flex items-center justify-between">
              <span className="text-slate-300">{t.scanline_fx}</span>
              <div className="w-12 h-6 bg-purple-900 rounded-full relative cursor-pointer shadow-inner">
                 <div className="absolute end-1 top-1 w-4 h-4 bg-purple-400 rounded-full shadow-md"></div>
              </div>
           </div>
           
           <div className="border-t border-slate-800 pt-6 mt-6">
              <button className="w-full py-3 bg-red-900/20 border border-red-900 text-red-500 font-bold uppercase hover:bg-red-900/40 transition-colors rounded">
                 {t.reset_data}
              </button>
              <div className="text-center text-[10px] text-slate-600 mt-2">
                 {t.reset_warning}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
