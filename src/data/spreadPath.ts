import type { SpreadNode, SpreadEdge, MediaFollowUp, TopicPackage } from '@/types';
import dayjs from 'dayjs';

export const mockSpreadNodes: Record<string, SpreadNode[]> = {
  'topic-001': [
    {
      id: 'node-001',
      accountName: '汽车爆料君',
      accountType: 'user',
      followers: 156000,
      postTime: '2026-06-18 08:23:00',
      content: '刚在停车场看到一辆某品牌新能源车自燃了，火势很大，还好没人在车上...',
      repostCount: 2340,
      commentCount: 1890,
      likeCount: 5600,
      isKeyNode: true,
      platform: 'weibo',
    },
    {
      id: 'node-002',
      accountName: '汽车圈那些事',
      accountType: 'kolt',
      followers: 890000,
      postTime: '2026-06-18 09:15:00',
      content: '【突发】某知名品牌电动车在深圳某停车场发生自燃事故，具体原因待查。这已经是本月第二起类似事件了...',
      repostCount: 5670,
      commentCount: 3240,
      likeCount: 12000,
      isKeyNode: true,
      platform: 'weibo',
    },
    {
      id: 'node-003',
      accountName: '财经网',
      accountType: 'media',
      followers: 5200000,
      postTime: '2026-06-18 10:30:00',
      content: '【某车企新能源车发生自燃事故 股价盘中跌超3%】6月18日上午，一辆某品牌电动汽车在深圳一停车场内发生自燃...',
      repostCount: 8900,
      commentCount: 4560,
      likeCount: 25000,
      isKeyNode: true,
      platform: 'weibo',
    },
    {
      id: 'node-004',
      accountName: '车主维权指南',
      accountType: 'user',
      followers: 45000,
      postTime: '2026-06-18 11:20:00',
      content: '有没有同款车主？刚提车三个月，现在看到这个新闻心里慌得一批，有没有维权群拉一下？',
      repostCount: 560,
      commentCount: 890,
      likeCount: 1200,
      isKeyNode: false,
      platform: 'forum',
    },
    {
      id: 'node-005',
      accountName: '新能源汽车观察',
      accountType: 'kolt',
      followers: 320000,
      postTime: '2026-06-18 13:45:00',
      content: '关于某品牌自燃事件，我来梳理一下几个关键点：1. 事发时车辆在充电中；2. 起火点疑似电池包；3. 官方尚未回应...',
      repostCount: 3450,
      commentCount: 2100,
      likeCount: 7800,
      isKeyNode: true,
      platform: 'wechat',
    },
    {
      id: 'node-006',
      accountName: '某车企官方',
      accountType: 'enterprise',
      followers: 1800000,
      postTime: '2026-06-18 15:30:00',
      content: '关于今日网传我司车辆自燃事件，我司高度重视，已第一时间成立专项小组赶赴现场调查，后续将及时公布调查结果。',
      repostCount: 12300,
      commentCount: 8900,
      likeCount: 35000,
      isKeyNode: true,
      platform: 'weibo',
    },
    {
      id: 'node-007',
      accountName: '抖车日记',
      accountType: 'user',
      followers: 890000,
      postTime: '2026-06-18 16:20:00',
      content: '现场实拍！某品牌新能源车自燃全过程，太吓人了',
      repostCount: 45000,
      commentCount: 0,
      likeCount: 156000,
      isKeyNode: true,
      platform: 'douyin',
    },
  ],
};

export const mockSpreadEdges: Record<string, SpreadEdge[]> = {
  'topic-001': [
    { source: 'node-001', target: 'node-002', weight: 80 },
    { source: 'node-002', target: 'node-003', weight: 120 },
    { source: 'node-001', target: 'node-004', weight: 30 },
    { source: 'node-003', target: 'node-005', weight: 90 },
    { source: 'node-005', target: 'node-006', weight: 150 },
    { source: 'node-003', target: 'node-007', weight: 200 },
  ],
};

export const mockMediaFollowUps: Record<string, MediaFollowUp[]> = {
  'topic-001': [
    {
      id: 'media-001',
      mediaName: '人民日报',
      mediaLevel: 'national',
      reportTime: '2026-06-18 14:20:00',
      title: '新能源汽车安全问题引关注 专家建议加强电池质量监管',
      url: '#',
    },
    {
      id: 'media-002',
      mediaName: '南方都市报',
      mediaLevel: 'provincial',
      reportTime: '2026-06-18 11:45:00',
      title: '深圳一停车场内新能源车自燃 暂无人员伤亡',
      url: '#',
    },
    {
      id: 'media-003',
      mediaName: '深圳特区报',
      mediaLevel: 'local',
      reportTime: '2026-06-18 10:30:00',
      title: '今早深圳一小区停车场电动车起火 消防迅速处置',
      url: '#',
    },
    {
      id: 'media-004',
      mediaName: '汽车之家',
      mediaLevel: 'industry',
      reportTime: '2026-06-18 09:50:00',
      title: '某品牌电动车再出自燃事故 电池安全成焦点',
      url: '#',
    },
    {
      id: 'media-005',
      mediaName: '第一财经',
      mediaLevel: 'national',
      reportTime: '2026-06-18 15:10:00',
      title: '自燃事件后某车企股价大跌 新能源赛道安全隐患待解',
      url: '#',
    },
    {
      id: 'media-006',
      mediaName: '21世纪经济报道',
      mediaLevel: 'national',
      reportTime: '2026-06-19 08:30:00',
      title: '某车企自燃事件追踪：涉事车型今年已累计销量超10万辆',
      url: '#',
    },
  ],
};

const enterpriseLabelMap: Record<string, string> = {
  '某知名车企': '车企官方',
  '某互联网公司': '公司官方',
  '某餐饮集团': '品牌官方',
  '某地产公司': '公司公告',
  '某科技公司': '品牌官方',
  '某银行': '银行公告',
  '某电商平台': '平台公告',
  '某制药公司': '公司公告',
};

export function generateFallbackNodes(topic: TopicPackage): SpreadNode[] {
  const nodes: SpreadNode[] = [];
  const baseTime = dayjs(topic.firstPostTime);

  nodes.push({
    id: `fb-${topic.id}-first`,
    accountName: `${topic.cities[0] || ''}爆料用户`,
    accountType: 'user',
    followers: Math.round(topic.volume * 0.5),
    postTime: topic.firstPostTime,
    content: topic.relatedStatements[0] || topic.title,
    repostCount: Math.round(topic.volume * 0.15),
    commentCount: Math.round(topic.volume * 0.08),
    likeCount: Math.round(topic.volume * 0.25),
    isKeyNode: true,
    platform: topic.channels[0] || 'weibo',
  });

  if (topic.channels.length > 1) {
    nodes.push({
      id: `fb-${topic.id}-kol`,
      accountName: `${topic.enterprises[0] || ''}观察者`,
      accountType: 'kolt',
      followers: Math.round(topic.volume * 3),
      postTime: baseTime.add(2, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      content: topic.relatedStatements[1] || `关于${topic.title}，持续关注中...`,
      repostCount: Math.round(topic.volume * 0.2),
      commentCount: Math.round(topic.volume * 0.12),
      likeCount: Math.round(topic.volume * 0.4),
      isKeyNode: true,
      platform: topic.channels[1],
    });
  }

  nodes.push({
    id: `fb-${topic.id}-media`,
    accountName: '财经观察',
    accountType: 'media',
    followers: 4500000,
    postTime: baseTime.add(4, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    content: topic.relatedStatements.length > 2
      ? topic.relatedStatements[2]
      : `${topic.title}，相关部门正在调查。`,
    repostCount: Math.round(topic.volume * 0.35),
    commentCount: Math.round(topic.volume * 0.18),
    likeCount: Math.round(topic.volume * 0.6),
    isKeyNode: true,
    platform: 'news',
  });

  if (topic.enterprises.length > 0) {
    const entName = topic.enterprises[0];
    nodes.push({
      id: `fb-${topic.id}-official`,
      accountName: enterpriseLabelMap[entName] || entName,
      accountType: 'enterprise',
      followers: 1200000,
      postTime: baseTime.add(7, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      content: `关于网传${topic.title}的相关信息，我们高度重视，已启动调查核实，后续将及时通报。`,
      repostCount: Math.round(topic.volume * 0.5),
      commentCount: Math.round(topic.volume * 0.35),
      likeCount: Math.round(topic.volume * 0.8),
      isKeyNode: true,
      platform: 'weibo',
    });
  }

  return nodes;
}

export function generateFallbackMedia(topic: TopicPackage): MediaFollowUp[] {
  const baseTime = dayjs(topic.firstPostTime);
  const result: MediaFollowUp[] = [];

  result.push({
    id: `fbm-${topic.id}-1`,
    mediaName: `${topic.cities[0] || ''}日报`,
    mediaLevel: 'local',
    reportTime: baseTime.add(3, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    title: topic.relatedStatements[0] || topic.title,
    url: '#',
  });

  result.push({
    id: `fbm-${topic.id}-2`,
    mediaName: '经济观察报',
    mediaLevel: 'national',
    reportTime: baseTime.add(6, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    title: topic.relatedStatements.length > 1 ? topic.relatedStatements[1] : topic.title,
    url: '#',
  });

  result.push({
    id: `fbm-${topic.id}-3`,
    mediaName: '行业周刊',
    mediaLevel: 'industry',
    reportTime: baseTime.add(12, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    title: `深度追踪：${topic.title}`,
    url: '#',
  });

  return result;
}

function collectMergedSourceIds(topic: TopicPackage): string[] {
  const ids: string[] = [];
  if (topic.mergedFrom && topic.mergedFrom.length > 0) {
    for (const src of topic.mergedFrom) {
      ids.push(src.id);
      ids.push(...collectMergedSourceIds(src));
    }
  }
  return ids;
}

export function getSpreadNodes(topic: TopicPackage): SpreadNode[] {
  const explicit = mockSpreadNodes[topic.id];
  if (explicit) return explicit;

  if (topic.mergedFrom && topic.mergedFrom.length > 0) {
    const allDirectIds = topic.mergedFrom.map((t) => t.id);
    const sourceIds = collectMergedSourceIds(topic);
    const allIds = [...new Set([...allDirectIds, ...sourceIds])];
    let collected: SpreadNode[] = [];
    for (const sid of allIds) {
      if (mockSpreadNodes[sid]) {
        collected = collected.concat(mockSpreadNodes[sid]);
      }
    }
    if (collected.length > 0) return collected;
  }

  return generateFallbackNodes(topic);
}

export function getSpreadEdges(topicId: string): SpreadEdge[] {
  return mockSpreadEdges[topicId] || [];
}

export function getMediaFollowUps(topic: TopicPackage): MediaFollowUp[] {
  const explicit = mockMediaFollowUps[topic.id];
  if (explicit) return explicit;

  if (topic.mergedFrom && topic.mergedFrom.length > 0) {
    const allDirectIds = topic.mergedFrom.map((t) => t.id);
    const sourceIds = collectMergedSourceIds(topic);
    const allIds = [...new Set([...allDirectIds, ...sourceIds])];
    let collected: MediaFollowUp[] = [];
    for (const sid of allIds) {
      if (mockMediaFollowUps[sid]) {
        collected = collected.concat(mockMediaFollowUps[sid]);
      }
    }
    if (collected.length > 0) return collected;
  }

  return generateFallbackMedia(topic);
}
