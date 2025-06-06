// src/components/MapSection.tsx
import { getStateConfig } from '../../config/stateConfigs';

export function MapSection() {
  const stateConfig = getStateConfig('KA');
  
  return (
    <div className="w-full max-w-xl">
      <img
        src={stateConfig.mapUrl || "src/assets/Map.svg"}
        alt={`${stateConfig.stateName} Region Map`}
        width={800}
        height={600}
        className="w-full h-auto"
        loading="lazy"
      />
    </div>
  );
}



  