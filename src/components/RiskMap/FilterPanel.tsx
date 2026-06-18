import { Card, Select, DatePicker, Tag, Button, Space } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ChannelType } from '@/types';
import { enterprises, regions, channels, riskLevelConfig } from '@/data/constants';
import { useWorkbenchStore } from '@/store/useWorkbenchStore';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FilterPanel = () => {
  const { filterCriteria, setFilterCriteria } = useWorkbenchStore();

  const handleReset = () => {
    setFilterCriteria({
      enterprises: [],
      regions: [],
      timeRange: {
        start: '2026-06-15 00:00:00',
        end: '2026-06-19 23:59:59',
      },
      channels: [],
      riskLevels: ['high', 'medium', 'low'],
    });
  };

  return (
    <Card
      size="small"
      title={
        <Space size="small">
          <FilterOutlined />
          <span>筛选条件</span>
        </Space>
      }
      extra={
        <Button type="text" size="small" icon={<ReloadOutlined />} onClick={handleReset}>
          重置
        </Button>
      }
      className="h-full"
      styles={{ body: { padding: 12 } }}
    >
      <div className="space-y-4">
        <div>
          <div className="text-xs text-gray-400 mb-1.5">涉事企业</div>
          <Select
            mode="multiple"
            size="small"
            placeholder="选择企业"
            value={filterCriteria.enterprises}
            onChange={(val) => setFilterCriteria({ enterprises: val })}
            style={{ width: '100%' }}
            maxTagCount={2}
          >
            {enterprises.map((e) => (
              <Option key={e.value} value={e.value}>
                {e.label}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <div className="text-xs text-gray-400 mb-1.5">涉及区域</div>
          <Select
            mode="multiple"
            size="small"
            placeholder="选择省份"
            value={filterCriteria.regions}
            onChange={(val) => setFilterCriteria({ regions: val })}
            style={{ width: '100%' }}
            maxTagCount={2}
          >
            {regions.map((r) => (
              <Option key={r.value} value={r.value}>
                {r.label}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <div className="text-xs text-gray-400 mb-1.5">时间范围</div>
          <RangePicker
            size="small"
            style={{ width: '100%' }}
            value={[
              dayjs(filterCriteria.timeRange.start),
              dayjs(filterCriteria.timeRange.end),
            ]}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setFilterCriteria({
                  timeRange: {
                    start: dates[0].format('YYYY-MM-DD 00:00:00'),
                    end: dates[1].format('YYYY-MM-DD 23:59:59'),
                  },
                });
              }
            }}
          />
        </div>

        <div>
          <div className="text-xs text-gray-400 mb-1.5">传播渠道</div>
          <div className="flex flex-wrap gap-1.5">
            {channels.map((ch) => {
              const isSelected = filterCriteria.channels.includes(ch.value as ChannelType);
              return (
                <Tag
                  key={ch.value}
                  color={isSelected ? ch.color : 'default'}
                  onClick={() => {
                    const newChannels = isSelected
                      ? filterCriteria.channels.filter((c) => c !== ch.value)
                      : [...filterCriteria.channels, ch.value as ChannelType];
                    setFilterCriteria({ channels: newChannels });
                  }}
                  className="cursor-pointer px-2 py-0.5 text-xs"
                  style={{
                    opacity: isSelected ? 1 : 0.6,
                    border: `1px solid ${isSelected ? ch.color : '#434343'}`,
                  }}
                >
                  {ch.label}
                </Tag>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-400 mb-1.5">风险等级</div>
          <div className="flex flex-wrap gap-1.5">
            {(['high', 'medium', 'low'] as const).map((level) => {
              const config = riskLevelConfig[level];
              const isSelected = filterCriteria.riskLevels.includes(level);
              return (
                <Tag
                  key={level}
                  color={isSelected ? config.color : 'default'}
                  onClick={() => {
                    const newLevels = isSelected
                      ? filterCriteria.riskLevels.filter((l) => l !== level)
                      : [...filterCriteria.riskLevels, level];
                    setFilterCriteria({ riskLevels: newLevels });
                  }}
                  className="cursor-pointer px-2 py-0.5 text-xs"
                  style={{
                    opacity: isSelected ? 1 : 0.6,
                    border: `1px solid ${isSelected ? config.color : '#434343'}`,
                  }}
                >
                  {config.label}
                </Tag>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FilterPanel;
