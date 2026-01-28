import React from 'react';
import { Search, Database, FileText, ChevronRight, ChevronDown, Layers, Globe, LayoutGrid } from 'lucide-react';

export const DataThemePanel: React.FC = () => {
  return (
    <div className="w-[280px] flex-shrink-0 flex flex-col bg-white h-full py-6">
      {/* Title */}
      <div className="px-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
                <Database size={16} />
            </div>
            <span className="text-slate-800 font-semibold text-[15px] tracking-tight">数据主题目录</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 mb-6">
        <div className="relative group">
          <input
            type="text"
            placeholder="搜索目录名称..."
            className="w-full bg-slate-50 border border-slate-200/60 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-300 outline-none transition-all placeholder-slate-400 font-normal"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400 w-3.5 h-3.5 group-focus-within:text-blue-500 transition-colors" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-6 border-b border-slate-50 mb-4 gap-4">
        <TabButton label="原始层" icon={<Layers size={14} />} active />
        <TabButton label="公共层" icon={<Globe size={14} />} />
        <TabButton label="应用层" icon={<LayoutGrid size={14} />} />
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
         <div className="space-y-0.5">
            <TreeItem label="基础地理专题库" icon={<Database size={15} />} />
            
            <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 px-3 py-2 text-slate-700 bg-slate-50/50 rounded-lg text-[13px] font-medium cursor-pointer group">
                    <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
                    <Database size={15} className="text-blue-500 mr-0.5" />
                    <span className="truncate">遥感动态监测专题</span>
                </div>
                <div className="ml-6 space-y-0.5 mt-1 border-l border-slate-100 pl-2">
                    <DatasetItem label="高分哨兵数据集" />
                    <DatasetItem label="正射影像矢量化" />
                    <DatasetItem label="土地利用解译成果" />
                </div>
            </div>

            <TreeItem label="宏观经济发展分析" icon={<Database size={15} />} />
            <TreeItem label="自然资源资产核算" icon={<Database size={15} />} />
         </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ label: string; active?: boolean; icon?: React.ReactNode }> = ({ label, active, icon }) => (
  <div className={`relative flex items-center gap-1.5 px-1 py-3 text-[13px] font-medium cursor-pointer transition-all ${active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon}
    {label}
    {active && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
  </div>
);

const TreeItem: React.FC<{ label: string; icon: any }> = ({ label, icon }) => (
    <div className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-lg text-[13px] font-normal cursor-pointer transition-colors group">
        <ChevronRight size={14} className="text-slate-300 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
        {React.cloneElement(icon, { className: 'text-slate-400 group-hover:text-blue-500' })}
        <span className="truncate">{label}</span>
    </div>
);

const DatasetItem: React.FC<{ label: string }> = ({ label }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:bg-blue-50/30 hover:text-blue-600 rounded-md text-[13px] font-normal cursor-pointer transition-colors">
        <FileText size={13} className="text-slate-300" />
        <span className="truncate">{label}</span>
    </div>
);