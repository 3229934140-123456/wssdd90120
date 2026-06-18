import { Card, Tag, Empty, Space, Button, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, BarChartOutlined, ClockCircleOutlined, GlobalOutlined } from '@ant-design/icons';
import { useWorkbenchStore } from '@/store/useWorkbenchStore';
import SpreadTimeline from '@/components/TopicAnalysis/SpreadTimeline';
import SentimentAnalysis from '@/components/TopicAnalysis/SentimentAnalysis';
import MediaFollowUps from '@/components/TopicAnalysis/MediaFollowUps';
import RiskAdjustment from '@/components/TopicAnalysis/RiskAdjustment';
import { getSpreadNodes, getMediaFollowUps } from '@/data/spreadPath';
import { getSentimentData, getComments } from '@/data/sentiment';
import { channels, riskLevelConfig } from '@/data/constants';
import { formatNumber, formatDateTime } from '@/utils';

const TopicAnalysisWindow = () => {
  const { selectedTopic, setActiveWindow, setSelectedTopicId } = useWorkbenchStore();

  if (!selectedTopic) {
    return (
      <div className="h-full flex items-center justify-center">
        <Empty description="请从风险地图选择一个话题" />
      </div>
    );
  }

  const spreadNodes = getSpreadNodes(selectedTopic.id);
  const mediaFollowUps = getMediaFollowUps(selectedTopic.id);
  const sentimentData = getSentimentData(selectedTopic.id);
  const comments = getComments(selectedTopic.id);

  const levelConfig = riskLevelConfig[selectedTopic.riskLevel];

  const handleBack = () => {
    setActiveWindow('map');
  };

  return (
    <div className="h-full flex flex-col p-3 gap-3">
      <Card size="small" styles={{ body: { padding: '8px 16px' } }}>
        <div className="flex items-center justify-between">
          <Space size="middle">
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack}>
              返回地图
            </Button>
            <Breadcrumb
              items={[
                { title: '风险地图', onClick: handleBack },
                { title: selectedTopic.title },
              ]}
            />
          </Space>
          <Space size="small">
            <Tag color={levelConfig.color} style={{ fontSize: 12, padding: '2px 10px' }}>
              {levelConfig.label}
            </Tag>
            {selectedTopic.manualRiskLevel && (
              <Tag color="blue" style={{ fontSize: 11 }}>
                已人工调整
              </Tag>
            )}
          </Space>
        </div>

        <div className="mt-3 flex items-center gap-6">
          <h2 className="text-lg font-bold m-0">{selectedTopic.title}</h2>
        </div>

        <div className="mt-3 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5 text-gray-400">
            <BarChartOutlined />
            <span>传播声量:</span>
            <span className="text-white font-medium">{formatNumber(selectedTopic.volume)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <ClockCircleOutlined />
            <span>首发时间:</span>
            <span className="text-white">{formatDateTime(selectedTopic.firstPostTime, 'MM-DD HH:mm')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <GlobalOutlined />
            <span>覆盖城市:</span>
            <span className="text-white">{selectedTopic.cities.length}个</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span>负面占比:</span>
            <span className="text-red-400 font-medium">{selectedTopic.sentiment.negative}%</span>
          </div>
          <div className="flex items-center gap-1">
            {selectedTopic.channels.map((ch) => {
              const chConfig = channels.find((c) => c.value === ch);
              return (
                <Tag
                  key={ch}
                  style={{
                    backgroundColor: `${chConfig?.color}20`,
                    color: chConfig?.color,
                    borderColor: `${chConfig?.color}40`,
                    fontSize: 11,
                    margin: 0,
                  }}
                >
                  {chConfig?.label}
                </Tag>
              );
            })}
          </div>
        </div>

        {selectedTopic.relatedStatements.length > 0 && (
          <div className="mt-3 p-2 bg-gray-800/50 rounded text-xs">
            <span className="text-gray-400 mr-2">相关说法:</span>
            {selectedTopic.relatedStatements.map((s, i) => (
              <span key={i} className="text-gray-300">
                {i > 0 && ' / '}
                {s}
              </span>
            ))}
          </div>
        )}
      </Card>

      <div className="flex-1 min-h-0 flex gap-3">
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div className="flex-1 min-h-0">
            <SpreadTimeline nodes={spreadNodes} />
          </div>
        </div>

        <div className="w-80 flex-shrink-0 flex flex-col gap-3">
          <div className="flex-1 min-h-0">
            <SentimentAnalysis
              data={sentimentData}
              comments={comments}
              sentimentSummary={selectedTopic.sentiment}
            />
          </div>
        </div>

        <div className="w-72 flex-shrink-0 flex flex-col gap-3">
          <div className="flex-1 min-h-0">
            <MediaFollowUps data={mediaFollowUps} />
          </div>
          <div className="h-auto" style={{ height: 360 }}>
            <RiskAdjustment topic={selectedTopic} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicAnalysisWindow;
