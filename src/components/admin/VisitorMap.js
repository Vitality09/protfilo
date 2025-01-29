import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const VisitorMap = ({ visitors }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(null);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Initialize map only once
      mapInstanceRef.current = L.map(mapRef.current).setView([20, 0], 2);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapInstanceRef.current);

      // Style the map for dark theme
      const mapContainer = document.querySelector('#visitor-map');
      if (mapContainer) {
        mapContainer.style.filter = 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(85%)';
      }

      // Initialize marker cluster group
      markersRef.current = L.markerClusterGroup();
      mapInstanceRef.current.addLayer(markersRef.current);
    }

    // Clear existing markers
    if (markersRef.current) {
      markersRef.current.clearLayers();
    }

    // Add markers for visitors
    visitors.forEach(visitor => {
      if (visitor.latitude && visitor.longitude) {
        const marker = L.marker([visitor.latitude, visitor.longitude]);
        const popupContent = `
          <div class="p-2">
            <h3 class="font-bold">${visitor.country || 'Unknown'}</h3>
            <p class="text-sm text-gray-600">${visitor.city || 'Unknown City'}</p>
            <p class="text-xs text-gray-500">Visited: ${new Date(visitor.timestamp).toLocaleString()}</p>
          </div>
        `;
        marker.bindPopup(popupContent);
        markersRef.current.addLayer(marker);
      }
    });

    // Add a legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      div.innerHTML = `
        <div style="
          background: rgba(33, 33, 33, 0.8);
          color: white;
          padding: 10px;
          border-radius: 5px;
          font-size: 12px;
        ">
          <div style="margin-bottom: 5px;">
            <span style="
              display: inline-block;
              width: 12px;
              height: 12px;
              background: #8B5CF6;
              border-radius: 50%;
              margin-right: 5px;
            "></span>
            Visitor Location
          </div>
          <div>Total Visitors: ${visitors.length}</div>
        </div>
      `;
      return div;
    };
    legend.addTo(mapInstanceRef.current);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [visitors]);

  return (
    <div className="admin-card">
      <h3 className="text-xl font-bold mb-4">Visitor Locations</h3>
      <div 
        ref={mapRef} 
        id="visitor-map" 
        className="w-full h-[500px] rounded-lg overflow-hidden"
        style={{ background: '#1a1a1a' }}
      />
      <div className="mt-4 text-sm text-gray-400">
        Data source: OpenStreetMap | Map updates in real-time
      </div>
    </div>
  );
};

export default VisitorMap;
