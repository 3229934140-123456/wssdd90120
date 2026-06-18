import { useState } from 'react';
import { Card, Radio, Input, Tag, Button, message, Space, Slider } from 'antd';
import {
  SafetyCertificateOutlined,
  AlertOutlined,
  WarningOutlined,
  SaveOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { RiskLevel, TopicPackage } from '@/types';
import { riskLevelConfig } from '@/data/constants';
import { useWorkbenchStore } from '@/store/useWorkbenchStore';

const { TextArea } = Input;
const { Group: RadioGroup, Button: RadioButton } = Radio;

interface RiskAdjustmentProps {
  topic: TopicPackage;
}

const riskTags = [
  '产品安全',
  '品牌声誉',
  '消费者权益',
  '财务风险',
  '合规风险',
  '数据安全',
  '人力资源',
  '供应链',
  '监管风险',
  '行业影响',
  '客户信任',
  '投资风险',
];

const RiskAdjustment = ({ topic }: RiskAdjustmentProps) => {
  const { updateTopicRiskLevel, generateReport, openWindow, setActiveWindow, setSelectedReportId, currentReport } =
    useWorkbenchStore();

  const [riskLevel, setRiskLevel] = useState<RiskLevel>(topic.riskLevel);
  const [judgmentBasis, setJudgmentBasis] = useState(topic.judgmentBasis || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(topic.riskTags || []);
  const [severityScore, setSeverityScore] = useState(
    topic.riskLevel === 'high' ? 85 : topic.riskLevel === 'medium' ? 55 : 25
  );

  const handleLevelChange = (level: RiskLevel) => {
    setRiskLevel(level);
    if (level === 'high') setSeverityScore(85);
    else if (level === 'medium') setSeverityScore(55);
    else setSeverityScore(25);
  };

  const handleSave = () => {
    updateTopicRiskLevel(topic.id, riskLevel, judgmentBasis);
    message.success('风险等级调整已保存');
  };

  const handleGenerateReport = (type: 'daily' | 'special' | 'event') => {
    generateReport(topic.id, type);
    openWindow('report');
    setActiveWindow('report');
    message.success('研判提纲已生成');
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const levelConfig = riskLevelConfig[riskLevel];

  return (
    <Card
      size="small"
      title={
        <div className="flex items-center gap-2">
          <SafetyCertificateOutlined style={{ color: '#fa8c16' }} />
          <span>风险研判</span>
        </div>
      }
      className="h-full flex flex-col"
      styles={{ body: { flex: 1, padding: 12, overflow: 'auto' } }}
    >
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2">系统评估风险等级</div>
        <Tag color={riskLevelConfig[topic.riskLevel].color} style={{ fontSize: 12, padding: '2px 10px' }}>
          {riskLevelConfig[topic.riskLevel].label}
        </Tag>
        {topic.manualRiskLevel && (
          <Tag color="blue" style={{ fontSize: 11, marginLeft: 8 }}>
            已人工调整
          </Tag>
        )}
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2">人工调整风险等级</div>
        <RadioGroup value={riskLevel} onChange={(e) => handleLevelChange(e.target.value)}>
          <RadioButton value="high" style={{ color: riskLevel === 'high' ? '#fff' : '#f5222d', borderColor: '#f5222d' }}>
            <AlertOutlined /> 高风险
          </RadioButton>
          <RadioButton value="medium" style={{ color: riskLevel === 'medium' ? '#fff' : '#fa8c16', borderColor: '#fa8c16' }}>
            <WarningOutlined /> 中风险
          </RadioButton>
          <RadioButton value="low" style={{ color: riskLevel === 'low' ? '#fff' : '#52c41a', borderColor: '#52c41a' }}>
            <SafetyCertificateOutlined /> 低风险
          </RadioButton>
        </RadioGroup>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2">风险严重度评分</div>
        <Slider
          min={0}
          max={100}
          value={severityScore}
          onChange={(val) => {
            setSeverityScore(val);
            if (val >= 70) setRiskLevel('high');
            else if (val >= 40) setRiskLevel('medium');
            else setRiskLevel('low');
          }}
          tooltip={{ formatter: (value) => `${value}分` }}
          styles={{
            track: { background: levelConfig.color },
            rail: { background: '#2d3748' },
          }}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0 低风险</span>
          <span>40 中风险</span>
          <span>70 高风险</span>
          <span>100</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2">风险标签</div>
        <div className="flex flex-wrap gap-1">
          {riskTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <Tag
                key={tag}
                color={isSelected ? 'blue' : 'default'}
                onClick={() => toggleTag(tag)}
                className="cursor-pointer text-xs"
                style={{
                  opacity: isSelected ? 1 : 0.6,
                }}
              >
                {tag}
              </Tag>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2">研判依据</div>
        <TextArea
          rows={4}
          placeholder="请输入人工调整风险等级的研判依据..."
          value={judgmentBasis}
          onChange={(e) => setJudgmentBasis(e.target.value)}
          style={{ backgroundColor: '#1a2332', borderColor: '#2d3748', color: '#e0e7ff' }}
        />
        <div className="text-xs text-gray-500 mt-1">
          提示：研判依据将作为报告中的重要参考，请确保可核验、可复盘。
        </div>
      </div>

      <Button
        type="primary"
        icon={<SaveOutlined />}
        onClick={handleSave}
        block
        className="mb-3"
      >
        保存调整
      </Button>

      <div className="border-t border-gray-700 pt-3">
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <FileTextOutlined />
          生成研判报告
        </div>
        <Space className="w-full">
          <Button size="small" onClick={() => handleGenerateReport('daily')}>
            日报
          </Button>
          <Button size="small" onClick={() => handleGenerateReport('special')}>
            专报
          </Button>
          <Button size="small" type="primary" onClick={() => handleGenerateReport('event')}>
            突发事件跟踪
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default RiskAdjustment;
