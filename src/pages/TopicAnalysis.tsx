import { Card, Tag, Empty, Space, Button, Breadcrumb, Collapse, Badge } from 'antd';
import { ArrowLeftOutlined, BarChartOutlined, ClockCircleOutlined, GlobalOutlined, MergeCellsOutlined } from '@ant-design/icons';
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
  const { selectedTopic, setActiveWindow } = useWorkbenchStore();

  if (!selectedTopic) {
    return (
      <div className="h-full flex items-center justify-center">
        <Empty description="请从风险地图选择一个话题" />
      </div>
    );
  }

  const spreadNodes = getSpreadNodes(selectedTopic);
  const mediaFollowUps = getMediaFollowUps(selectedTopic);
  const sentimentData = getSentimentData(selectedTopic);
  const comments = getComments(selectedTopic);

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
            {selectedTopic.mergedFrom && selectedTopic.mergedFrom.length > 0 && (
              <Tag color="purple" style={{ fontSize: 11 }}>
                <MergeCellsOutlined /> 合并话题包
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

        {selectedTopic.mergedFrom && selectedTopic.mergedFrom.length > 0 && (
          <div className="mt-2">
            <Collapse
              size="small"
              items={[{
              key: 'merged',
              label: (
                <div className="flex items-center gap-2">
                  <MergeCellsOutlined style={{ color: '#722ed1' }} />
                  <span className="text-sm">合并来源</span>
                  <Badge count={selectedTopic.mergedFrom.length} style={{ backgroundColor: '#722ed1' }} />
                </div>
              ),
              children: (
                <div className="space-y-2">
                  {selectedTopic.mergedFrom.map((src, idx) => {
                    const srcLevelConfig = riskLevelConfig[src.riskLevel];
                    return (
                      <div key={src.id} className="p-2 bg-gray-800/50 rounded border border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500">#{idx + 1}</span>
                          <span className="font-medium text-sm flex-1">{src.title}</span>
                          <Tag color={srcLevelConfig.color} style={{ fontSize: 10, padding: '0 4px' }}>
                            {srcLevelConfig.label}
                          </Tag>
                        </div>
                        <div className="text-xs text-gray-400 flex gap-3">
                          <span>声量: {formatNumber(src.volume)}</span>
                          <span>城市: {src.cities.join('、')}</span>
                          <span>渠道: {src.channels.map((c) => channels.find((ch) => ch.value === c)?.label).join('、')}</span>
                        </div>
                        {src.relatedStatements.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            说法: {src.relatedStatements.slice(0, 2).join('；')}
                            {src.relatedStatements.length > 2 && ` 等${src.relatedStatements.length}种`}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ),
            }]}
            />
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
