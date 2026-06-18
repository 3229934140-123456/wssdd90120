import { useState } from 'react';
import { Card, Input, Tag, Button, Space, List, message, Empty, Select, Divider } from 'antd';
import {
  FileTextOutlined,
  SaveOutlined,
  ExportOutlined,
  EditOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  SoundOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  SafetyOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { useWorkbenchStore } from '@/store/useWorkbenchStore';
import { riskLevelConfig } from '@/data/constants';
import { formatDateTime, downloadFile, generateReportText } from '@/utils';
import type { ReportDraft, RiskLevel } from '@/types';

const { TextArea } = Input;
const { Option } = Select;

const ReportDraftWindow = () => {
  const {
    reports,
    currentReport,
    updateReport,
    setSelectedReportId,
    setActiveWindow,
    selectedTopic,
    generateReport,
  } = useWorkbenchStore();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedReportType, setSelectedReportType] = useState<'daily' | 'special' | 'event'>('special');

  const handleStartEdit = (field: string, value: string | string[]) => {
    setEditingField(field);
    setEditValue(Array.isArray(value) ? value.join('\n') : value);
  };

  const handleSaveEdit = (field: string) => {
    if (!currentReport) return;

    if (field === 'involvedRegions' || field === 'affectedGroups' || field === 'observationItems') {
      const items = editValue.split('\n').filter((s) => s.trim());
      updateReport(currentReport.id, { [field]: items });
    } else {
      updateReport(currentReport.id, { [field]: editValue });
    }
    setEditingField(null);
    message.success('已保存');
  };

  const handleExport = () => {
    if (!currentReport) return;
    const text = generateReportText(currentReport);
    downloadFile(text, `${currentReport.title}.txt`, 'text/plain');
    message.success('报告已导出');
  };

  const handleCopy = async () => {
    if (!currentReport) return;
    const text = generateReportText(currentReport);
    try {
      await navigator.clipboard.writeText(text);
      message.success('已复制到剪贴板');
    } catch {
      message.error('复制失败');
    }
  };

  const handleSelectReport = (report: ReportDraft) => {
    setSelectedReportId(report.id);
  };

  const handleNewReport = () => {
    if (selectedTopic) {
      generateReport(selectedTopic.id, selectedReportType);
      message.success('已生成新的研判提纲');
    } else {
      message.warning('请先在风险地图中选择一个话题');
    }
  };

  const reportTypeLabels = {
    daily: '日报',
    special: '专报',
    event: '突发事件跟踪',
  };

  const renderEditableSection = (
    field: keyof ReportDraft,
    label: string,
    icon: React.ReactNode,
    value: string | string[],
    isList = false
  ) => {
    const isEditing = editingField === field;

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
            {icon}
            <span>{label}</span>
          </div>
          {!isEditing && (
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleStartEdit(field as string, value)}
            >
              编辑
            </Button>
          )}
        </div>

        {isEditing ? (
          <div>
            {isList ? (
              <TextArea
                rows={4}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="每行一项"
                style={{ backgroundColor: '#1a2332', borderColor: '#2d3748', color: '#e0e7ff' }}
              />
            ) : (
              <TextArea
                rows={4}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                style={{ backgroundColor: '#1a2332', borderColor: '#2d3748', color: '#e0e7ff' }}
              />
            )}
            <div className="flex justify-end gap-2 mt-2">
              <Button size="small" onClick={() => setEditingField(null)}>
                取消
              </Button>
              <Button size="small" type="primary" onClick={() => handleSaveEdit(field as string)}>
                保存
              </Button>
            </div>
          </div>
        ) : isList ? (
          <div className="pl-6">
            {(value as string[]).map((item, i) => (
              <div key={i} className="text-sm text-gray-300 mb-1 flex items-start gap-2">
                <span className="text-gray-500">{i + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-300 pl-6 leading-relaxed">{value as string}</p>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex gap-3 p-3">
      <div className="w-64 flex-shrink-0 flex flex-col gap-3">
        <Card
          size="small"
          title={
            <div className="flex items-center gap-2">
              <FileTextOutlined style={{ color: '#1890ff' }} />
              <span>报告列表</span>
            </div>
          }
          className="flex-1 flex flex-col"
          styles={{ body: { flex: 1, padding: 8, overflow: 'auto' } }}
        >
          <div className="mb-3">
            <Select
              size="small"
              value={selectedReportType}
              onChange={(val) => setSelectedReportType(val)}
              style={{ width: '100%', marginBottom: 8 }}
            >
              <Option value="daily">日报</Option>
              <Option value="special">专报</Option>
              <Option value="event">突发事件跟踪</Option>
            </Select>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              block
              onClick={handleNewReport}
              disabled={!selectedTopic}
            >
              生成研判提纲
            </Button>
            {!selectedTopic && (
              <div className="text-xs text-gray-500 mt-1 text-center">
                请先在地图中选择话题
              </div>
            )}
          </div>

          <Divider style={{ margin: '8px 0' }} />

          {reports.length === 0 ? (
            <Empty description="暂无报告" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <List
              size="small"
              dataSource={reports}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  onClick={() => handleSelectReport(item)}
                  className={`cursor-pointer rounded px-2 ${
                    currentReport?.id === item.id ? 'bg-blue-500/20' : 'hover:bg-gray-700/50'
                  }`}
                  style={{ marginBottom: 4, border: 'none' }}
                >
                  <div className="w-full py-1">
                    <div className="text-sm font-medium truncate">{item.title}</div>
                    <div className="text-xs text-gray-500 flex items-center justify-between">
                      <span>{reportTypeLabels[item.reportType]}</span>
                      <span>{formatDateTime(item.updateTime, 'MM-DD HH:mm')}</span>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {currentReport ? (
          <>
            <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold m-0">{currentReport.title}</h2>
                    <Tag color={riskLevelConfig[currentReport.riskLevel].color}>
                      {riskLevelConfig[currentReport.riskLevel].label}
                    </Tag>
                    <Tag color="blue">{reportTypeLabels[currentReport.reportType]}</Tag>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <ClockCircleOutlined />
                      创建于 {formatDateTime(currentReport.createTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <EditOutlined />
                      更新于 {formatDateTime(currentReport.updateTime)}
                    </span>
                  </div>
                </div>
                <Space>
                  <Button icon={<EyeOutlined />} size="small">
                    预览
                  </Button>
                  <Button icon={<CopyOutlined />} size="small" onClick={handleCopy}>
                    复制
                  </Button>
                  <Button icon={<ExportOutlined />} size="small" type="primary" onClick={handleExport}>
                    导出
                  </Button>
                </Space>
              </div>
            </Card>

            <Card
              size="small"
              className="flex-1 min-h-0"
              styles={{ body: { height: '100%', overflow: 'auto', padding: 16 } }}
            >
              {renderEditableSection(
                'eventOverview',
                '事件概况',
                <AlertOutlined style={{ color: '#f5222d' }} />,
                currentReport.eventOverview
              )}

              {renderEditableSection(
                'involvedRegions',
                '涉事地区',
                <EnvironmentOutlined style={{ color: '#1890ff' }} />,
                currentReport.involvedRegions,
                true
              )}

              {renderEditableSection(
                'affectedGroups',
                '可能影响人群',
                <TeamOutlined style={{ color: '#722ed1' }} />,
                currentReport.affectedGroups,
                true
              )}

              {renderEditableSection(
                'suggestedResponse',
                '建议回应口径',
                <SoundOutlined style={{ color: '#fa8c16' }} />,
                currentReport.suggestedResponse
              )}

              {renderEditableSection(
                'observationItems',
                '持续观察项',
                <EyeOutlined style={{ color: '#13c2c2' }} />,
                currentReport.observationItems,
                true
              )}

              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-200 mb-2">
                  <SafetyOutlined style={{ color: '#52c41a' }} />
                  <span>分析师研判</span>
                  <Tag color="green" className="ml-2" style={{ fontSize: 11 }}>
                    人工补充
                  </Tag>
                </div>
                {editingField === 'analystJudgment' ? (
                  <div>
                    <TextArea
                      rows={4}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="请输入您的专业研判意见..."
                      style={{ backgroundColor: '#1a2332', borderColor: '#2d3748', color: '#e0e7ff' }}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button size="small" onClick={() => setEditingField(null)}>
                        取消
                      </Button>
                      <Button size="small" type="primary" onClick={() => handleSaveEdit('analystJudgment')}>
                        保存
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => handleStartEdit('analystJudgment', currentReport.analystJudgment)}
                    className={`pl-6 text-sm leading-relaxed cursor-pointer rounded p-2 hover:bg-gray-800/50 ${
                      currentReport.analystJudgment ? 'text-gray-300' : 'text-gray-500 italic'
                    }`}
                  >
                    {currentReport.analystJudgment || '点击此处补充您的专业研判...'}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-700 pt-3 mt-3">
                <div className="text-xs text-gray-500 text-center">
                  本报告由舆情研判工作台自动生成，请结合实际情况进行核验和调整
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <Empty
              description={
                <div>
                  <p>暂无选中的报告</p>
                  <p className="text-xs text-gray-500 mt-2">
                    从左侧列表选择报告，或生成新的研判提纲
                  </p>
                </div>
              }
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReportDraftWindow;
