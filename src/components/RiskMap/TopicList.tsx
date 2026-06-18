import { useState, useMemo } from 'react';
import { Card, Tag, Button, Checkbox, Input, message, Modal } from 'antd';
import {
  MergeOutlined,
  BarChartOutlined,
  SearchOutlined,
  EyeOutlined,
  WarningOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import type { TopicPackage } from '@/types';
import { useWorkbenchStore } from '@/store/useWorkbenchStore';
import { channels, riskLevelConfig } from '@/data/constants';
import { formatNumber, formatRelativeTime, truncateText } from '@/utils';

const { Search } = Input;

const TopicList = () => {
  const {
    topics,
    filterCriteria,
    selectedTopicId,
    setSelectedTopicId,
    openWindow,
    setActiveWindow,
    mergeTopics,
  } = useWorkbenchStore();

  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mergeModalVisible, setMergeModalVisible] = useState(false);
  const [mergeTitle, setMergeTitle] = useState('');

  const filteredTopics = useMemo(() => {
    let result = [...topics];

    if (searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          t.relatedStatements.some((s) => s.toLowerCase().includes(lower))
      );
    }

    if (filterCriteria.riskLevels.length > 0) {
      result = result.filter((t) => filterCriteria.riskLevels.includes(t.riskLevel));
    }

    if (filterCriteria.enterprises.length > 0) {
      result = result.filter((t) =>
        t.enterprises.some((e) => filterCriteria.enterprises.includes(e))
      );
    }

    if (filterCriteria.channels.length > 0) {
      result = result.filter((t) =>
        t.channels.some((c) => filterCriteria.channels.includes(c))
      );
    }

    return result.sort((a, b) => b.volume - a.volume);
  }, [topics, searchText, filterCriteria]);

  const handleSelectTopic = (topic: TopicPackage) => {
    setSelectedTopicId(topic.id);
    openWindow('topic');
    setActiveWindow('topic');
  };

  const handleSelectForMerge = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  const handleMerge = () => {
    if (selectedIds.length < 2) {
      message.warning('请至少选择2个话题进行合并');
      return;
    }
    const selectedTopics = topics.filter((t) => selectedIds.includes(t.id));
    setMergeTitle(selectedTopics[0]?.title || '合并话题');
    setMergeModalVisible(true);
  };

  const confirmMerge = () => {
    if (!mergeTitle.trim()) {
      message.warning('请输入合并后的话题标题');
      return;
    }
    mergeTopics(selectedIds, mergeTitle);
    setSelectedIds([]);
    setMergeModalVisible(false);
    setMergeTitle('');
    message.success('话题合并成功');
  };

  const getTrendIcon = (topic: TopicPackage) => {
    const negRatio = topic.sentiment.negative;
    if (negRatio > 60) return <RiseOutlined style={{ color: '#f5222d' }} />;
    if (negRatio < 30) return <FallOutlined style={{ color: '#52c41a' }} />;
    return <BarChartOutlined style={{ color: '#fa8c16' }} />;
  };

  return (
    <Card
      size="small"
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <BarChartOutlined style={{ color: '#722ed1' }} />
            <span>话题列表</span>
            <Tag color="blue" className="ml-2">
              {filteredTopics.length}
            </Tag>
          </div>
          {selectedIds.length > 0 && (
            <Button
              type="primary"
              size="small"
              icon={<MergeOutlined />}
              onClick={handleMerge}
            >
              合并 ({selectedIds.length})
            </Button>
          )}
        </div>
      }
      className="h-full flex flex-col"
      styles={{ body: { flex: 1, padding: 0, overflow: 'hidden' } }}
    >
      <div className="p-3 border-b border-gray-700">
        <Search
          placeholder="搜索话题关键词"
          size="small"
          prefix={<SearchOutlined />}
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredTopics.map((topic) => {
          const levelConfig = riskLevelConfig[topic.riskLevel];
          const isSelected = selectedTopicId === topic.id;
          const isChecked = selectedIds.includes(topic.id);

          return (
            <div
              key={topic.id}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
              }`}
              onClick={() => handleSelectTopic(topic)}
            >
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={isChecked}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleSelectForMerge(topic.id, e.target.checked)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getTrendIcon(topic)}
                    <span className="font-medium text-sm truncate flex-1">
                      {topic.title}
                    </span>
                    <Tag
                      color={levelConfig.color}
                      style={{
                        backgroundColor: levelConfig.bgColor,
                        borderColor: levelConfig.color,
                        fontSize: 11,
                        padding: '0 6px',
                      }}
                    >
                      {levelConfig.label}
                    </Tag>
                  </div>

                  <div className="text-xs text-gray-400 mb-2 flex items-center gap-3">
                    <span>声量: {formatNumber(topic.volume)}</span>
                    <span>负面: {topic.sentiment.negative}%</span>
                    <span>{formatRelativeTime(topic.firstPostTime)}</span>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    {topic.channels.slice(0, 4).map((ch) => {
                      const chConfig = channels.find((c) => c.value === ch);
                      return (
                        <Tag
                          key={ch}
                          className="m-0 text-xs"
                          style={{
                            backgroundColor: `${chConfig?.color}20`,
                            color: chConfig?.color,
                            borderColor: `${chConfig?.color}40`,
                            fontSize: 10,
                            padding: '0 5px',
                          }}
                        >
                          {chConfig?.label}
                        </Tag>
                      );
                    })}
                    {topic.channels.length > 4 && (
                      <span className="text-xs text-gray-500">+{topic.channels.length - 4}</span>
                    )}
                  </div>

                  {topic.relatedStatements.length > 0 && (
                    <div className="text-xs text-gray-500 flex items-start gap-1">
                      <WarningOutlined className="mt-0.5 text-yellow-500" />
                      <span className="truncate">
                        相关说法: {truncateText(topic.relatedStatements[0], 30)}
                        {topic.relatedStatements.length > 1 &&
                          ` 等${topic.relatedStatements.length}种说法`}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTopic(topic);
                  }}
                />
              </div>
            </div>
          );
        })}

        {filteredTopics.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <SearchOutlined style={{ fontSize: 32, opacity: 0.3 }} />
            <div className="mt-2 text-sm">暂无匹配的话题</div>
          </div>
        )}
      </div>

      <Modal
        title="合并话题"
        open={mergeModalVisible}
        onOk={confirmMerge}
        onCancel={() => setMergeModalVisible(false)}
        okText="确认合并"
        cancelText="取消"
      >
        <p className="text-gray-400 mb-3 text-sm">
          将 {selectedIds.length} 个话题合并为一个话题包，便于统一研判
        </p>
        <div className="mb-3">
          <label className="text-sm text-gray-300 block mb-1">合并后话题标题</label>
          <Input
            value={mergeTitle}
            onChange={(e) => setMergeTitle(e.target.value)}
            placeholder="请输入合并后的话题标题"
          />
        </div>
        <div className="text-xs text-gray-500 bg-gray-800 p-2 rounded">
          提示：合并后话题的风险等级取最高等级，声量累加，渠道和城市取并集。
        </div>
      </Modal>
    </Card>
  );
};

export default TopicList;
