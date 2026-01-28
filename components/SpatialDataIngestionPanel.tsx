import React, { useState } from 'react';
import { 
    Search, 
    Plus, 
    Trash2, 
    Eye, 
    Edit, 
    FileText, 
    RotateCw, 
    X, 
    ChevronDown, 
    ChevronLeft, 
    ChevronRight,
    CheckCircle2,
    XCircle
} from 'lucide-react';

interface IngestionTask {
    id: string;
    name: string;
    type: string;
    status: 'success' | 'failure' | 'processing';
    progress: number;
    log: string;
    creator: string;
    createTime: string;
}

interface SpatialDataIngestionPanelProps {
    onCreateTask: () => void;
}

const MOCK_TASKS: IngestionTask[] = [
    { id: '1', name: '上传离线任务-202512...', type: 'Shp', status: 'success', progress: 100, log: '导入成功，数据量：107', creator: '光谷信息', createTime: '2025-12-29 13:11:04' },
    { id: '2', name: '【样本集导入】样本集...', type: 'Shp', status: 'success', progress: 100, log: '导入成功，数据量：107', creator: '光谷信息', createTime: '2025-12-29 11:42:15' },
    { id: '3', name: '上传离线任务-20251229110429', type: 'Shp', status: 'failure', progress: 60, log: '数据导入失败：数据已经入...', creator: '光谷信息', createTime: '2025-12-29 11:35:04' },
    { id: '4', name: '上传离线任务-202512...', type: '影像', status: 'success', progress: 100, log: '导入成功', creator: '光谷信息', createTime: '2025-12-29 11:10:51' },
    { id: '5', name: 'landsat卫星数据批量...', type: '影像', status: 'success', progress: 100, log: '导入成功', creator: '光谷信息', createTime: '2025-12-29 10:58:56' },
    { id: '6', name: 'landsat卫星数据批量...', type: '影像', status: 'success', progress: 100, log: '导入成功', creator: '光谷信息', createTime: '2025-12-29 10:58:56' },
    { id: '7', name: 'landsat卫星数据批量...', type: '影像', status: 'success', progress: 100, log: '导入成功', creator: '光谷信息', createTime: '2025-12-29 10:58:56' },
    { id: '8', name: '上传离线任务-202512...', type: 'Shp', status: 'success', progress: 100, log: '导入成功，数据量：107', creator: '光谷信息', createTime: '2025-12-29 10:54:56' },
];

export const SpatialDataIngestionPanel: React.FC<SpatialDataIngestionPanelProps> = ({ onCreateTask }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    return (
        <div className="flex-1 flex flex-col bg-[#f0f4f8] h-full overflow-hidden p-6 animate-fadeIn">
            {/* 1. Header Banner */}
            {isBannerVisible && (
                <div className="relative mb-6 p-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg shadow-blue-200 overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative z-10 pr-12">
                        <h2 className="text-lg font-bold text-white mb-2">时空数据入库</h2>
                        <p className="text-blue-100 text-sm leading-relaxed max-w-4xl">
                            时空数据入库主要支持栅格（卫星、无人机等）、矢量等多类型时空数据等经过采集、接入、空间建模等处理后进行综合管理。
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsBannerVisible(false)}
                        className="absolute top-4 right-4 p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* 2. Main Content Card */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
                {/* Filter & Action Row */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    {/* Status Tabs */}
                    <div className="bg-slate-100/80 p-1 rounded-lg flex items-center h-9">
                        <TabButton label="全部" count={8} active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
                        <TabButton label="进行中" count={0} active={activeTab === 'processing'} onClick={() => setActiveTab('processing')} />
                        <TabButton label="成功" count={7} active={activeTab === 'success'} onClick={() => setActiveTab('success')} />
                        <TabButton label="失败" count={1} active={activeTab === 'failure'} onClick={() => setActiveTab('failure')} />
                    </div>

                    {/* Search & Global Actions */}
                    <div className="flex items-center gap-3 h-9">
                        <div className="relative h-full">
                            <input 
                                type="text" 
                                placeholder="请输入任务名称搜索" 
                                className="w-64 pl-4 pr-10 h-full bg-white border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                            />
                            <Search className="absolute right-3 top-2.5 text-slate-300" size={14} />
                        </div>
                        <button className="flex items-center gap-1.5 px-3 h-full border border-slate-200 text-slate-500 rounded-lg text-[13px] font-medium hover:bg-slate-50 transition-all">
                            <Trash2 size={13} />
                            批量删除
                        </button>
                        <button 
                            onClick={onCreateTask}
                            className="flex items-center gap-1.5 px-4 h-full bg-blue-600 text-white rounded-lg text-[13px] font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-100"
                        >
                            <Plus size={16} strokeWidth={3} />
                            创建数据集成任务
                        </button>
                    </div>
                </div>

                {/* Table Area */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left text-[13px] border-collapse min-w-[1200px]">
                        <thead className="bg-[#f8fbfd] text-slate-500 font-bold sticky top-0 z-10 border-b border-slate-100">
                            <tr>
                                <th className="p-4 w-12 text-center"><input type="checkbox" className="rounded border-slate-300" /></th>
                                <th className="p-4">任务名称</th>
                                <th className="p-4">数据类型</th>
                                <th className="p-4">任务状态</th>
                                <th className="p-4 w-48">进度</th>
                                <th className="p-4">执行日志</th>
                                <th className="p-4">创建人</th>
                                <th className="p-4">创建时间</th>
                                <th className="p-4 text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {MOCK_TASKS.map((task) => (
                                <tr key={task.id} className="hover:bg-blue-50/20 transition-all group">
                                    <td className="p-4 text-center"><input type="checkbox" className="rounded border-slate-300" /></td>
                                    <td className="p-4">
                                        <div className="text-slate-800 font-medium group-hover:text-blue-600 transition-colors cursor-pointer">{task.name}</div>
                                    </td>
                                    <td className="p-4 text-slate-600">{task.type}</td>
                                    <td className="p-4">
                                        <span className={`
                                            px-2.5 py-0.5 rounded text-[11px] font-bold border
                                            ${task.status === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}
                                        `}>
                                            {task.status === 'success' ? '成功' : '失败'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-1000 ${task.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} 
                                                    style={{ width: `${task.progress}%` }}
                                                />
                                            </div>
                                            {task.status === 'success' ? (
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                            ) : (
                                                <XCircle size={14} className="text-red-500" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-slate-500 truncate max-w-[180px]" title={task.log}>{task.log}</div>
                                    </td>
                                    <td className="p-4 text-slate-600">{task.creator}</td>
                                    <td className="p-4 text-slate-400 font-mono text-xs">{task.createTime}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5 text-slate-400">
                                            <button className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all" title="查看"><Eye size={16} /></button>
                                            <button className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all" title="编辑"><Edit size={16} /></button>
                                            <button className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-md transition-all" title="删除"><Trash2 size={16} /></button>
                                            <button className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all" title="查看日志"><FileText size={16} /></button>
                                            {task.status === 'failure' && (
                                                <button className="p-1.5 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-all" title="重试"><RotateCw size={16} /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between p-4 bg-slate-50/40 border-t border-slate-100">
                    <div className="text-[12px] text-slate-400">共 8 条</div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded text-xs text-slate-500 cursor-pointer hover:border-blue-300">
                            10条/页 <ChevronDown size={12} />
                        </div>
                        <div className="flex gap-1 items-center">
                            <button className="p-1 text-slate-300 hover:text-slate-600 transition-colors"><ChevronLeft size={16} /></button>
                            <button className="w-7 h-7 bg-blue-600 text-white rounded font-bold text-xs shadow-md shadow-blue-100">1</button>
                            <button className="p-1 text-slate-300 hover:text-slate-600 transition-colors"><ChevronRight size={16} /></button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            前往 <input type="text" className="w-8 h-7 border border-slate-200 rounded text-center outline-none focus:border-blue-500" defaultValue="1" /> 页
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TabButton: React.FC<{ label: string; count: number; active: boolean; onClick: () => void }> = ({ label, count, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`
            flex items-center gap-2 px-4 h-full rounded-md text-[13px] font-bold transition-all duration-300
            ${active 
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'}
        `}
    >
        <span>{label}</span>
        <span className={`px-1.5 py-0 rounded-md text-[10px] ${active ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-400'}`}>
            {count}
        </span>
    </button>
);
