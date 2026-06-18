import { create } from 'zustand';
import type {
  WorkbenchState,
  WindowType,
  FilterCriteria,
  TopicPackage,
  ReportDraft,
  RiskLevel,
} from '@/types';
import { mockTopics } from '@/data/topics';

interface WorkbenchStore extends WorkbenchState {
  filterCriteria: FilterCriteria;
  topics: TopicPackage[];
  selectedTopic: TopicPackage | null;
  currentReport: ReportDraft | null;
  reports: ReportDraft[];

  setActiveWindow: (window: WindowType) => void;
  openWindow: (window: WindowType) => void;
  closeWindow: (window: WindowType) => void;
  setSelectedTopicId: (id: string | null) => void;
  setFilterCriteria: (criteria: Partial<FilterCriteria>) => void;
  updateTopicRiskLevel: (topicId: string, level: RiskLevel, basis: string) => void;
  mergeTopics: (topicIds: string[], newTitle: string) => void;
  generateReport: (topicId: string, reportType: 'daily' | 'special' | 'event') => void;
  updateReport: (reportId: string, updates: Partial<ReportDraft>) => void;
  setSelectedReportId: (id: string | null) => void;
}

const initialFilter: FilterCriteria = {
  enterprises: [],
  regions: [],
  timeRange: {
    start: '2026-06-15 00:00:00',
    end: '2026-06-19 23:59:59',
  },
  channels: [],
  riskLevels: ['high', 'medium', 'low'],
};

const initialReports: ReportDraft[] = [];

export const useWorkbenchStore = create<WorkbenchStore>((set, get) => ({
  activeWindow: 'map',
  selectedTopicId: null,
  selectedReportId: null,
  openWindows: ['map'],
  filterCriteria: initialFilter,
  topics: mockTopics,
  selectedTopic: null,
  currentReport: null,
  reports: initialReports,

  setActiveWindow: (window) => {
    set({ activeWindow: window });
    const { openWindows } = get();
    if (!openWindows.includes(window)) {
      set({ openWindows: [...openWindows, window] });
    }
  },

  openWindow: (window) => {
    const { openWindows } = get();
    if (!openWindows.includes(window)) {
      set({ openWindows: [...openWindows, window], activeWindow: window });
    } else {
      set({ activeWindow: window });
    }
  },

  closeWindow: (window) => {
    const { openWindows, activeWindow } = get();
    const newWindows = openWindows.filter((w) => w !== window);
    if (activeWindow === window && newWindows.length > 0) {
      set({
        openWindows: newWindows,
        activeWindow: newWindows[newWindows.length - 1],
      });
    } else {
      set({ openWindows: newWindows });
    }
  },

  setSelectedTopicId: (id) => {
    const { topics } = get();
    const topic = topics.find((t) => t.id === id) || null;
    set({ selectedTopicId: id, selectedTopic: topic });
  },

  setFilterCriteria: (criteria) => {
    set((state) => ({
      filterCriteria: { ...state.filterCriteria, ...criteria },
    }));
  },

  updateTopicRiskLevel: (topicId, level, basis) => {
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? { ...t, manualRiskLevel: level, riskLevel: level, judgmentBasis: basis }
          : t
      ),
      selectedTopic:
        state.selectedTopic?.id === topicId
          ? { ...state.selectedTopic, manualRiskLevel: level, riskLevel: level, judgmentBasis: basis }
          : state.selectedTopic,
    }));
  },

  mergeTopics: (topicIds, newTitle) => {
    const { topics } = get();
    const topicsToMerge = topics.filter((t) => topicIds.includes(t.id));
    if (topicsToMerge.length < 2) return;

    const mergedTopic: TopicPackage = {
      id: `merged-${Date.now()}`,
      title: newTitle,
      relatedStatements: topicsToMerge.flatMap((t) => [t.title, ...t.relatedStatements]),
      riskLevel: topicsToMerge.some((t) => t.riskLevel === 'high')
        ? 'high'
        : topicsToMerge.some((t) => t.riskLevel === 'medium')
        ? 'medium'
        : 'low',
      volume: topicsToMerge.reduce((sum, t) => sum + t.volume, 0),
      sentiment: {
        positive: Math.round(
          topicsToMerge.reduce((sum, t) => sum + t.sentiment.positive, 0) / topicsToMerge.length
        ),
        neutral: Math.round(
          topicsToMerge.reduce((sum, t) => sum + t.sentiment.neutral, 0) / topicsToMerge.length
        ),
        negative: Math.round(
          topicsToMerge.reduce((sum, t) => sum + t.sentiment.negative, 0) / topicsToMerge.length
        ),
      },
      firstPostTime: topicsToMerge
        .map((t) => t.firstPostTime)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0],
      latestPostTime: topicsToMerge
        .map((t) => t.latestPostTime)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0],
      channels: [...new Set(topicsToMerge.flatMap((t) => t.channels))],
      cities: [...new Set(topicsToMerge.flatMap((t) => t.cities))],
      enterprises: [...new Set(topicsToMerge.flatMap((t) => t.enterprises))],
      riskTags: [...new Set(topicsToMerge.flatMap((t) => t.riskTags))],
    };

    const remainingTopics = topics.filter((t) => !topicIds.includes(t.id));
    set({
      topics: [mergedTopic, ...remainingTopics],
      selectedTopic: mergedTopic,
      selectedTopicId: mergedTopic.id,
    });
  },

  generateReport: (topicId, reportType) => {
    const { topics, reports } = get();
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return;

    const typeNames = {
      daily: '日报',
      special: '专报',
      event: '突发事件跟踪',
    };

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newReport: ReportDraft = {
      id: `report-${Date.now()}`,
      topicId: topic.id,
      title: `${topic.title}${typeNames[reportType]}`,
      createTime: now,
      updateTime: now,
      eventOverview: `${topic.title}。该事件于${topic.firstPostTime}首次出现，截至${topic.latestPostTime}，累计传播声量${topic.volume.toLocaleString()}条。事件负面占比${topic.sentiment.negative}%，主要传播渠道包括${topic.channels.join('、')}。涉及城市包括${topic.cities.slice(0, 3).join('、')}等${topic.cities.length}个城市。`,
      involvedRegions: topic.cities,
      affectedGroups: ['消费者用户', '潜在购车人群', '投资者', '行业监管部门'],
      suggestedResponse: '建议企业第一时间发布官方声明，说明事件调查进展和处理措施；主动配合相关部门调查，及时公布调查结果；做好车主沟通安抚工作，避免舆情进一步发酵。',
      observationItems: [
        '关注官方调查结果公布时间及内容',
        '监测是否有更多类似事件曝出',
        '跟踪股价及市场反应',
        '观察竞品是否借机营销',
        '关注监管部门是否介入',
      ],
      analystJudgment: '',
      riskLevel: topic.riskLevel,
      reportType,
    };

    set({
      reports: [...reports, newReport],
      currentReport: newReport,
      selectedReportId: newReport.id,
    });
  },

  updateReport: (reportId, updates) => {
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === reportId
          ? { ...r, ...updates, updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19) }
          : r
      ),
      currentReport:
        state.currentReport?.id === reportId
          ? { ...state.currentReport, ...updates, updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19) }
          : state.currentReport,
    }));
  },

  setSelectedReportId: (id) => {
    const { reports } = get();
    const report = reports.find((r) => r.id === id) || null;
    set({ selectedReportId: id, currentReport: report });
  },
}));
