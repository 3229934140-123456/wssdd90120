import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { Card, List, Tag, Avatar } from 'antd';
import { LineChartOutlined, LikeOutlined, MehOutlined, DislikeOutlined, UserOutlined } from '@ant-design/icons';
import type { SentimentDataPoint, CommentItem } from '@/types';
import { formatNumber, formatRelativeTime } from '@/utils';

interface SentimentAnalysisProps {
  data: SentimentDataPoint[];
  comments: CommentItem[];
  sentimentSummary: { positive: number; neutral: number; negative: number };
}

const SentimentAnalysis = ({ data, comments, sentimentSummary }: SentimentAnalysisProps) => {
  const chartOption: EChartsOption = useMemo(() => {
    const times = data.map((d) => d.time);
    const positiveData = data.map((d) => d.positive);
    const neutralData = data.map((d) => d.neutral);
    const negativeData = data.map((d) => d.negative);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(20, 28, 42, 0.95)',
        borderColor: '#2a3a50',
        borderWidth: 1,
        textStyle: { color: '#e0e7ff', fontSize: 12 },
      },
      legend: {
        data: ['正面', '中性', '负面'],
        textStyle: { color: '#a0aec0', fontSize: 11 },
        top: 0,
        right: 0,
      },
      grid: {
        left: 40,
        right: 20,
        top: 35,
        bottom: 20,
      },
      xAxis: {
        type: 'category',
        data: times,
        axisLine: { lineStyle: { color: '#2d3748' } },
        axisLabel: { color: '#718096', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        name: '占比 (%)',
        nameTextStyle: { color: '#718096', fontSize: 10 },
        axisLine: { show: false },
        axisLabel: { color: '#718096', fontSize: 10 },
        splitLine: { lineStyle: { color: '#2d3748', type: 'dashed' } },
      },
      series: [
        {
          name: '正面',
          type: 'line',
          stack: 'total',
          smooth: true,
          data: positiveData,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(82, 196, 26, 0.4)' },
                { offset: 1, color: 'rgba(82, 196, 26, 0.05)' },
              ],
            },
          },
          lineStyle: { color: '#52c41a', width: 2 },
          itemStyle: { color: '#52c41a' },
        },
        {
          name: '中性',
          type: 'line',
          stack: 'total',
          smooth: true,
          data: neutralData,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
              ],
            },
          },
          lineStyle: { color: '#1890ff', width: 2 },
          itemStyle: { color: '#1890ff' },
        },
        {
          name: '负面',
          type: 'line',
          stack: 'total',
          smooth: true,
          data: negativeData,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(245, 34, 45, 0.4)' },
                { offset: 1, color: 'rgba(245, 34, 45, 0.05)' },
              ],
            },
          },
          lineStyle: { color: '#f5222d', width: 2 },
          itemStyle: { color: '#f5222d' },
        },
      ],
    };
  }, [data]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <LikeOutlined style={{ color: '#52c41a' }} />;
      case 'negative':
        return <DislikeOutlined style={{ color: '#f5222d' }} />;
      default:
        return <MehOutlined style={{ color: '#faad14' }} />;
    }
  };

  const getSentimentTag = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return { color: 'green', text: '正面' };
      case 'negative':
        return { color: 'red', text: '负面' };
      default:
        return { color: 'default', text: '中性' };
    }
  };

  return (
    <Card
      size="small"
      title={
        <div className="flex items-center gap-2">
          <LineChartOutlined style={{ color: '#1890ff' }} />
          <span>情绪分析</span>
        </div>
      }
      className="h-full flex flex-col"
      styles={{ body: { flex: 1, padding: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' } }}
    >
      <div className="flex gap-4 mb-3">
        <div className="flex-1 text-center p-2 bg-green-500/10 rounded-lg">
          <div className="text-xl font-bold text-green-500">{sentimentSummary.positive}%</div>
          <div className="text-xs text-gray-400">正面占比</div>
        </div>
        <div className="flex-1 text-center p-2 bg-blue-500/10 rounded-lg">
          <div className="text-xl font-bold text-blue-500">{sentimentSummary.neutral}%</div>
          <div className="text-xs text-gray-400">中性占比</div>
        </div>
        <div className="flex-1 text-center p-2 bg-red-500/10 rounded-lg">
          <div className="text-xl font-bold text-red-500">{sentimentSummary.negative}%</div>
          <div className="text-xs text-gray-400">负面占比</div>
        </div>
      </div>

      <div className="flex-1 min-h-0 mb-3">
        <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} notMerge />
      </div>

      <div className="border-t border-gray-700 pt-2">
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <span>典型评论</span>
          <Tag color="blue">{comments.length}</Tag>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {comments.slice(0, 5).map((comment) => {
            const tagInfo = getSentimentTag(comment.sentiment);
            return (
              <div key={comment.id} className="p-2 bg-gray-800/50 rounded text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Avatar size={16} icon={<UserOutlined />} />
                  <span className="text-xs text-gray-300">{comment.userName}</span>
                  <Tag color={tagInfo.color} style={{ fontSize: 10, padding: '0 4px' }}>
                    {tagInfo.text}
                  </Tag>
                  <span className="text-xs text-gray-500 ml-auto">
                    {formatRelativeTime(comment.time)}
                  </span>
                </div>
                <div className="text-xs text-gray-400 pl-6">{comment.content}</div>
                <div className="text-xs text-gray-500 pl-6 mt-1 flex items-center gap-1">
                  {getSentimentIcon(comment.sentiment)}
                  <span>{comment.likes}赞</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default SentimentAnalysis;
