import { Card, Tag, Timeline, Button } from 'antd';
import {
  GlobalOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import type { MediaFollowUp } from '@/types';
import { mediaLevelConfig } from '@/data/constants';
import { formatDateTime } from '@/utils';

interface MediaFollowUpProps {
  data: MediaFollowUp[];
}

const MediaFollowUps = ({ data }: MediaFollowUpProps) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.reportTime).getTime() - new Date(b.reportTime).getTime()
  );

  const levelStats = {
    national: data.filter((d) => d.mediaLevel === 'national').length,
    provincial: data.filter((d) => d.mediaLevel === 'provincial').length,
    local: data.filter((d) => d.mediaLevel === 'local').length,
    industry: data.filter((d) => d.mediaLevel === 'industry').length,
  };

  const getTimelineColor = (level: string) => {
    return mediaLevelConfig[level as keyof typeof mediaLevelConfig]?.color || '#1890ff';
  };

  return (
    <Card
      size="small"
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <GlobalOutlined style={{ color: '#722ed1' }} />
            <span>媒体跟进</span>
            <Tag color="purple" className="ml-2">
              {data.length}家
            </Tag>
          </div>
        </div>
      }
      className="h-full flex flex-col"
      styles={{ body: { flex: 1, padding: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' } }}
    >
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="text-center p-2 bg-red-500/10 rounded">
          <div className="text-lg font-bold text-red-500">{levelStats.national}</div>
          <div className="text-xs text-gray-400">国家级</div>
        </div>
        <div className="text-center p-2 bg-orange-500/10 rounded">
          <div className="text-lg font-bold text-orange-500">{levelStats.provincial}</div>
          <div className="text-xs text-gray-400">省级</div>
        </div>
        <div className="text-center p-2 bg-blue-500/10 rounded">
          <div className="text-lg font-bold text-blue-500">{levelStats.local}</div>
          <div className="text-xs text-gray-400">地方级</div>
        </div>
        <div className="text-center p-2 bg-purple-500/10 rounded">
          <div className="text-lg font-bold text-purple-500">{levelStats.industry}</div>
          <div className="text-xs text-gray-400">行业级</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <Timeline
          items={sortedData.map((item) => {
            const levelConfig = mediaLevelConfig[item.mediaLevel];
            return {
              color: getTimelineColor(item.mediaLevel),
              dot: <FileTextOutlined />,
              children: (
                <div className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag color={levelConfig.color} style={{ fontSize: 10, padding: '0 4px' }}>
                      {levelConfig.label}
                    </Tag>
                    <span className="text-xs text-gray-400">
                      {formatDateTime(item.reportTime, 'MM-DD HH:mm')}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-200 mb-1">{item.title}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <EnvironmentOutlined />
                    {item.mediaName}
                    <Button type="link" size="small" icon={<LinkOutlined />} className="h-auto p-0 ml-2">
                      查看原文
                    </Button>
                  </div>
                </div>
              ),
            };
          })}
        />
      </div>
    </Card>
  );
};

export default MediaFollowUps;
