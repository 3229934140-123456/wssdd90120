import { Card, Tag, Space, Avatar, Tooltip } from 'antd';
import {
  UserOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  MessageOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import type { SpreadNode } from '@/types';
import { accountTypeConfig, channels } from '@/data/constants';
import { formatNumber, formatDateTime, truncateText } from '@/utils';

interface SpreadTimelineProps {
  nodes: SpreadNode[];
}

const SpreadTimeline = ({ nodes }: SpreadTimelineProps) => {
  const sortedNodes = [...nodes].sort(
    (a, b) => new Date(a.postTime).getTime() - new Date(b.postTime).getTime()
  );

  const firstNode = sortedNodes[0];
  const keyNodes = sortedNodes.filter((n) => n.isKeyNode);
  const maxFollowerNode = [...sortedNodes].sort((a, b) => b.followers - a.followers)[0];

  return (
    <Card
      size="small"
      title={
        <div className="flex items-center gap-2">
          <ThunderboltOutlined style={{ color: '#fa8c16' }} />
          <span>传播路径 · 时间轴</span>
          <Tag color="orange" className="ml-2">
            {sortedNodes.length}个节点
          </Tag>
        </div>
      }
      className="h-full flex flex-col"
      styles={{ body: { flex: 1, padding: 12, overflow: 'auto' } }}
    >
      {firstNode && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="text-xs text-green-400 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            首发节点
          </div>
          <div className="flex items-start gap-3">
            <Avatar size={40} icon={<UserOutlined />} className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{firstNode.accountName}</span>
                <Tag
                  color={accountTypeConfig[firstNode.accountType].color}
                  style={{ fontSize: 10, padding: '0 4px' }}
                >
                  {accountTypeConfig[firstNode.accountType].label}
                </Tag>
                <Tag
                  style={{
                    fontSize: 10,
                    padding: '0 4px',
                    backgroundColor: channels.find((c) => c.value === firstNode.platform)?.color + '20',
                    color: channels.find((c) => c.value === firstNode.platform)?.color,
                    borderColor: channels.find((c) => c.value === firstNode.platform)?.color + '40',
                  }}
                >
                  {channels.find((c) => c.value === firstNode.platform)?.label}
                </Tag>
              </div>
              <div className="text-xs text-gray-400 mb-1">
                {formatDateTime(firstNode.postTime, 'MM-DD HH:mm')}
              </div>
              <div className="text-sm text-gray-300 mb-2">
                {truncateText(firstNode.content, 80)}
              </div>
              <div className="flex gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <RetweetOutlined /> {formatNumber(firstNode.repostCount)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageOutlined /> {formatNumber(firstNode.commentCount)}
                </span>
                <span className="flex items-center gap-1">
                  <HeartOutlined /> {formatNumber(firstNode.likeCount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative pl-4">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-orange-500 to-red-500"></div>

        {sortedNodes.slice(1).map((node, index) => {
          const typeConfig = accountTypeConfig[node.accountType];
          const chConfig = channels.find((c) => c.value === node.platform);

          return (
            <div key={node.id} className="relative mb-3 last:mb-0">
              <div
                className={`absolute -left-1.5 top-3 w-3 h-3 rounded-full border-2 ${
                  node.isKeyNode
                    ? 'bg-red-500 border-red-300 shadow-lg shadow-red-500/50'
                    : 'bg-gray-600 border-gray-500'
                }`}
              ></div>

              <div
                className={`ml-3 p-2.5 rounded-lg border transition-all hover:border-blue-500/50 ${
                  node.isKeyNode
                    ? 'border-orange-500/40 bg-orange-500/5'
                    : 'border-gray-700 bg-gray-800/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400">
                    {formatDateTime(node.postTime, 'HH:mm')}
                  </span>
                  {node.isKeyNode && (
                    <Tag color="red" style={{ fontSize: 10, padding: '0 4px' }}>
                      关键节点
                    </Tag>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{node.accountName}</span>
                  <Tag color={typeConfig.color} style={{ fontSize: 10, padding: '0 4px' }}>
                    {typeConfig.label}
                  </Tag>
                  {chConfig && (
                    <Tag
                      style={{
                        fontSize: 10,
                        padding: '0 4px',
                        backgroundColor: chConfig.color + '20',
                        color: chConfig.color,
                        borderColor: chConfig.color + '40',
                      }}
                    >
                      {chConfig.label}
                    </Tag>
                  )}
                </div>

                <Tooltip title={node.content}>
                  <div className="text-xs text-gray-400 truncate mb-1">
                    {truncateText(node.content, 50)}
                  </div>
                </Tooltip>

                <div className="flex gap-3 text-xs text-gray-500">
                  <span>转发 {formatNumber(node.repostCount)}</span>
                  <span>评论 {formatNumber(node.commentCount)}</span>
                  <span>点赞 {formatNumber(node.likeCount)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {maxFollowerNode && (
        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <div className="text-xs text-purple-400 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            最大粉丝量节点 · {formatNumber(maxFollowerNode.followers)}粉丝
          </div>
          <div className="font-medium text-sm">{maxFollowerNode.accountName}</div>
        </div>
      )}
    </Card>
  );
};

export default SpreadTimeline;
