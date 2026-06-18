import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  getFilteredTopics: () => TopicPackage[];
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

function filterTopicsByCriteria(allTopics: TopicPackage[], criteria: FilterCriteria): TopicPackage[] {
  let result = [...allTopics];

  if (criteria.riskLevels.length > 0) {
    result = result.filter((t) => criteria.riskLevels.includes(t.riskLevel));
  }

  if (criteria.enterprises.length > 0) {
    result = result.filter((t) =>
      t.enterprises.some((e) => criteria.enterprises.includes(e))
    );
  }

  if (criteria.channels.length > 0) {
    result = result.filter((t) =>
      t.channels.some((c) => criteria.channels.includes(c))
    );
  }

  if (criteria.timeRange.start) {
    const startMs = new Date(criteria.timeRange.start).getTime();
    result = result.filter((t) => new Date(t.latestPostTime).getTime() >= startMs);
  }

  if (criteria.timeRange.end) {
    const endMs = new Date(criteria.timeRange.end).getTime();
    result = result.filter((t) => new Date(t.firstPostTime).getTime() <= endMs);
  }

  return result;
}

function getAffectedGroupForTag(tag: string): string[] {
  const map: Record<string, string[]> = {
    '产品安全': ['消费者', '潜在购买者', '现有车主'],
    '品牌声誉': ['品牌用户', '合作伙伴', '投资者'],
    '消费者权益': ['消费者', '维权群体', '监管机构'],
    '食品安全': ['就餐消费者', '周边居民', '监管部门'],
    '品牌危机': ['品牌消费者', '合作伙伴', '供应链'],
    '监管风险': ['行业从业者', '监管部门', '投资者'],
    '财务风险': ['投资者', '债权人', '合作方'],
    '行业影响': ['行业从业者', '投资者', '监管机构'],
    '投资风险': ['投资者', '股民', '基金持有人'],
    '人力资源': ['在职员工', '求职者', '同行从业者'],
    '员工权益': ['在职员工', '离职员工', '劳动监察部门'],
    '数据安全': ['客户', '用户', '隐私保护组织'],
    '合规风险': ['客户', '监管机构', '行业参与者'],
    '客户信任': ['现有客户', '潜在客户', '合作伙伴'],
    '供应链': ['供应商', '经销商', '物流合作方'],
    '营销合规': ['消费者', '市场监管部门', '同行企业'],
    '平台信誉': ['平台用户', '入驻商家', '投资者'],
    '产品发布': ['目标用户', '行业媒体', '竞争对手'],
    '正面舆情': ['品牌粉丝', '合作伙伴'],
    '产品利好': ['患者', '医疗从业者', '投资者'],
    '研发进展': ['行业研究者', '投资者', '合作机构'],
  };
  return map[tag] || ['相关群体', '行业观察者', '监管机构'];
}

export const useWorkbenchStore = create<WorkbenchStore>()(
  persist(
    (set, get) => ({
      activeWindow: 'map',
      selectedTopicId: null,
      selectedReportId: null,
      openWindows: ['map'],
      filterCriteria: initialFilter,
      topics: mockTopics,
      selectedTopic: null,
      currentReport: null,
      reports: [],

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
          mergedFrom: topicsToMerge.map((t) => ({ ...t })),
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

        const affectedGroups = [...new Set(topic.riskTags.flatMap((tag) => getAffectedGroupForTag(tag)))];

        const mergedInfo = topic.mergedFrom
          ? `\n\n本话题包由以下话题合并而成：${topic.mergedFrom.map((t) => t.title).join('；')}。`
          : '';

        const newReport: ReportDraft = {
          id: `report-${Date.now()}`,
          topicId: topic.id,
          title: `${topic.title}${typeNames[reportType]}`,
          createTime: now,
          updateTime: now,
          eventOverview: `${topic.title}。该事件于${topic.firstPostTime}首次出现，截至${topic.latestPostTime}，累计传播声量${topic.volume.toLocaleString()}条。事件负面占比${topic.sentiment.negative}%，主要传播渠道包括${topic.channels.join('、')}。涉及城市包括${topic.cities.slice(0, 3).join('、')}等${topic.cities.length}个城市。${mergedInfo}`,
          involvedRegions: topic.cities,
          affectedGroups: affectedGroups.length > 0 ? affectedGroups : ['相关群体', '行业观察者'],
          suggestedResponse: topic.riskLevel === 'high'
            ? '建议企业第一时间发布官方声明，说明事件调查进展和处理措施；主动配合相关部门调查，及时公布调查结果；做好利益相关方沟通安抚工作，避免舆情进一步发酵。'
            : topic.riskLevel === 'medium'
            ? '建议企业关注舆情走向，适时发布说明或回应；做好内部排查，确认事实后统一口径；关注是否有升级为高风险事件的可能。'
            : '建议持续关注，暂无需主动回应；做好常规监测，如有升温迹象及时调整应对策略。',
          observationItems: [
            '关注官方调查结果公布时间及内容',
            '监测是否有更多类似事件曝出',
            '跟踪股价及市场反应',
            '观察竞品或相关方是否借机发声',
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

      getFilteredTopics: () => {
        const { topics, filterCriteria } = get();
        return filterTopicsByCriteria(topics, filterCriteria);
      },
    }),
    {
      name: 'opinion-workbench-storage',
      partialize: (state) => ({
        topics: state.topics,
        reports: state.reports,
        filterCriteria: state.filterCriteria,
      }),
    }
  )
);
