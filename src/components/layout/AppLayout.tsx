import { Layout, Tabs, Badge, Avatar, Dropdown, Space, Button } from 'antd';
import {
  GlobalOutlined,
  LineChartOutlined,
  FileTextOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useWorkbenchStore } from '@/store/useWorkbenchStore';
import RiskMapWindow from '@/pages/RiskMap';
import TopicAnalysisWindow from '@/pages/TopicAnalysis';
import ReportDraftWindow from '@/pages/ReportDraft';
import type { WindowType } from '@/types';

const { Header, Content } = Layout;

const AppLayout = () => {
  const { activeWindow, openWindows, setActiveWindow, closeWindow, openWindow, reports } = useWorkbenchStore();
  const [collapsed, setCollapsed] = useState(false);

  const windowConfigs: Record<WindowType, { label: string; icon: React.ReactNode; badge?: number }> = {
    map: {
      label: '风险地图',
      icon: <GlobalOutlined />,
    },
    topic: {
      label: '话题拆解',
      icon: <LineChartOutlined />,
    },
    report: {
      label: '报告草稿',
      icon: <FileTextOutlined />,
      badge: reports.length,
    },
  };

  const tabItems = openWindows.map((win) => ({
    key: win,
    label: (
      <div className="flex items-center gap-2">
        {windowConfigs[win].icon}
        <span>{windowConfigs[win].label}</span>
        {windowConfigs[win].badge !== undefined && windowConfigs[win].badge > 0 && (
          <Badge count={windowConfigs[win].badge} size="small" />
        )}
      </div>
    ),
    closable: win !== 'map',
  }));

  const handleTabClick = (key: string) => {
    setActiveWindow(key as WindowType);
  };

  const handleTabClose = (key: string) => {
    closeWindow(key as WindowType);
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <Layout className="h-screen bg-[#0f1419] text-gray-200">
      <Header
        style={{
          background: 'linear-gradient(180deg, #1a2332 0%, #141b26 100%)',
          borderBottom: '1px solid #2a3a50',
          padding: '0 16px',
          height: 56,
          lineHeight: '56px',
        }}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-white"
            />
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                  boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                }}
              >
                <GlobalOutlined style={{ color: '#fff', fontSize: 16 }} />
              </div>
              <div>
                <div className="text-base font-bold text-white leading-tight">舆情研判工作台</div>
                <div className="text-xs text-gray-500 leading-tight">Public Opinion Analysis Workbench</div>
              </div>
            </div>

            <div className="ml-8 flex gap-2">
              {(['map', 'topic', 'report'] as WindowType[]).map((win) => {
                const config = windowConfigs[win];
                const isOpen = openWindows.includes(win);
                const isActive = activeWindow === win;

                return (
                  <Button
                    key={win}
                    type={isActive ? 'primary' : 'text'}
                    icon={config.icon}
                    onClick={() => {
                      if (!isOpen) openWindow(win);
                      setActiveWindow(win);
                    }}
                    className="h-8 px-3"
                  >
                    {config.label}
                    {config.badge !== undefined && config.badge > 0 && (
                      <Badge count={config.badge} size="small" className="ml-1" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              实时监测中
            </div>

            <Badge count={3} size="small">
              <Button type="text" icon={<BellOutlined />} className="text-gray-400 hover:text-white" />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="cursor-pointer hover:bg-white/5 px-2 py-1 rounded">
                <Avatar size={28} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <div className="text-sm">
                  <div className="text-white leading-tight">分析师</div>
                  <div className="text-xs text-gray-500 leading-tight">舆情分析部</div>
                </div>
              </Space>
            </Dropdown>
          </div>
        </div>
      </Header>

      <Content className="overflow-hidden">
        <div className="h-full">
          {activeWindow === 'map' && <RiskMapWindow />}
          {activeWindow === 'topic' && <TopicAnalysisWindow />}
          {activeWindow === 'report' && <ReportDraftWindow />}
        </div>
      </Content>
    </Layout>
  );
};

export default AppLayout;
