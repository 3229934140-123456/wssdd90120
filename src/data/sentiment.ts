import type { SentimentDataPoint, CommentItem } from '@/types';

export const mockSentimentData: Record<string, SentimentDataPoint[]> = {
  'topic-001': [
    { time: '06-18 08:00', positive: 20, neutral: 50, negative: 30, total: 200 },
    { time: '06-18 10:00', positive: 15, neutral: 35, negative: 50, total: 850 },
    { time: '06-18 12:00', positive: 12, neutral: 28, negative: 60, total: 2100 },
    { time: '06-18 14:00', positive: 10, neutral: 25, negative: 65, total: 3500 },
    { time: '06-18 16:00', positive: 8, neutral: 22, negative: 70, total: 5200 },
    { time: '06-18 18:00', positive: 10, neutral: 26, negative: 64, total: 7800 },
    { time: '06-18 20:00', positive: 12, neutral: 30, negative: 58, total: 9500 },
    { time: '06-18 22:00', positive: 14, neutral: 32, negative: 54, total: 10800 },
    { time: '06-19 00:00', positive: 15, neutral: 35, negative: 50, total: 11200 },
    { time: '06-19 04:00', positive: 16, neutral: 36, negative: 48, total: 11500 },
    { time: '06-19 08:00', positive: 14, neutral: 30, negative: 56, total: 11900 },
    { time: '06-19 12:00', positive: 15, neutral: 28, negative: 57, total: 12400 },
  ],
};

export const mockComments: Record<string, CommentItem[]> = {
  'topic-001': [
    {
      id: 'c-001',
      userName: '新能源车主小李',
      content: '刚提车就出这事？希望官方能给个说法，电池安全不是小事。',
      sentiment: 'negative',
      likes: 892,
      time: '2026-06-18 10:23:00',
    },
    {
      id: 'c-002',
      userName: '理性吃瓜群众',
      content: '等官方调查结果出来再说吧，现在下结论还太早。',
      sentiment: 'neutral',
      likes: 567,
      time: '2026-06-18 11:05:00',
    },
    {
      id: 'c-003',
      userName: '电池工程师王工',
      content: '从视频看起火点在底盘，大概率是电池热失控。建议厂家彻查原因，不要捂盖子。',
      sentiment: 'negative',
      likes: 1234,
      time: '2026-06-18 12:30:00',
    },
    {
      id: 'c-004',
      userName: '某品牌粉丝',
      content: '支持某车企，相信他们的技术实力，会很快给出解决方案的。',
      sentiment: 'positive',
      likes: 234,
      time: '2026-06-18 14:15:00',
    },
    {
      id: 'c-005',
      userName: '保险理赔顾问',
      content: '提醒各位车主，新能源车自燃险一定要买，特别是这种高风险车型。',
      sentiment: 'neutral',
      likes: 678,
      time: '2026-06-18 15:40:00',
    },
    {
      id: 'c-006',
      userName: '老司机张师傅',
      content: '电动车自燃确实吓人，我还是先开燃油车吧，等技术成熟了再说。',
      sentiment: 'negative',
      likes: 456,
      time: '2026-06-18 16:20:00',
    },
    {
      id: 'c-007',
      userName: '行业研究员',
      content: '其实新能源汽车自燃率远低于燃油车，只是电动车自燃更容易传播。不过安全问题确实不能放松。',
      sentiment: 'neutral',
      likes: 890,
      time: '2026-06-18 17:55:00',
    },
    {
      id: 'c-008',
      userName: '维权斗士',
      content: '已加入维权群，有相同遭遇的车主私信我，集体维权才有力量！',
      sentiment: 'negative',
      likes: 345,
      time: '2026-06-18 19:10:00',
    },
  ],
};

export const getSentimentData = (topicId: string): SentimentDataPoint[] => {
  return mockSentimentData[topicId] || [];
};

export const getComments = (topicId: string): CommentItem[] => {
  return mockComments[topicId] || [];
};
