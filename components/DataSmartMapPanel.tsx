import React, { useState } from 'react';
import { 
    Layers, 
    Database, 
    Wand2, 
    Table, 
    Map as MapIcon, 
    Monitor, 
    Box, 
    Columns, 
    Grid, 
    Keyboard, 
    HelpCircle, 
    PanelRight, 
    PlusCircle,
    Plus,
    Minus,
    Search,
    ChevronDown
} from 'lucide-react';

export const DataSmartMapPanel: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');

  if (view === 'dashboard') {
      return <SmartMapDashboard onCreate={() => setView('editor')} />;
  }
  return <SmartMapEditor />;
};

// --- Dashboard View Components ---

const SmartMapDashboard: React.FC<{ onCreate: () => void }> = ({ onCreate }) => {
    return (
        <div className="flex-1 flex flex-col h-full bg-white animate-fadeIn overflow-y-auto">
            <div className="p-8 pb-4">
                <h1 className="text-2xl font-bold text-slate-800 mb-8">数据智图</h1>
            </div>

            {/* Empty State / CTA */}
            <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-6 opacity-20">
                    <MapIcon size={64} className="text-slate-400" />
                </div>
                <p className="text-slate-500 mb-6 text-sm">您尚未创建任何地图场景</p>
                <button 
                    onClick={onCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm shadow-blue-200"
                >
                    创建你的地图场景
                </button>
            </div>

            {/* Suggestions */}
            <div className="px-8 mt-12 pb-10">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">需要灵感？</div>
                <h2 className="text-xl font-bold text-slate-800 mb-6">快速开始指南</h2>
                
                <div className="grid grid-cols-4 gap-6">
                    <SuggestionCard 
                        title="Galapagos" 
                        subtitle="加拉帕戈斯群岛等高线"
                        gradient="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"
                        overlayStyle="opacity-60"
                        bgImage="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/640px-World_map_blank_without_borders.svg.png"
                    />
                    <SuggestionCard 
                        title="COVID" 
                        subtitle="美国新冠疫苗接种可视化"
                        gradient="bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95]"
                        overlayStyle="opacity-50 mix-blend-screen"
                        bgImage="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/640px-World_map_-_low_resolution.svg.png"
                    />
                    <SuggestionCard 
                        title="H3 Grid" 
                        subtitle="H3 空间索引聚合示例"
                        gradient="bg-gradient-to-br from-[#334155] to-[#475569]"
                        overlayStyle="opacity-40"
                    />
                    <SuggestionCard 
                        title="OSM" 
                        subtitle="OpenStreetMap 建筑轮廓"
                        gradient="bg-gradient-to-br from-[#4a4e69] to-[#9a8c98]"
                        overlayStyle="opacity-60"
                        bgImage="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/640px-World_map_blank_without_borders.svg.png"
                    />
                </div>
            </div>
        </div>
    );
};

const SuggestionCard: React.FC<{ title: string; subtitle: string; gradient: string; overlayStyle?: string; bgImage?: string }> = ({ title, subtitle, gradient, overlayStyle, bgImage }) => (
    <div className={`relative h-48 rounded-lg overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all ${gradient}`}>
        {/* Background Pattern Simulation */}
        {bgImage && (
             <img src={bgImage} className={`absolute inset-0 w-full h-full object-cover mix-blend-overlay ${overlayStyle} group-hover:scale-105 transition-transform duration-700`} alt="" />
        )}
        {!bgImage && (
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
        )}
        
        <div className="absolute bottom-0 left-0 p-5 w-full bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-bold text-base mb-0.5">{title}</h3>
            <p className="text-white/80 text-xs font-medium">{subtitle}</p>
        </div>
    </div>
);


// --- Editor View Components ---

const SmartMapEditor: React.FC = () => {
    return (
        <div className="flex flex-col h-full bg-slate-50 animate-fadeIn">
            {/* Top Toolbar - Matches Screenshot 2 */}
            <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-3 flex-shrink-0 z-20">
                {/* Left Group */}
                <div className="flex items-center gap-1">
                    <ToolbarIcon icon={<Layers size={18} />} active label="图层管理" />
                    <ToolbarIcon icon={<Database size={18} />} label="数据源" />
                    <ToolbarIcon icon={<Wand2 size={18} />} label="空间分析" />
                    <ToolbarIcon icon={<Table size={18} />} label="属性表" />
                    <ToolbarIcon icon={<MapIcon size={18} />} label="地图配置" />
                </div>

                {/* Center Group */}
                <div className="flex items-center gap-4">
                    <div className="h-5 w-px bg-slate-200"></div>
                    <span className="text-xs text-slate-500 font-medium">地图视图</span>
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
                        <button className="p-1.5 bg-white text-blue-600 rounded shadow-sm border border-slate-200/50"><Monitor size={14} /></button>
                        <button className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded"><Box size={14} /></button>
                        <button className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded"><Columns size={14} /></button>
                    </div>
                    <div className="flex items-center gap-1">
                         <button className="p-2 text-slate-400 hover:text-slate-600"><Grid size={16} /></button>
                         <button className="p-2 text-slate-400 hover:text-slate-600"><Keyboard size={16} /></button>
                    </div>
                </div>

                {/* Right Group */}
                <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600"><HelpCircle size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 border-l border-slate-200 pl-3"><PanelRight size={18} /></button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Sidebar */}
                <div className="w-[300px] bg-white border-r border-slate-200 flex flex-col z-10">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-base font-bold text-slate-800">图层列表</h2>
                    </div>
                    
                    {/* Empty Layers State */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 mb-4 relative">
                            <Layers size={48} strokeWidth={1} className="text-blue-500 absolute top-0 left-0" />
                            <Layers size={48} strokeWidth={1} className="text-blue-500 absolute top-2 left-2 opacity-50" />
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed px-4">
                            添加图层后，将在此处显示列表。
                        </p>
                    </div>

                    {/* Sources Section */}
                    <div className="border-t border-slate-200">
                        <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 tracking-wide">
                                <Database size={14} />
                                数据源 (0)
                            </div>
                            <div className="flex gap-2 text-slate-400">
                                <Search size={14} />
                                <ChevronDown size={14} />
                            </div>
                        </div>
                        <div className="p-4 pt-2 text-center">
                             <p className="text-sm text-slate-400 mb-4">暂无数据源</p>
                             <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                <PlusCircle size={16} />
                                添加数据源...
                             </button>
                        </div>
                    </div>
                </div>

                {/* Map Canvas */}
                <div className="flex-1 bg-[#dcdfe4] relative overflow-hidden">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/BlankMap-World.svg/2560px-BlankMap-World.svg.png" 
                        className="w-full h-full object-cover opacity-60 mix-blend-multiply grayscale"
                        alt="Map Base"
                    />
                    
                    {/* Map Controls */}
                    <div className="absolute bottom-6 left-6 flex flex-col gap-1 shadow-lg rounded-lg overflow-hidden bg-white border border-slate-200/50">
                         <button className="p-2 hover:bg-slate-50 text-slate-600 border-b border-slate-100"><Plus size={18} /></button>
                         <button className="p-2 hover:bg-slate-50 text-slate-600"><Minus size={18} /></button>
                    </div>
                    <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur px-2 py-0.5 text-[10px] text-slate-500 rounded">
                        © CARTO, © OpenStreetMap contributors
                    </div>
                </div>
            </div>
        </div>
    );
};

const ToolbarIcon: React.FC<{ icon: React.ReactNode; label?: string; active?: boolean }> = ({ icon, label, active }) => (
    <div className={`p-3 relative cursor-pointer group ${active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
        {icon}
        {active && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full"></div>}
    </div>
);
