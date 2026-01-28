import React, { useState, useRef, useEffect } from 'react';
import { 
    Undo2, 
    ChevronDown, 
    CloudUpload, 
    X,
    FileCode,
    Loader2,
    Settings2,
    Table as TableIcon,
    Plus,
    CheckCircle2,
    Search,
    Check,
    Database,
    HelpCircle,
    FileJson,
    Layers,
    Info
} from 'lucide-react';
import { CloudDiskSelectionModal } from './CloudDiskSelectionModal';

interface CreateIngestionTaskPanelProps {
    onBack: () => void;
}

interface ParsedFile {
    id: string;
    name: string;
    extension: string;
    format: string;
    size: string;
    status: 'success' | 'parsing' | 'error';
    targetDb: string;
    targetTable: string;
    isAutoCreate: boolean;
}

const MOCK_DATABASES = ['postgis_spatial_db', 'oracle_sde_production', 'mysql_geo_base'];
const MOCK_EXISTING_TABLES = ['t_hubei_points', 'res_water_line', 'admin_boundary_poly', 'osm_roads_main', 'henan_boundary_2024', 'zz_water_poly'];

export const CreateIngestionTaskPanel: React.FC<CreateIngestionTaskPanelProps> = ({ onBack }) => {
    const [sourceType, setSourceType] = useState<'cloud' | 'datasource'>('cloud');
    const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
    const [selectedCloudFiles, setSelectedCloudFiles] = useState<any[]>([]);
    const [parsedFiles, setParsedFiles] = useState<ParsedFile[]>([]);
    const [isParsing, setIsParsing] = useState(false);

    const steps = [
        { id: 1, label: '数据注册与上传' },
        { id: 2, label: '数据质检规则与模板' },
        { id: 3, label: '服务注册与发布' },
    ];

    const activeStep = 1;

    const handleCloudConfirm = (files: any[]) => {
        setSelectedCloudFiles(files);
        setIsCloudModalOpen(false);
        
        if (files.length > 0) {
            setIsParsing(true);
            setParsedFiles([]); // 清空旧数据
            
            // 模拟智能解析多个空间要素文件
            setTimeout(() => {
                const mockParsed: ParsedFile[] = [
                    { 
                        id: 'f-1', name: '河南省主要河流水系', extension: '.shp', format: 'SHP', size: '4.2MB', 
                        status: 'success', targetDb: MOCK_DATABASES[0], targetTable: 'henan_river_main', isAutoCreate: true 
                    },
                    { 
                        id: 'f-2', name: '2024年武汉市建筑物轮廓', extension: '.geojson', format: 'JSON', size: '12.8MB', 
                        status: 'success', targetDb: MOCK_DATABASES[0], targetTable: 'wh_building_poly', isAutoCreate: true 
                    },
                    { 
                        id: 'f-3', name: '全省县级行政界线', extension: '.shp', size: '2.1MB', format: 'SHP', 
                        status: 'success', targetDb: MOCK_DATABASES[1], targetTable: 'admin_boundary_poly', isAutoCreate: false 
                    },
                    { 
                        id: 'f-4', name: '重点工程监测点位', extension: '.csv', size: '56KB', format: 'CSV', 
                        status: 'success', targetDb: MOCK_DATABASES[0], targetTable: 'project_monitor_pts', isAutoCreate: true 
                    },
                    { 
                        id: 'f-5', name: '长江大堤中线要素', extension: '.gpkg', size: '8.5MB', format: 'GPKG', 
                        status: 'success', targetDb: MOCK_DATABASES[2], targetTable: 'cj_dy_line', isAutoCreate: true 
                    }
                ];
                setParsedFiles(mockParsed);
                setIsParsing(false);
            }, 1500);
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedCloudFiles([]);
        setParsedFiles([]);
    };

    const updateFileInfo = (id: string, key: keyof ParsedFile, value: any) => {
        setParsedFiles(prev => prev.map(f => {
            if (f.id === id) {
                const updated = { ...f, [key]: value };
                if (key === 'targetTable') {
                    // 如果输入的表名不在已有列表中，则自动标记为需要创建
                    updated.isAutoCreate = !MOCK_EXISTING_TABLES.includes(value);
                }
                return updated;
            }
            return f;
        }));
    };

    return (
        <div className="flex-1 flex flex-col bg-[#f0f4f8] h-full overflow-hidden animate-fadeIn font-sans">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-slate-800 rounded-full"></div>
                    <h2 className="text-[17px] font-bold text-slate-800">创建离线数据集成开发任务</h2>
                </div>
                <button 
                    onClick={onBack}
                    className="flex items-center gap-1.5 px-5 py-1.5 bg-white border border-slate-200 text-blue-600 rounded-full text-[13px] font-medium hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                >
                    <Undo2 size={16} />
                    返回
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden px-8 pb-8 gap-10">
                
                {/* Left Stepper */}
                <div className="w-44 flex flex-col pt-32 items-end pr-6 flex-shrink-0">
                    <div className="flex flex-col items-center gap-0 relative">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center relative">
                                <div className="flex flex-col items-center group">
                                    <div className={`
                                        w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold transition-all z-10
                                        ${activeStep === step.id 
                                            ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-50' 
                                            : 'bg-white border-2 border-slate-200 text-slate-400'}
                                    `}>
                                        {step.id}
                                    </div>
                                    <div className={`
                                        mt-3 mb-16 text-[13px] font-bold transition-colors whitespace-nowrap text-center w-36 leading-tight
                                        ${activeStep === step.id ? 'text-blue-600' : 'text-slate-500'}
                                    `}>
                                        {step.label}
                                    </div>
                                    {activeStep === step.id && (
                                        <div className="absolute -right-[34px] top-2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-white/90"></div>
                                    )}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="absolute top-7 h-16 w-px border-l-2 border-dashed border-slate-300"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Form Card */}
                <div className="flex-1 bg-white rounded-[20px] shadow-sm border border-slate-100 overflow-y-auto custom-scrollbar p-12">
                    <div className="max-w-5xl mx-auto space-y-10">
                        
                        {/* Form Grid */}
                        <div className="grid grid-cols-2 gap-x-14 gap-y-7">
                            <FormItem label="任务名称" required>
                                <input 
                                    type="text" 
                                    defaultValue="上传离线任务-20251229152602"
                                    className="w-full h-10 px-4 bg-white border border-slate-200 rounded-lg text-[14px] text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                                />
                            </FormItem>

                            <FormItem label="任务类型" required>
                                <Select value="上传离线任务" />
                            </FormItem>

                            <FormItem label="数据分层" required>
                                <Select value="贴源层" />
                            </FormItem>

                            <FormItem label="数据类型" required>
                                <Select placeholder="请选择" />
                            </FormItem>

                            <FormItem label="数据主题" required>
                                <Select placeholder="请选择" />
                            </FormItem>

                            <FormItem label="选择数据标准模型" required>
                                <Select placeholder="请选择数据标准，可选，若无请前往数据治理平台创建" />
                            </FormItem>

                            <div className="col-span-2">
                                <FormItem label="数据标签" required>
                                    <Select placeholder="请选择或输入创建新标签（仅根节点）" />
                                </FormItem>
                            </div>

                            <div className="col-span-2">
                                <FormItem label="源数据选择" required>
                                    <div className="flex items-center gap-10 mt-3 pl-1">
                                        <Radio 
                                            label="云盘数据" 
                                            checked={sourceType === 'cloud'} 
                                            onChange={() => setSourceType('cloud')} 
                                        />
                                        <Radio 
                                            label="选择数据源" 
                                            checked={sourceType === 'datasource'} 
                                            onChange={() => setSourceType('datasource')} 
                                        />
                                    </div>
                                </FormItem>
                            </div>

                            {/* Upload Area */}
                            <div className="col-span-2">
                                <div 
                                    onClick={() => !selectedCloudFiles.length && setIsCloudModalOpen(true)}
                                    className={`
                                        mt-2 rounded-2xl h-44 flex flex-col items-center justify-center transition-all group relative
                                        ${selectedCloudFiles.length > 0 
                                            ? 'bg-blue-50/40 border border-blue-100' 
                                            : 'bg-blue-50/10 border-2 border-dashed border-blue-200 cursor-pointer hover:bg-blue-50/30 hover:border-blue-300'}
                                    `}
                                >
                                    {selectedCloudFiles.length > 0 ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="bg-white px-6 py-4 rounded-xl border border-blue-100 flex items-center gap-6 shadow-sm animate-in slide-in-from-bottom-2 duration-300">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-md shadow-blue-100">
                                                        <CloudUpload size={18} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[14px] font-bold text-slate-700">
                                                            {selectedCloudFiles.length === 1 ? selectedCloudFiles[0].name : `${selectedCloudFiles[0].name} 等 ${selectedCloudFiles.length} 个项目`}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-medium">源：云盘主目录</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={removeFile}
                                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                            {isParsing && (
                                                <div className="flex items-center gap-2 text-blue-500 font-bold text-xs animate-pulse">
                                                    <Loader2 size={14} className="animate-spin" />
                                                    正在智能提取要素元数据与坐标参考...
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 text-slate-500 group-hover:scale-105 transition-transform duration-300">
                                            <div className="bg-blue-500 text-white p-1.5 rounded-lg shadow-md">
                                                <CloudUpload size={18} />
                                            </div>
                                            <span className="text-[15px] font-bold">点击选择云盘文件夹或文件</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Spatial Mapping Table */}
                            {(isParsing || parsedFiles.length > 0) && (
                                <div className="col-span-2 mt-4 space-y-4 animate-slideUp">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <Settings2 size={18} className="text-blue-600" />
                                            <span className="text-[15px] font-bold text-slate-800">空间要素映射设置</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium bg-slate-50 px-2.5 py-1 rounded-full">
                                            <HelpCircle size={12} className="text-blue-500" />
                                            <span>输入不存在的物理表名将自动在数据库中创建</span>
                                        </div>
                                    </div>
                                    
                                    <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white ring-1 ring-slate-900/5">
                                        <table className="w-full text-left text-[13px] border-collapse min-w-[1000px]">
                                            <thead className="bg-[#f8fbfd] text-slate-500 font-bold border-b border-slate-100 uppercase tracking-tight">
                                                <tr>
                                                    <th className="p-4 pl-8">源文件名</th>
                                                    <th className="p-4">数据格式</th>
                                                    <th className="p-4">目标数据库</th>
                                                    <th className="p-4 w-72">目标表名称</th>
                                                    <th className="p-4 text-center pr-8">状态</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {parsedFiles.map((file) => (
                                                    <tr key={file.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="p-4 pl-8">
                                                            <div className="flex items-center gap-3">
                                                                <FileIcon format={file.format} />
                                                                <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{file.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase shadow-sm border ${getFormatStyle(file.format)}`}>
                                                                {file.format}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="relative">
                                                                <select 
                                                                    className="w-full h-9 bg-white border border-slate-200 rounded-lg px-3 outline-none text-[12px] font-medium appearance-none pr-8 focus:border-blue-400 transition-all shadow-sm"
                                                                    value={file.targetDb}
                                                                    onChange={(e) => updateFileInfo(file.id, 'targetDb', e.target.value)}
                                                                >
                                                                    {MOCK_DATABASES.map(db => <option key={db} value={db}>{db}</option>)}
                                                                </select>
                                                                <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <TableSelector 
                                                                value={file.targetTable}
                                                                isAutoCreate={file.isAutoCreate}
                                                                onChange={(val) => updateFileInfo(file.id, 'targetTable', val)}
                                                            />
                                                        </td>
                                                        <td className="p-4 text-center pr-8">
                                                            <div className="flex flex-col items-center">
                                                                <CheckCircle2 size={20} className="text-emerald-500 drop-shadow-sm" strokeWidth={2.5} />
                                                                <span className="text-[9px] text-emerald-600 font-black mt-1 uppercase tracking-wider">Ready</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {isParsing && (
                                                    <tr>
                                                        <td colSpan={5} className="p-20 text-center">
                                                            <div className="flex flex-col items-center gap-4">
                                                                <div className="relative">
                                                                    <Loader2 size={40} className="text-blue-500 animate-spin" />
                                                                    <Database size={16} className="absolute inset-0 m-auto text-blue-300" />
                                                                </div>
                                                                <span className="text-[12px] font-bold text-slate-400 tracking-widest animate-pulse">正在提取要素图层及坐标参考...</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex items-center gap-2 px-2 text-[11px] text-slate-400">
                                        <Info size={12} className="text-blue-500" />
                                        <span>系统已自动匹配同名物理表，如需更改请手动输入或在下拉列表中选择。</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className="mt-16 flex justify-end">
                            <button 
                                disabled={parsedFiles.length === 0}
                                className={`
                                    px-14 py-3 rounded-xl text-[14px] font-bold transition-all active:scale-95 shadow-xl
                                    ${parsedFiles.length > 0 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                                        : 'bg-white border border-blue-100 text-blue-300 cursor-not-allowed'}
                                `}
                            >
                                下一步：配置空间索引
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Cloud Modal */}
            {isCloudModalOpen && (
                <CloudDiskSelectionModal 
                    onClose={() => setIsCloudModalOpen(false)}
                    onConfirm={handleCloudConfirm}
                />
            )}
        </div>
    );
};

// --- Subcomponents ---

const FileIcon: React.FC<{ format: string }> = ({ format }) => {
    switch(format) {
        case 'JSON': return <FileJson size={18} className="text-indigo-500" />;
        case 'CSV': return <TableIcon size={18} className="text-emerald-500" />;
        default: return <FileCode size={18} className="text-blue-500" />;
    }
};

const getFormatStyle = (format: string) => {
    switch(format) {
        case 'SHP': return 'bg-amber-50 text-amber-600 border-amber-100';
        case 'JSON': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
        case 'CSV': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        case 'GPKG': return 'bg-blue-50 text-blue-600 border-blue-100';
        default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
}

/**
 * 智能表选择器组件
 */
const TableSelector: React.FC<{ 
    value: string; 
    isAutoCreate: boolean; 
    onChange: (val: string) => void;
}> = ({ value, isAutoCreate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = MOCK_EXISTING_TABLES.filter(t => t.toLowerCase().includes(value.toLowerCase()));

    return (
        <div className="relative group" ref={containerRef}>
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        value={value}
                        onFocus={() => setIsOpen(true)}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full h-9 px-3 pl-8 bg-white border rounded-lg text-[12px] font-medium outline-none transition-all shadow-sm ${isOpen ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200 group-hover:border-slate-300'}`}
                        placeholder="选择或输入物理表名"
                    />
                    <TableIcon size={12} className={`absolute left-2.5 top-3 transition-colors ${isOpen ? 'text-blue-500' : 'text-slate-400'}`} />
                    {/* 显示标记，如果是新表则显示 + 标识，无需按钮 */}
                    {isAutoCreate && (
                         <div className="absolute right-2.5 top-2.5 bg-blue-50 text-blue-600 p-0.5 rounded shadow-sm animate-in zoom-in-50 duration-200" title="该表将自动创建">
                            <Plus size={10} strokeWidth={4} />
                         </div>
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 max-h-56 overflow-y-auto custom-scrollbar">
                    <div className="p-2 border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center justify-between">
                        <span>候选物理表</span>
                        {value && !MOCK_EXISTING_TABLES.includes(value) && (
                            <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">NEW</span>
                        )}
                    </div>
                    {filtered.map(t => (
                        <div 
                            key={t}
                            onClick={() => { onChange(t); setIsOpen(false); }}
                            className="px-4 py-2 text-[12px] text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer flex items-center justify-between group/item transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-slate-300 group-hover/item:bg-blue-500"></div>
                                <span className="font-medium">{t}</span>
                            </div>
                            {value === t && <Check size={12} className="text-blue-600" />}
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="p-5 text-center">
                            <p className="text-[11px] text-slate-400 font-medium">未找到匹配项，直接回车将使用输入的新名称并 <b>自动建表</b>。</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const FormItem: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
    <div className="space-y-2.5">
        <label className="text-[14px] font-bold text-slate-700 block">
            {required && <span className="text-red-500 mr-1">*</span>}
            {label}
        </label>
        {children}
    </div>
);

const Select: React.FC<{ value?: string; placeholder?: string }> = ({ value, placeholder }) => (
    <div className="relative group">
        <div className={`
            w-full h-10 px-4 flex items-center justify-between bg-white border border-slate-200 rounded-lg cursor-pointer transition-all hover:border-slate-300
            ${!value ? 'text-slate-400 font-normal' : 'text-slate-700 font-bold'}
        `}>
            <span className="text-[14px] truncate">{value || placeholder}</span>
            <ChevronDown size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
    </div>
);

const Radio: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
    <div 
        onClick={onChange}
        className="flex items-center gap-3 cursor-pointer group"
    >
        <div className={`
            w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all
            ${checked ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-300 group-hover:border-slate-400'}
        `}>
            {checked && <div className="w-[8px] h-[8px] rounded-full bg-blue-600 animate-in zoom-in-50 duration-300"></div>}
        </div>
        <span className={`text-[14px] transition-colors ${checked ? 'text-blue-600 font-bold' : 'text-slate-600 font-medium'}`}>
            {label}
        </span>
    </div>
);
