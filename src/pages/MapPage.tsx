import { useState } from 'react';
import MapView from '../components/map/MapView';
import AddBarModal from '../components/map/AddBarModal';

export default function MapPage() {
  const [showAddBar, setShowAddBar] = useState(false);

  const handleAddBar = async (barData: any) => {
    console.log('Adding bar:', barData);
    // TODO: Call API to add bar
    setShowAddBar(false);
  };

  return (
    <>
      <MapView onAddBar={() => setShowAddBar(true)} />
      <AddBarModal
        isOpen={showAddBar}
        onClose={() => setShowAddBar(false)}
        onSave={handleAddBar}
      />
    </>
  );
}
