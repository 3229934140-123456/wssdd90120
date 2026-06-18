export type RiskLevel = 'high' | 'medium' | 'low';

export type ChannelType = 'weibo' | 'wechat' | 'douyin' | 'xiaohongshu' | 'news' | 'forum' | 'video';

export type AccountType = 'user' | 'media' | 'kolt' | 'official' | 'enterprise';

export type MediaLevel = 'national' | 'provincial' | 'local' | 'industry';

export interface RiskPoint {
  id: string;
  city: string;
  province: string;
  riskLevel: RiskLevel;
  volume: number;
  topicIds: string[];
  coordinates: [number, number];
}

export interface TopicPackage {
  id: string;
  title: string;
  relatedStatements: string[];
  riskLevel: RiskLevel;
  manualRiskLevel?: RiskLevel;
  volume: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  firstPostTime: string;
  latestPostTime: string;
  channels: ChannelType[];
  cities: string[];
  enterprises: string[];
  judgmentBasis?: string;
  riskTags: string[];
  mergedFrom?: TopicPackage[];
}

export interface SpreadNode {
  id: string;
  accountName: string;
  accountType: AccountType;
  followers: number;
  postTime: string;
  content: string;
  repostCount: number;
  commentCount: number;
  likeCount: number;
  isKeyNode: boolean;
  platform: ChannelType;
  avatar?: string;
}

export interface SpreadEdge {
  source: string;
  target: string;
  weight: number;
}

export interface MediaFollowUp {
  id: string;
  mediaName: string;
  mediaLevel: MediaLevel;
  reportTime: string;
  title: string;
  url: string;
}

export interface SentimentDataPoint {
  time: string;
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

export interface CommentItem {
  id: string;
  userName: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  likes: number;
  time: string;
}

export interface ReportDraft {
  id: string;
  topicId: string;
  title: string;
  createTime: string;
  updateTime: string;
  eventOverview: string;
  involvedRegions: string[];
  affectedGroups: string[];
  suggestedResponse: string;
  observationItems: string[];
  analystJudgment: string;
  riskLevel: RiskLevel;
  reportType: 'daily' | 'special' | 'event';
}

export interface FilterCriteria {
  enterprises: string[];
  regions: string[];
  timeRange: { start: string; end: string };
  channels: ChannelType[];
  riskLevels: RiskLevel[];
}

export type WindowType = 'map' | 'topic' | 'report';

export interface WorkbenchState {
  activeWindow: WindowType;
  selectedTopicId: string | null;
  selectedReportId: string | null;
  openWindows: WindowType[];
}
