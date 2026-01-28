
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  LayoutGrid, 
  List, 
  ChevronRight, 
  ChevronDown,
  Tag as TagIcon, 
  Globe, 
  Database, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Info,
  CheckCircle2,
  X,
  FileText,
  Lightbulb,
  Copy,
  Check,
  Calendar,
  FolderTree,
  Hash,
  ChevronLeft,
  Clock,
  ChevronRight as ChevronRightIcon,
  Plus,
  Eye,
  ArrowRightCircle
} from 'lucide-react';
import { APIRow } from '../constants';
import { DirectoryNode } from './ServiceDevelopmentPanel';
import { ServiceDetailView } from './ServiceDetailView';
import { ApplicationRecord } from '../types';

interface ServiceMarketPanelProps {
  apiData: APIRow[];
  directories: DirectoryNode[];
  onApplySuccess: (record: ApplicationRecord) => void;
}

const DATA_TAGS_RAW = [
  { name: '卫星影像', count: 125 },
  { name: '矢量底图', count: 112 },
  { name: '行政区划', count: 98 },
  { name: '标准服务', count: 86 },
  { name: '业务分析', count: 77 },
  { name: '气象数据', count: 65 },
  { name: '栅格数据', count: 45 },
  { name: '其他', count: 12 }
];

const SORTED_DATA_TAGS = [...DATA_TAGS_RAW].sort((a, b) => b.count - a.count);
const SPATIAL_PROTOCOLS = ['WMTS', 'WMS', 'WFS', 'XYZ'];
const DURATION_OPTIONS = ['3天', '7天', '1个月', '永久', '自定义'];

export const ServiceMarketPanel: React.FC<ServiceMarketPanelProps> = ({ apiData = [], directories = [], onApplySuccess }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeDirectoryId, setActiveDirectoryId] = useState('all');
  const [activeTag, setActiveTag] = useState<string>('全部'); 
  const [sidebarTab, setSidebarTab] = useState<'tags' | 'category'>('tags'); 
  const [searchText, setSearchText] = useState('');
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyingService, setApplyingService] = useState<APIRow | null>(null);
  
  // 申请弹窗状态
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>(['WMTS']);
  const [selectedDuration, setSelectedDuration] = useState<string>('1个月');
  const [customDays, setCustomDays] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 详情视图状态
  const [activeView, setActiveView] = useState<'market' | 'detail'>('market');
  const [selectedApiForDetail, setSelectedApiForDetail] = useState<APIRow | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTag, activeDirectoryId, sidebarTab, searchText]);

  const getDirServiceCount = (dirId: string): number => {
    if (dirId === 'all') return (apiData || []).filter(a => a.status === 'online').length;
    return (apiData || []).filter(a => a.dirId === dirId && a.status === 'online').length;
  };

  const filteredAllOnlineServices = useMemo(() => {
    return (apiData || []).filter(api => {
      if (api.status !== 'online') return false;
      const matchSearch = api.name.toLowerCase().includes(searchText.toLowerCase());
      if (!matchSearch) return false;

      if (sidebarTab === 'category') {
        const matchDir = activeDirectoryId === 'all' || api.dirId === activeDirectoryId;
        return matchDir;
      } else {
        if (activeTag === '全部') return true;
        const name = api.name;
        const desc = api.description || '';
        const cat = api.category;
        const type = api.type;

        switch (activeTag) {
          case '卫星影像': return name.includes('影像') || desc.includes('影像');
          case '矢量底图': return cat === '时空数据服务' && (name.includes('地图') || name.includes('行政区') || type === 'WMS' || type === 'WFS');
          case '行政区划': return name.includes('行政区') || desc.includes('行政区');
          case '标准服务': return ['WMS', 'WFS', 'WMTS', 'COG'].includes(type);
          case '业务分析': return cat === '业务数据服务' && (name.includes('分析') || desc.includes('分析'));
          case '气象数据': return name.includes('气象') || desc.includes('气象');
          case '栅格数据': return api.dataType === '栅格' || type === 'WMTS' || type === 'COG';
          default: return desc.includes(activeTag) || name.includes(activeTag);
        }
      }
    });
  }, [apiData, searchText, activeDirectoryId, activeTag, sidebarTab]);

  const onlineServices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return (filteredAllOnlineServices || []).slice(start, start + pageSize);
  }, [filteredAllOnlineServices, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAllOnlineServices.length / pageSize) || 1;

  const handleApply = (service: APIRow) => {
    setApplyingService(service);
    setSelectedProtocols(service.category === '时空数据服务' ? ['WMTS'] : ['RESTful']);
    setSelectedDuration('1个月');
    setCustomDays('');
    setShowApplyModal(true);
  };

  const submitApplication = () => {
      if (!applyingService) return;
      
      // 校验自定义时长
      if (selectedDuration === '自定义' && (!customDays || parseInt(customDays) <= 0)) {
          alert('请设置有效的自定义时长天数');
          return;
      }

      const newRecord: ApplicationRecord = {
          id: `APP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 900 + 100)}`,
          serviceId: applyingService.id,
          serviceName: applyingService.name,
          category: applyingService.category,
          type: applyingService.type,
          duration: selectedDuration === '自定义' ? `${customDays}天` : selectedDuration,
          status: 'pending',
          applyTime: new Date().toLocaleString(),
          protocols: selectedProtocols,
          applicant: '系统管理员',
          source: '服务集市'
      };
      
      onApplySuccess(newRecord);
      setShowApplyModal(false);
      alert('申请已提交，请前往“我的申请”查看进度！');
  };

  const toggleProtocol = (proto: string) => {
    setSelectedProtocols(prev => 
        prev.includes(proto) ? prev.filter(p => p !== proto) : [...prev, proto]
    );
  };

  const handleViewDetail = (service: APIRow) => {
    setSelectedApiForDetail(service);
    setActiveView('detail');
  };

  if (activeView === 'detail' && selectedApiForDetail) {
    return <ServiceDetailView api={selectedApiForDetail} onBack={() => setActiveView('market')} showSql={false} />;
  }

  // 协议获取通用逻辑
  const getServiceProtocols = (service: APIRow) => {
    if (service.category === '时空数据服务') return SPATIAL_PROTOCOLS;
    return [service.type || 'RESTful'];
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full animate-fadeIn overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0 bg-white z-20">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
          <h2 className="text-[16px] font-bold text-slate-800 tracking-tight">服务集市</h2>
          <div className="relative group ml-1">
            <div className="p-1 hover:bg-slate-100 rounded-full cursor-help transition-colors">
              <Lightbulb size={16} className="text-slate-300 group-hover:text-yellow-500 transition-colors" />
            </div>
            <div className="absolute left-0 top-full mt-2 w-[320px] bg-slate-800/95 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 z-[100] ring-1 ring-white/10 origin-top-left">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                <Info size={14} className="text-blue-400" />
                <span className="text-[13px] font-bold tracking-wide">服务集市说明</span>
              </div>
              <div className="space-y-2.5 text-slate-300 text-[12px]">
                <p><strong className="text-white">能力发现：</strong>发现各部门共享的标准化数据服务能力。</p>
                <p><strong className="text-white">申请联动：</strong>点击申请后，记录将实时同步至“我的申请”。</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索服务名称..." 
              className="w-72 h-9 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all text-sm shadow-sm" 
            />
          </div>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 shadow-inner">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={16} /></button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><List size={16} /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-[240px] flex-shrink-0 flex flex-col border-r border-slate-100 bg-[#f8fbfd]/40 overflow-hidden">
          <div className="flex px-4 pt-4 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
            <button onClick={() => setSidebarTab('tags')} className={`flex-1 flex flex-col items-center gap-1.5 pb-2 transition-all relative ${sidebarTab === 'tags' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'}`}>
              <div className="flex items-center gap-1.5 text-[12px]"><Hash size={13} />数据标签</div>
              {sidebarTab === 'tags' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
            </button>
            <button onClick={() => setSidebarTab('category')} className={`flex-1 flex flex-col items-center gap-1.5 pb-2 transition-all relative ${sidebarTab === 'category' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'}`}>
              <div className="flex items-center gap-1.5 text-[12px]"><FolderTree size={13} />服务分类</div>
              {sidebarTab === 'category' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
            {sidebarTab === 'tags' ? (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-2 gap-2.5">
                  <button 
                    onClick={() => setActiveTag('全部')} 
                    className={`
                      col-span-2 py-2.5 rounded-lg text-[13px] font-bold transition-all border text-center
                      ${activeTag === '全部' 
                        ? 'bg-blue-50 border-blue-500 border-solid text-blue-600 shadow-sm' 
                        : 'bg-white border-slate-200 border-dashed text-slate-600 hover:border-blue-400 hover:text-blue-500'}
                    `}
                  >
                    全部
                  </button>
                  {(SORTED_DATA_TAGS || []).map(tag => (
                    <button 
                      key={tag.name} 
                      onClick={() => setActiveTag(tag.name)} 
                      className={`
                        py-2.5 rounded-lg text-[13px] font-medium transition-all border text-center truncate px-1
                        ${activeTag === tag.name 
                          ? 'bg-blue-50 border-blue-500 border-solid text-blue-600 font-bold shadow-sm' 
                          : 'bg-white border-slate-200 border-dashed text-slate-600 hover:border-blue-400 hover:text-blue-500'}
                      `}
                      title={`${tag.name} (${tag.count})`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-0.5 animate-fadeIn">
                <ReadOnlyDirectoryTreeItem node={{ id: 'all', label: '全部服务' }} activeId={activeDirectoryId} onSelect={setActiveDirectoryId} count={getDirServiceCount('all')} isRoot expanded={true}>
                    {(directories || []).map(dir => (
                        <ReadOnlyDirectoryNodeRenderer key={dir.id} node={dir} activeId={activeDirectoryId} onSelect={setActiveDirectoryId} getServiceCount={getDirServiceCount} />
                    ))}
                </ReadOnlyDirectoryTreeItem>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc]/50">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {(onlineServices || []).length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 animate-slideUp">
                  {(onlineServices || []).map(service => (
                    <ServiceCard key={service.id} service={service} onApply={() => handleApply(service)} onViewDetail={() => handleViewDetail(service)} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-slideUp">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <tr>
                        <th className="p-4 pl-8">服务名称</th><th className="p-4">服务分类</th><th className="p-4">协议</th><th className="p-4 text-center pr-8">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-[13px]">
                      {(onlineServices || []).map(service => {
                        const protocols = getServiceProtocols(service);
                        return (
                          <tr key={service.id} className="hover:bg-blue-50/20 transition-colors group">
                            <td className="p-4 pl-8">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100`}>{service.category === '时空数据服务' ? <Globe size={16} /> : <Database size={16} />}</div>
                                <span onClick={() => handleViewDetail(service)} className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer">{service.name}</span>
                              </div>
                            </td>
                            <td className="p-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold border border-slate-200 bg-white text-slate-500">{service.category}</span></td>
                            <td className="p-4">
                              <div className="flex items-center gap-1 max-w-[200px] overflow-hidden truncate" title={(protocols || []).join(' · ')}>
                                {(protocols || []).map((p, idx) => (
                                  <span key={p} className="text-[12px] font-bold text-blue-600 uppercase tracking-tight whitespace-nowrap">
                                    {p}{idx < (protocols || []).length - 1 ? ' ·' : ''}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 text-center pr-8 flex items-center justify-center gap-3">
                              <button onClick={() => handleViewDetail(service)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"><Info size={18} /></button>
                              <button onClick={() => handleApply(service)} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100">申请服务</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-40 animate-fadeIn">
                 <div className="p-8 bg-slate-50 rounded-full border-2 border-dashed border-slate-200 mb-6 group hover:scale-110 transition-all"><Search size={48} className="text-slate-300 transition-colors" /></div>
                 <h3 className="text-lg font-bold text-slate-700 mb-2">未找到匹配的服务</h3>
                 <p className="text-slate-400 text-sm max-w-sm text-center font-medium">您可以尝试切换标签或选择其他分类目录。</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {(filteredAllOnlineServices || []).length > 0 && (
            <div className="flex items-center justify-between p-4 px-8 bg-white border-t border-slate-100 text-[13px] text-slate-500 select-none">
              <div>共 <span className="font-bold text-slate-800">{(filteredAllOnlineServices || []).length}</span> 条</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded text-[12px] text-slate-600 cursor-pointer hover:bg-slate-50 hover:border-blue-200 transition-all">
                  {pageSize}条/页 <ChevronDown size={14} className="text-slate-300" />
                </div>
                <div className="flex gap-1 items-center">
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(p => p - 1)} 
                    className="p-1.5 border border-slate-200 text-slate-400 rounded hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button className="w-8 h-8 bg-blue-600 text-white rounded font-bold text-[13px] shadow-md shadow-blue-100">{currentPage}</button>
                  <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(p => p + 1)} 
                    className="p-1.5 border border-slate-200 text-slate-400 rounded hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-slate-500">
                    前往 <input type="text" className="w-10 h-8 border border-slate-200 rounded text-center outline-none focus:border-blue-400 font-bold text-blue-600" defaultValue={currentPage} /> 页
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 申请服务弹窗 - 重构后的样式 (提交服务申请) */}
      {showApplyModal && applyingService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fadeIn p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden animate-zoomIn flex flex-col max-h-[95vh] ring-1 ring-slate-900/5">
                
                {/* Modal Header (提交服务申请) */}
                <div className="flex justify-between items-center px-8 py-6 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
                            <CheckCircle2 size={20} strokeWidth={3} />
                        </div>
                        <h3 className="text-[20px] font-black text-slate-800 tracking-tight">提交服务申请</h3>
                    </div>
                    <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar space-y-10">
                    
                    {/* 1. Service Summary Card (Box Style) */}
                    <div className="bg-[#f0f7ff]/60 border border-blue-100 rounded-[20px] p-6 flex gap-6 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-[0.03] rounded-bl-full pointer-events-none"></div>
                        
                        <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-blue-100 flex items-center justify-center flex-shrink-0">
                            {applyingService.category === '时空数据服务' ? <Globe size={28} className="text-blue-600" /> : <Database size={28} className="text-indigo-600" />}
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">{applyingService.category}</span>
                            </div>
                            <h4 className="text-lg font-black text-slate-800 leading-tight">{applyingService.name}</h4>
                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed mt-1">
                                {applyingService.description || '暂无描述信息，请咨询管理员了解详情。'}
                            </p>
                        </div>
                    </div>

                    {/* 2. Protocol Selection (服务协议定制) */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                            <h4 className="text-[15px] font-bold text-slate-800 tracking-tight">服务协议定制</h4>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {getServiceProtocols(applyingService).map(proto => {
                                const isSelected = selectedProtocols.includes(proto);
                                return (
                                    <button 
                                        key={proto}
                                        onClick={() => toggleProtocol(proto)}
                                        className={`
                                            h-11 rounded-xl text-sm font-black transition-all border flex items-center justify-center tracking-wider
                                            ${isSelected 
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                                                : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600'}
                                        `}
                                    >
                                        {proto}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. Duration Selection (申请时长) */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                            <h4 className="text-[15px] font-bold text-slate-800 tracking-tight">申请时长</h4>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            {DURATION_OPTIONS.map(opt => (
                                <button 
                                    key={opt}
                                    onClick={() => setSelectedDuration(opt)}
                                    className={`
                                        h-11 rounded-xl text-sm font-black transition-all border flex items-center justify-center
                                        ${selectedDuration === opt 
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                                    `}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 4. Custom Days Input (设置自定义天数) - Only visible if '自定义' is selected */}
                    {selectedDuration === '自定义' && (
                        <div className="bg-[#f8fafc] border border-slate-200/60 rounded-[20px] p-6 space-y-5 animate-slideUp">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Clock size={16} className="text-blue-600" />
                                    <h5 className="text-[14px] font-black text-slate-700">设置自定义天数</h5>
                                </div>
                                <span className="text-[11px] text-slate-400 font-medium italic">管理员将根据天数进行访问授权审核</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center flex-1 h-11 bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all shadow-sm">
                                    <input 
                                        type="number" 
                                        value={customDays}
                                        onChange={(e) => setCustomDays(e.target.value)}
                                        placeholder="请输入申请天数 (如: 365)"
                                        className="flex-1 h-full px-4 outline-none text-sm font-bold text-slate-800"
                                    />
                                    <div className="px-4 bg-slate-50 border-l border-slate-100 h-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-slate-500">天</span>
                                    </div>
                                </div>
                                
                                {/* Quick Presets */}
                                <div className="flex gap-2">
                                    {['15天', '90天', '180天'].map(d => (
                                        <button 
                                            key={d}
                                            onClick={() => setCustomDays(d.replace('天', ''))}
                                            className={`
                                                px-4 h-11 rounded-xl text-xs font-bold border transition-all
                                                ${customDays === d.replace('天', '') 
                                                    ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-inner' 
                                                    : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600'}
                                            `}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions (取消 / 提交申请) */}
                <div className="px-8 py-6 flex justify-end items-center gap-6 border-t border-slate-100 bg-white flex-shrink-0">
                    <button 
                        onClick={() => setShowApplyModal(false)}
                        className="text-slate-500 hover:text-slate-800 text-[15px] font-bold transition-all px-4"
                    >
                        取消
                    </button>
                    <button 
                        onClick={submitApplication}
                        disabled={selectedProtocols.length === 0}
                        className={`
                            h-12 px-10 rounded-xl text-[15px] font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2
                            ${selectedProtocols.length > 0 
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                                : 'bg-slate-300 text-white cursor-not-allowed'}
                        `}
                    >
                        提交申请
                        <ArrowRightCircle size={18} />
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-components ---

const ServiceCard: React.FC<{ 
  service: APIRow; 
  onApply: () => void; 
  onViewDetail: () => void; 
}> = ({ service, onApply, onViewDetail }) => {
  const isSpatial = service.category === '时空数据服务';
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
       {/* Top Icon Area with Dotted Pattern */}
       <div className="h-40 bg-slate-50 relative overflow-hidden flex items-center justify-center flex-shrink-0">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          
          {/* Badge */}
          <div className="absolute top-3 left-3">
             <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${isSpatial ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {service.type}
             </span>
          </div>

          {/* Large Icon */}
          <div className="text-slate-200 group-hover:scale-110 transition-transform duration-500">
            {isSpatial ? <Globe size={64} strokeWidth={1} /> : <Database size={64} strokeWidth={1} />}
          </div>
       </div>

       {/* Content Area */}
       <div className="p-5 flex flex-col flex-1">
          <h3 onClick={onViewDetail} className="font-bold text-slate-800 text-[15px] mb-2 truncate group-hover:text-blue-600 cursor-pointer transition-colors" title={service.name}>
             {service.name}
          </h3>
          <p className="text-slate-400 text-[12px] line-clamp-2 mb-6 leading-relaxed flex-1">
             {service.description || '暂无描述信息'}
          </p>
          
          {/* Footer Actions - Right Aligned */}
          <div className="flex items-center justify-end gap-2 mt-auto">
             <button 
                onClick={(e) => { e.stopPropagation(); onViewDetail(); }}
                className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
             >
                <Eye size={14} />
                详情
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); onApply(); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-100 active:scale-95"
             >
                申请服务
             </button>
          </div>
       </div>
    </div>
  );
};

const ReadOnlyDirectoryNodeRenderer: React.FC<{
  node: DirectoryNode;
  activeId: string;
  onSelect: (id: string) => void;
  getServiceCount: (id: string) => number;
  level?: number;
}> = ({ node, activeId, onSelect, getServiceCount, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  return (
    <ReadOnlyDirectoryTreeItem 
      node={node} activeId={activeId} onSelect={onSelect} count={getServiceCount(node.id)}
      level={level + 1} expanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)}
    >
      {isExpanded && (node.children || []).map(child => (
        <ReadOnlyDirectoryNodeRenderer key={child.id} node={child} activeId={activeId} onSelect={onSelect} getServiceCount={getServiceCount} level={level + 1} />
      ))}
    </ReadOnlyDirectoryTreeItem>
  );
};

const ReadOnlyDirectoryTreeItem: React.FC<{ 
    node: { id: string; label: string }; 
    activeId: string; 
    onSelect: (id: string) => void; 
    count: number;
    isRoot?: boolean; 
    level?: number; 
    expanded?: boolean; 
    onToggle?: () => void; 
    children?: React.ReactNode; 
}> = ({ node, activeId, onSelect, count, isRoot, level = 0, expanded, onToggle, children }) => {
  const isActive = activeId === node.id;
  const hasChildren = !!children;
  return (
    <div className="flex flex-col">
      <div 
        onClick={() => onSelect(node.id)} 
        className={`flex items-center h-9 px-3 rounded-lg cursor-pointer transition-all duration-200 ${isActive ? 'bg-blue-50 text-blue-600 font-bold shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`} 
        style={{ paddingLeft: `${(level * 18) + 12}px` }}
      >
        <div className="w-4 flex items-center justify-center flex-shrink-0">
            {hasChildren ? <ChevronDown size={14} className={`text-slate-400 transition-transform ${expanded ? '' : '-rotate-90'}`} onClick={(e) => { e.stopPropagation(); onToggle?.(); }} /> : null}
        </div>
        <div className="w-5 flex items-center justify-center flex-shrink-0 ml-1"><Database size={15} className={`${isActive ? 'text-blue-600' : 'text-slate-400'}`} /></div>
        <span className="flex-1 truncate text-[13px] ml-1.5">{node.label}</span>
        {count > 0 && <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{count}</span>}
      </div>
      {children}
    </div>
  );
};
