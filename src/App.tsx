
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, Download, Undo, 
  Sparkles, Sliders, Check, Share2, 
  Palette, MousePointer2, RefreshCcw, Layout, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { processImage, ProcessingOptions, ArtStyle } from './utils/imageProcessor';
import { cn } from './utils/cn';

const App: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'adjust' | 'styles' | 'preview'>('adjust');
  const [options, setOptions] = useState<ProcessingOptions>({
    threshold: 128,
    contrast: 20,
    brightness: 0,
    blur: 5,
    lineWeight: 1,
    style: 'sketch',
    noiseReduction: true,
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  };

  const loadImage = (file: File) => {
    setImageName(file.name.replace(/\.[^/.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const updateArt = useCallback(() => {
    if (image && canvasRef.current) {
      setIsProcessing(true);
      // Use requestAnimationFrame for smoother UI while processing
      requestAnimationFrame(() => {
        processImage(canvasRef.current!, image, options);
        setIsProcessing(false);
      });
    }
  }, [image, options]);

  useEffect(() => {
    updateArt();
  }, [updateArt]);

  const handleDownload = async (format: 'png' | 'svg') => {
    const canvas = canvasRef.current;
    if (!canvas || !imageName) return;

    try {
      if (format === 'svg') {
        const { ImageTracerBrowser } = await import('@image-tracer-ts/browser');
        // Use a temporary canvas to ensure we have clean data for tracing
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.drawImage(canvas, 0, 0);
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        
        const svgString = await ImageTracerBrowser.fromImageData(imageData, {
          lineErrorMargin: 0.5,
          curveErrorMargin: 0.5,
          minShapeOutline: 4,
          strokeWidth: 1,
          lineFilter: true,
          scale: 1,
          numberOfColors: 2,
        } as any);
        
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${imageName}_linear.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // High quality PNG export
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${imageName}_linear.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#000000']
      });
    } catch (err) {
      console.error("Export error:", err);
      alert("Could not export. Please check your browser permissions.");
    }
  };

  const styles: { id: ArtStyle; name: string; desc: string }[] = [
    { id: 'sketch', name: 'Pencil Sketch', desc: 'Soft, artistic graphite lines' },
    { id: 'technical', name: 'Technical', desc: 'Clean, architectural outlines' },
    { id: 'bold', name: 'Marker Bold', desc: 'Strong, thick ink strokes' },
    { id: 'minimal', name: 'Minimal Path', desc: 'High-contrast fine paths' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent -z-10 pointer-events-none" />

      {/* Modern Nav */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-50">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">ArtLine <span className="text-indigo-600">Pro</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Image to Line Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {image && (
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  onClick={() => handleDownload('png')}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-white rounded-xl transition-all"
                >
                  PNG
                </button>
                <button
                  onClick={() => handleDownload('svg')}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Download size={14} />
                  SVG Vector
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Layout size={18} />
                </div>
                <h2 className="font-bold text-slate-800">Workspace</h2>
              </div>
              <button 
                onClick={() => setOptions({ ...options, threshold: 128, contrast: 20, brightness: 0, blur: 5, lineWeight: 1 })}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
              >
                <Undo size={14} /> Reset
              </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
              {[
                { id: 'adjust', icon: Sliders, label: 'Fine Tune' },
                { id: 'styles', icon: Palette, label: 'Styles' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all",
                    activeTab === tab.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'adjust' && (
                <motion.div 
                  key="adjust"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  {[
                    { id: 'blur', label: 'Ink Softness', min: 1, max: 20, step: 1, unit: 'px' },
                    { id: 'contrast', label: 'Edge Contrast', min: -100, max: 100, step: 1, unit: '' },
                    { id: 'threshold', label: 'Ink Strength', min: 0, max: 255, step: 1, unit: '' },
                    { id: 'lineWeight', label: 'Stroke Weight', min: 1, max: 10, step: 1, unit: '' },
                  ].map((s) => (
                    <div key={s.id} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">{s.label}</label>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-50 rounded-md text-slate-600">
                          {options[s.id as keyof ProcessingOptions]}{s.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={s.min} max={s.max} step={s.step}
                        value={options[s.id as keyof ProcessingOptions] as number}
                        onChange={(e) => setOptions({ ...options, [s.id]: parseInt(e.target.value) })}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'styles' && (
                <motion.div 
                  key="styles"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  className="grid grid-cols-1 gap-3"
                >
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setOptions({ ...options, style: style.id })}
                      className={cn(
                        "p-4 rounded-2xl text-left border-2 transition-all group",
                        options.style === style.id 
                          ? "border-indigo-600 bg-indigo-50/50" 
                          : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn("text-sm font-bold", options.style === style.id ? "text-indigo-600" : "text-slate-700")}>
                          {style.name}
                        </span>
                        {options.style === style.id && <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white"><Check size={12} /></div>}
                      </div>
                      <p className="text-[10px] font-medium text-slate-400">{style.desc}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 p-5 bg-indigo-600 rounded-[1.5rem] text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
               <div className="flex items-center gap-3 mb-2">
                 <MousePointer2 size={16} />
                 <h4 className="text-xs font-bold uppercase tracking-widest">Pro Tip</h4>
               </div>
               <p className="text-[10px] leading-relaxed font-medium opacity-90">
                 Set <b>Ink Strength</b> higher for bold tattoo designs, or lower for detailed fine-art sketches.
               </p>
            </div>
          </section>
        </div>

        {/* Right Content: Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {!image ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-[600px] border-2 border-dashed border-slate-200/60 bg-white rounded-[3rem] flex flex-col items-center justify-center gap-8 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/20 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative">
                <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-500 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-sm border border-indigo-100/50">
                  <Upload size={36} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 text-indigo-600">
                  <Plus size={18} />
                </div>
              </div>

              <div className="text-center relative z-10 px-8">
                <h3 className="text-2xl font-black text-slate-800 mb-2">Initialize Art Engine</h3>
                <p className="text-slate-400 font-medium">Drag & drop or click to upload your high-res canvas</p>
              </div>

              <div className="flex gap-3 relative z-10">
                {['Portrait', 'Landscape', 'Tattoo', 'Logo'].map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tag}</span>
                ))}
              </div>

              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setImage(null)}
                    className="w-10 h-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all hover:border-red-100"
                  >
                    <X size={18} />
                  </button>
                  <div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">{imageName}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Active Processing</span>
                       <div className="w-1 h-1 bg-indigo-600 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   <button 
                    onClick={updateArt}
                    className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"
                   >
                     <RefreshCcw size={16} className={isProcessing ? "animate-spin" : ""} />
                   </button>
                   <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
                     <Share2 size={16} />
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Source Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source Material</span>
                    <span className="text-[10px] font-mono text-slate-300">{image.width}×{image.height}px</span>
                  </div>
                  <div className="bg-slate-100 rounded-[2.5rem] border-4 border-white shadow-inner overflow-hidden aspect-square flex items-center justify-center relative group">
                    <img 
                      src={image.src} 
                      alt="Source" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                  </div>
                </div>

                {/* AI Result */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Digital Ink Result</span>
                    <span className="text-[10px] font-mono text-indigo-300">Style: {options.style}</span>
                  </div>
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-indigo-100/50 aspect-square flex items-center justify-center p-8 relative overflow-hidden group">
                    <div className={cn(
                      "absolute inset-0 bg-indigo-600/5 opacity-0 transition-opacity flex items-center justify-center pointer-events-none z-10",
                      isProcessing && "opacity-100"
                    )}>
                      <Loader2 className="animate-spin text-indigo-600" size={32} />
                    </div>
                    <canvas 
                      ref={canvasRef} 
                      className="max-w-full max-h-full object-contain cursor-crosshair transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-auto border-t border-slate-200/60 bg-white/50 py-8 px-6 backdrop-blur-md">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Local Processing Active</span>
               </div>
               <div className="flex items-center gap-2">
                 <ShieldCheck size={14} className="text-slate-300" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">End-to-End Privacy</span>
               </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               Linear Art Engine v2.4 Pro • Standard Industry Vector Core
            </p>
         </div>
      </footer>
    </div>
  );
};

// Internal SVG components not found in lucide
const Plus = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Loader2 = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cn("animate-spin", className)}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const ShieldCheck = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default App;
