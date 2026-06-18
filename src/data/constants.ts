import type { ChannelType } from '@/types';

export const enterprises = [
  { value: '某知名车企', label: '某知名车企' },
  { value: '某互联网公司', label: '某互联网公司' },
  { value: '某餐饮集团', label: '某餐饮集团' },
  { value: '某地产公司', label: '某地产公司' },
  { value: '某科技公司', label: '某科技公司' },
  { value: '某银行', label: '某银行' },
  { value: '某电商平台', label: '某电商平台' },
  { value: '某制药公司', label: '某制药公司' },
];

export const regions = [
  { value: '广东', label: '广东省' },
  { value: '北京', label: '北京市' },
  { value: '上海', label: '上海市' },
  { value: '浙江', label: '浙江省' },
  { value: '江苏', label: '江苏省' },
  { value: '四川', label: '四川省' },
  { value: '湖北', label: '湖北省' },
  { value: '陕西', label: '陕西省' },
  { value: '重庆', label: '重庆市' },
  { value: '天津', label: '天津市' },
  { value: '湖南', label: '湖南省' },
  { value: '山东', label: '山东省' },
  { value: '福建', label: '福建省' },
];

export const channels: { value: ChannelType; label: string; color: string }[] = [
  { value: 'weibo', label: '微博', color: '#e6162d' },
  { value: 'wechat', label: '微信', color: '#07c160' },
  { value: 'douyin', label: '抖音', color: '#000000' },
  { value: 'xiaohongshu', label: '小红书', color: '#ff2442' },
  { value: 'news', label: '新闻', color: '#1890ff' },
  { value: 'forum', label: '论坛', color: '#fa8c16' },
  { value: 'video', label: '视频', color: '#722ed1' },
];

export const riskLevelConfig = {
  high: { label: '高风险', color: '#f5222d', bgColor: 'rgba(245, 34, 45, 0.1)' },
  medium: { label: '中风险', color: '#fa8c16', bgColor: 'rgba(250, 140, 22, 0.1)' },
  low: { label: '低风险', color: '#52c41a', bgColor: 'rgba(82, 196, 26, 0.1)' },
};

export const accountTypeConfig = {
  user: { label: '普通用户', color: '#8c8c8c' },
  media: { label: '媒体', color: '#1890ff' },
  kolt: { label: 'KOL', color: '#722ed1' },
  official: { label: '官微', color: '#52c41a' },
  enterprise: { label: '企业', color: '#fa8c16' },
};

export const mediaLevelConfig = {
  national: { label: '国家级', color: '#f5222d' },
  provincial: { label: '省级', color: '#fa8c16' },
  local: { label: '地方级', color: '#1890ff' },
  industry: { label: '行业级', color: '#722ed1' },
};
