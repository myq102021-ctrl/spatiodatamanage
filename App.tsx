
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DataThemePanel } from './components/DataThemePanel';
import { DataTablePanel } from './components/DataTablePanel';
import { DataDetailPanel } from './components/DataDetailPanel';
import { DataSmartMapPanel } from './components/DataSmartMapPanel';
import { ProductionLinePanel } from './components/ProductionLinePanel';
import { SpatialDataIngestionPanel } from './components/SpatialDataIngestionPanel';
import { CreateIngestionTaskPanel } from './components/CreateIngestionTaskPanel';
import { DataStatsPanel } from './components/DataStatsPanel';
import { ServiceDevelopmentPanel, DirectoryNode } from './components/ServiceDevelopmentPanel';
import { ServiceMarketPanel } from './components/ServiceMarketPanel';
import { PersonalConsolePanel } from './components/PersonalConsolePanel';
import { MyApplicationsPanel } from './components/MyApplicationsPanel';
import { AuditApplicationPanel } from './components/AuditApplicationPanel';
import { MOCK_API_DATA, APIRow } from './constants';
import { ApplicationRecord } from './types';

const INITIAL_DIRECTORIES: DirectoryNode[] = [
  {
    id: 'ogc',
    label: 'OGC 标准服务',
    children: [
      { id: 'wms', label: 'WMS 地图服务' },
      { id: 'wfs', label: 'WFS 要素服务' },
      { id: 'wmts', label: 'WMTS 切片服务' },
      { id: 'tms', label: 'TMS 瓦片服务' },
      { id: 'wcs', label: 'WCS 覆盖服务' },
    ]
  },
  {
    id: 'rest',
    label: 'RESTful 业务服务',
    children: [
      { id: 'rest_query', label: '多维查询服务' },
      { id: 'rest_download', label: '数据下载服务' },
      { id: 'rest_stat', label: '统计分析服务' },
      { id: 'rest_meta', label: '元数据接口' },
    ]
  },
  {
    id: 'analysis',
    label: '时空分析工具',
    children: [
      { id: 'buffer', label: '缓冲区分析' },
      { id: 'overlay', label: '叠加分析' },
      { id: 'topology', label: '拓扑检查服务' },
      { id: 'inter', label: '空间插值分析' },
    ]
  },
  {
    id: 'industry',
    label: '行业专题服务',
    children: [
      { id: 'env', label: '生态环境监测' },
      { id: 'traffic', label: '智慧交通感知' },
      { id: 'urban', label: '城市规划管理' },
      { id: 'emergency', label: '应急指挥调度' },
    ]
  },
  { 
    id: 'cloud', 
    label: '云原生服务',
    children: [
      { id: 'cog', label: 'COG 云原生栅格' },
      { id: 'mvt', label: 'MVT 矢量瓦片' },
      { id: 'flatgeobuf', label: 'FlatGeobuf 序列化' },
    ]
  },
  { id: 'iot', label: '实时物联网服务' },
  { id: 'internal', label: '系统支撑内部服务' }
];

const INITIAL_APPLICATIONS: ApplicationRecord[] = [
    { 
        id: 'APP-20260130-005', 
        serviceId: '11', 
        serviceName: '用户消费行为分析', 
        category: '业务数据服务', 
        type: '分析服务', 
        duration: '1个月', 
        status: 'approved', 
        applyTime: '2026-01-30 10:20:15',
        protocols: ['RESTful'],
        applicant: '系统管理员',
        source: '服务集市',
        auditOpinion: '该申请符合内部数据调用合规要求，准予通过，授权访问有效期30天。',
        appKey: 'ak_z9y8x7w6v5u4t3s2',
        appSecret: 'sk_m9n8b7v6c5x4z3a2s1d0f9g8h7j6k5l4'
    },
    { 
        id: 'APP-20260126-001', 
        serviceId: '1', 
        serviceName: 'LC09_L2SP_123039_20230313_202303...', 
        category: '时空数据服务', 
        type: 'WMTS', 
        duration: '永久', 
        status: 'pending', 
        applyTime: '2026-01-26 17:55:22',
        protocols: ['WMTS'],
        applicant: '光谷信息',
        source: '服务集市'
    },
    { 
        id: 'APP-20260122-002', 
        serviceId: '2', 
        serviceName: 'LC09_L2SP_124038_20250917_202509...', 
        category: '时空数据服务', 
        type: 'WMS', 
        duration: '1个月', 
        status: 'approved', 
        applyTime: '2026-01-22 11:54:44',
        protocols: ['WMS'],
        applicant: '光谷信息',
        source: '服务集市',
        auditOpinion: '符合申请要求，予以通过。',
        appKey: 'ak_7f8d9e2a1b3c4d5e',
        appSecret: 'sk_1a2b3c4d5e6f7g8h9i0j1k2l'
    },
    { 
        id: 'APP-20260114-003', 
        serviceId: '3', 
        serviceName: '湖北省基础地理要素集 V2', 
        category: '基础地理', 
        type: 'WFS', 
        duration: '永久', 
        status: 'approved', 
        applyTime: '2026-01-14 11:46:37',
        protocols: ['WFS'],
        applicant: '光谷信息',
        source: '数据集市',
        auditOpinion: '同意申请。',
        appKey: 'ak_9a8b7c6d5e4f3g2h',
        appSecret: 'sk_z1y2x3w4v5u6t7s8r9q0p1o2'
    },
    { 
        id: 'APP-20260107-004', 
        serviceId: '7', 
        serviceName: 'xns_0.6_srs_ok_cog', 
        category: '时空数据服务', 
        type: 'COG', 
        duration: '7天', 
        status: 'approved', 
        applyTime: '2026-01-07 09:30:51',
        protocols: ['COG'],
        applicant: '光谷信息',
        source: '服务集市',
        auditOpinion: '测试用途，批准短期访问。',
        appKey: 'ak_m1n2o3p4q5r6s7t8',
        appSecret: 'sk_a1b2c3d4e5f6g7h8i9j0k1l2'
    }
];

function App() {
  const [activeMenuId, setActiveMenuId] = useState<string>('service_market'); 
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  
  // 全局服务数据状态
  const [services, setServices] = useState<APIRow[]>(MOCK_API_DATA);
  // 全局服务目录状态
  const [directories, setDirectories] = useState<DirectoryNode[]>(INITIAL_DIRECTORIES);
  // 全局申请记录状态
  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS);

  // Sub-view for ingestion module (list or create task)
  const [ingestionSubView, setIngestionSubView] = useState<'list' | 'create'>('list');

  const handleMenuSelect = (id: string) => {
    setActiveMenuId(id);
    if (id === 'spatial_ingestion') {
        setIngestionSubView('list');
    }
    // 切换菜单时重置详情视图
    if (viewMode === 'detail') {
      setViewMode('list');
    }
  };

  const handleApplySuccess = (newRecord: ApplicationRecord) => {
      setApplications(prev => [newRecord, ...prev]);
  };

  const handleAuditAction = (id: string, newStatus: 'approved' | 'rejected', opinion?: string) => {
      setApplications(prev => prev.map(app => {
          if (app.id === id) {
              const updates: any = { status: newStatus, auditOpinion: opinion };
              // 如果通过审核，自动生成 AppKey 和 AppSecret
              if (newStatus === 'approved') {
                  updates.appKey = 'ak_' + Math.random().toString(36).substring(2, 18);
                  updates.appSecret = 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
              }
              return { ...app, ...updates };
          }
          return app;
      }));
  };

  const menuLabels: Record<string, string> = {
      my_applications: '我的申请',
      my_favorites: '我的收藏',
      personal_console: '个人中心',
      audit_application: '数据申请审核',
      audit_listing: '数据上架审核'
  };

  return (
    <div className="flex h-screen w-full bg-[#f3f6f9] relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-b from-[#bcd4ff] to-[#97b7f8] z-0" />
      <div className="relative z-10 flex w-full h-full">
          <Sidebar activeMenuId={activeMenuId} onMenuSelect={handleMenuSelect} />
          <div className="flex-1 flex flex-col my-3 mr-3 ml-0 bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-1.5 overflow-hidden transition-all duration-500 ease-out">
            <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm relative ring-1 ring-slate-900/5">
                {activeMenuId === 'data_list' ? (
                   <>
                       {viewMode === 'list' ? (
                         <div className="flex-1 overflow-hidden relative animate-fadeIn flex">
                             <DataThemePanel />
                             <div className="w-px bg-slate-100 my-2" />
                             <DataTablePanel onViewDetail={() => setViewMode('detail')} />
                         </div>
                       ) : (
                         <DataDetailPanel onBack={() => setViewMode('list')} />
                       )}
                   </>
                ) : activeMenuId === 'stats' ? (
                    <DataStatsPanel />
                ) : activeMenuId === 'spatial_ingestion' ? (
                    ingestionSubView === 'list' ? (
                        <SpatialDataIngestionPanel onCreateTask={() => setIngestionSubView('create')} />
                    ) : (
                        <CreateIngestionTaskPanel onBack={() => setIngestionSubView('list')} />
                    )
                ) : activeMenuId === 'production_line' ? (
                    <ProductionLinePanel />
                ) : activeMenuId === 'smart_map' ? (
                    <DataSmartMapPanel />
                ) : activeMenuId === 'service_dev' ? (
                    <ServiceDevelopmentPanel 
                        apiData={services} 
                        setApiData={setServices} 
                        directories={directories}
                        setDirectories={setDirectories}
                    />
                ) : activeMenuId === 'service_market' ? (
                    <ServiceMarketPanel 
                        apiData={services}
                        directories={directories}
                        onApplySuccess={handleApplySuccess}
                    />
                ) : activeMenuId === 'personal_console' ? (
                    <PersonalConsolePanel />
                ) : activeMenuId === 'my_applications' ? (
                    <MyApplicationsPanel 
                        records={applications} 
                        apiData={services}
                    />
                ) : activeMenuId === 'audit_application' ? (
                    <AuditApplicationPanel 
                        records={applications} 
                        onAudit={handleAuditAction}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="p-6 bg-slate-50 rounded-3xl mb-4 border border-slate-100 shadow-inner">
                            <span className="text-5xl grayscale opacity-50">📂</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-1">功能开发中</h3>
                        <p className="text-slate-400 text-sm font-medium">"{menuLabels[activeMenuId] || activeMenuId}" 模块正在全力打造中...</p>
                    </div>
                )}
            </div>
          </div>
      </div>
    </div>
  );
}

export default App;
