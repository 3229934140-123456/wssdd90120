import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { Card } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { mockRiskPoints } from '@/data/riskPoints';
import { useWorkbenchStore } from '@/store/useWorkbenchStore';
import { riskLevelConfig } from '@/data/constants';
import { formatNumber } from '@/utils';

const MapView = () => {
  const { filterCriteria, topics, setSelectedTopicId, openWindow, setActiveWindow } = useWorkbenchStore();

  const filteredRiskPoints = useMemo(() => {
    let points = [...mockRiskPoints];

    if (filterCriteria.regions.length > 0) {
      points = points.filter((p) => filterCriteria.regions.includes(p.province));
    }

    if (filterCriteria.riskLevels.length > 0) {
      points = points.filter((p) => filterCriteria.riskLevels.includes(p.riskLevel));
    }

    if (filterCriteria.enterprises.length > 0) {
      const relevantTopicIds = topics
        .filter((t) => t.enterprises.some((e) => filterCriteria.enterprises.includes(e)))
        .map((t) => t.id);
      points = points.filter((p) => p.topicIds.some((tid) => relevantTopicIds.includes(tid)));
    }

    return points;
  }, [filterCriteria, topics]);

  const chartOption: EChartsOption = useMemo(() => {
    const scatterData = filteredRiskPoints.map((p) => ({
      name: p.city,
      value: [...p.coordinates, p.volume, p.riskLevel, p.topicIds.length],
      itemStyle: {
        color: riskLevelConfig[p.riskLevel].color,
      },
    }));

    const maxVolume = Math.max(...filteredRiskPoints.map((p) => p.volume), 1);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(20, 28, 42, 0.95)',
        borderColor: '#2a3a50',
        borderWidth: 1,
        textStyle: {
          color: '#e0e7ff',
          fontSize: 12,
        },
        formatter: (params: any) => {
          const data = params.data;
          const cityName = data.name;
          const volume = data.value[2];
          const riskLevel = data.value[3];
          const topicCount = data.value[4];
          const levelConfig = riskLevelConfig[riskLevel as keyof typeof riskLevelConfig];

          return `
            <div style="padding: 4px 2px;">
              <div style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">${cityName}</div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${levelConfig.color};"></span>
                <span style="color: #a0aec0;">风险等级:</span>
                <span style="color: ${levelConfig.color}; font-weight: 500;">${levelConfig.label}</span>
              </div>
              <div style="color: #a0aec0; margin-bottom: 4px;">
                <span>传播声量:</span>
                <span style="color: #fff; margin-left: 4px; font-weight: 500;">${formatNumber(volume)}</span>
              </div>
              <div style="color: #a0aec0;">
                <span>话题数量:</span>
                <span style="color: #fff; margin-left: 4px; font-weight: 500;">${topicCount}个</span>
              </div>
            </div>
          `;
        },
      },
      grid: {
        left: 40,
        right: 40,
        top: 30,
        bottom: 30,
      },
      xAxis: {
        type: 'value',
        show: false,
        min: 100,
        max: 130,
      },
      yAxis: {
        type: 'value',
        show: false,
        min: 18,
        max: 42,
      },
      series: [
        {
          type: 'effectScatter',
          data: scatterData.filter((d: any) => d.value[3] === 'high'),
          symbolSize: (val: number[]) => {
            return Math.max(18, (val[2] / maxVolume) * 50 + 15);
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
            scale: 3,
            period: 4,
          },
          hoverAnimation: true,
          label: {
            show: true,
            position: 'top',
            formatter: '{b}',
            color: '#e0e7ff',
            fontSize: 11,
            fontWeight: 500,
            textShadowColor: 'rgba(0,0,0,0.8)',
            textShadowBlur: 4,
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(245, 34, 45, 0.5)',
          },
          zlevel: 3,
        },
        {
          type: 'scatter',
          data: scatterData.filter((d: any) => d.value[3] === 'medium'),
          symbolSize: (val: number[]) => {
            return Math.max(12, (val[2] / maxVolume) * 40 + 10);
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{b}',
            color: '#cbd5e0',
            fontSize: 11,
            textShadowColor: 'rgba(0,0,0,0.8)',
            textShadowBlur: 3,
          },
          itemStyle: {
            shadowBlur: 8,
            shadowColor: 'rgba(250, 140, 22, 0.4)',
          },
          zlevel: 2,
        },
        {
          type: 'scatter',
          data: scatterData.filter((d: any) => d.value[3] === 'low'),
          symbolSize: (val: number[]) => {
            return Math.max(8, (val[2] / maxVolume) * 30 + 6);
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{b}',
            color: '#a0aec0',
            fontSize: 10,
            textShadowColor: 'rgba(0,0,0,0.6)',
            textShadowBlur: 2,
          },
          itemStyle: {
            shadowBlur: 5,
            shadowColor: 'rgba(82, 196, 26, 0.3)',
          },
          zlevel: 1,
        },
      ],
    };
  }, [filteredRiskPoints]);

  const handleClick = (params: any) => {
    const cityName = params.name;
    const point = filteredRiskPoints.find((p) => p.city === cityName);
    if (point && point.topicIds.length > 0) {
      setSelectedTopicId(point.topicIds[0]);
      openWindow('topic');
      setActiveWindow('topic');
    }
  };

  const onEvents = {
    click: handleClick,
  };

  const stats = useMemo(() => {
    const high = filteredRiskPoints.filter((p) => p.riskLevel === 'high').length;
    const medium = filteredRiskPoints.filter((p) => p.riskLevel === 'medium').length;
    const low = filteredRiskPoints.filter((p) => p.riskLevel === 'low').length;
    const totalVolume = filteredRiskPoints.reduce((sum, p) => sum + p.volume, 0);
    return { high, medium, low, totalVolume, total: filteredRiskPoints.length };
  }, [filteredRiskPoints]);

  return (
    <Card
      size="small"
      title={
        <div className="flex items-center gap-2">
          <EnvironmentOutlined style={{ color: '#1890ff' }} />
          <span>风险地图</span>
          <span className="text-xs text-gray-400 ml-2">点击城市查看详情</span>
        </div>
      }
      className="h-full flex flex-col"
      styles={{ body: { flex: 1, padding: 8, display: 'flex', flexDirection: 'column' } }}
    >
      <div className="flex gap-4 mb-2 px-2">
        <div className="text-center">
          <div className="text-lg font-bold text-red-500">{stats.high}</div>
          <div className="text-xs text-gray-400">高风险</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-orange-500">{stats.medium}</div>
          <div className="text-xs text-gray-400">中风险</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-500">{stats.low}</div>
          <div className="text-xs text-gray-400">低风险</div>
        </div>
        <div className="text-center ml-auto">
          <div className="text-lg font-bold text-blue-400">{formatNumber(stats.totalVolume)}</div>
          <div className="text-xs text-gray-400">总声量</div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ReactECharts
          option={chartOption}
          style={{ height: '100%', width: '100%' }}
          onEvents={onEvents}
          notMerge
        />
      </div>

      <div className="flex justify-center gap-4 mt-2 pt-2 border-t border-gray-700">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-gray-400">高风险</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          <span className="text-gray-400">中风险</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-gray-400">低风险</span>
        </div>
      </div>
    </Card>
  );
};

export default MapView;
