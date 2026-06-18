import dayjs from 'dayjs';

export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString();
};

export const formatDateTime = (dateStr: string, format = 'YYYY-MM-DD HH:mm'): string => {
  return dayjs(dateStr).format(format);
};

export const formatRelativeTime = (dateStr: string): string => {
  const now = dayjs();
  const target = dayjs(dateStr);
  const diffHours = now.diff(target, 'hour');

  if (diffHours < 1) {
    const diffMinutes = now.diff(target, 'minute');
    return `${diffMinutes}分钟前`;
  }
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }
  const diffDays = now.diff(target, 'day');
  if (diffDays < 7) {
    return `${diffDays}天前`;
  }
  return formatDateTime(dateStr, 'MM-DD HH:mm');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const downloadFile = (content: string, filename: string, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateReportText = (report: {
  title: string;
  eventOverview: string;
  involvedRegions: string[];
  affectedGroups: string[];
  suggestedResponse: string;
  observationItems: string[];
  analystJudgment: string;
  riskLevel: string;
  createTime: string;
}): string => {
  const riskLevelText = { high: '高风险', medium: '中风险', low: '低风险' }[report.riskLevel] || report.riskLevel;

  return `【舆情研判报告】

报告标题：${report.title}
生成时间：${report.createTime}
风险等级：${riskLevelText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

一、事件概况

${report.eventOverview}

二、涉事地区

${report.involvedRegions.map((r, i) => `${i + 1}. ${r}`).join('\n')}

三、可能影响人群

${report.affectedGroups.map((g, i) => `${i + 1}. ${g}`).join('\n')}

四、建议回应口径

${report.suggestedResponse}

五、持续观察项

${report.observationItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}

六、分析师研判

${report.analystJudgment || '（待补充）'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
* 本报告由舆情研判工作台自动生成
* 请结合实际情况进行核验和调整
`;
};
