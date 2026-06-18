import FilterPanel from '@/components/RiskMap/FilterPanel';
import MapView from '@/components/RiskMap/MapView';
import TopicList from '@/components/RiskMap/TopicList';

const RiskMapWindow = () => {
  return (
    <div className="h-full flex gap-3 p-3">
      <div className="w-64 flex-shrink-0">
        <FilterPanel />
      </div>
      <div className="flex-1 min-w-0">
        <MapView />
      </div>
      <div className="w-80 flex-shrink-0">
        <TopicList />
      </div>
    </div>
  );
};

export default RiskMapWindow;
