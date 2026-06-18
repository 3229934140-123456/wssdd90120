import { ConfigProvider, theme as antdTheme } from 'antd';
import AppLayout from '@/components/layout/AppLayout';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: antdTheme.darkAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          colorBgBase: '#0f1419',
          colorBgContainer: '#1a2332',
          colorBgElevated: '#1f2a3c',
          colorBorder: '#2a3a50',
          colorText: '#e0e7ff',
          colorTextSecondary: '#a0aec0',
          colorTextTertiary: '#718096',
          borderRadius: 6,
          fontSize: 13,
          fontFamily: '"Source Han Sans CN", -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
        },
        components: {
          Card: {
            colorBgContainer: '#1a2332',
            colorBorderSecondary: '#2a3a50',
            colorTextHeading: '#e0e7ff',
          },
          Modal: {
            colorBgElevated: '#1a2332',
          },
          Input: {
            colorBgContainer: '#141b26',
            colorBorder: '#2a3a50',
          },
          Select: {
            colorBgContainer: '#141b26',
            colorBorder: '#2a3a50',
            colorBgElevated: '#1f2a3c',
          },
          Button: {
            colorBgContainer: '#1f2a3c',
          },
          Tabs: {
            colorBorderSecondary: '#2a3a50',
          },
        },
      }}
    >
      <AppLayout />
    </ConfigProvider>
  );
}
