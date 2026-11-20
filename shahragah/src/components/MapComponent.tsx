import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { UrbanIssue, PriorityLevel } from '../types';
import { Eye, MapPin, Layers, Radio, AlertTriangle } from 'lucide-react';

// Custom SVG Icons for Leaflet markers based on priority
const createCustomIcon = (priority: PriorityLevel, reportsCount: number, isPulsing: boolean) => {
  let bgColor = '#75847B';
  if (priority === 'critical') {
    bgColor = '#D97852';
  } else if (priority === 'high') {
    bgColor = '#D5AA59';
  } else if (priority === 'medium') {
    bgColor = '#789184';
  }

  const pulseHtml = isPulsing 
    ? `<span class="absolute -inset-2 rounded-full animate-ping opacity-75" style="background-color: ${bgColor}"></span>`
    : '';

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group" style="width: 44px; height: 44px;">
      ${pulseHtml}
      <div class="relative flex items-center justify-center text-white rounded-full shadow-lg transition-transform transform group-hover:scale-110" 
           style="background-color: ${bgColor}; width: 34px; height: 34px; border: 2.5px solid #FAF9F5; box-shadow: 0 4px 10px rgba(0,0,0,0.25);">
        <span class="text-xs font-bold leading-none">${reportsCount}</span>
      </div>
      <div class="absolute -bottom-1 w-2 h-2 rotate-45" style="background-color: ${bgColor};"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [44, 44],
    iconAnchor: [22, 40],
    popupAnchor: [0, -38],
  });
};

// Component to handle programmatic map pan/zoom
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.4,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);
  return null;
};

interface MapComponentProps {
  issuesToShow?: UrbanIssue[];
  interactiveMode?: 'admin' | 'citizen';
  heightClass?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  issuesToShow, 
  interactiveMode = 'admin',
  heightClass = 'h-[520px]' 
}) => {
  const { 
    filteredIssues, 
    mapCenter, 
    mapZoom, 
    openIssueDetails, 
    scenario, 
    flyToLocation 
  } = useApp();

  const [useOfflineFallback, setUseOfflineFallback] = useState<boolean>(false);
  const [tileError, setTileError] = useState<boolean>(false);

  const displayIssues = issuesToShow || filteredIssues;

  return (
    <div className={`relative w-full ${heightClass} rounded-card overflow-hidden border border-borderMuted shadow-sm bg-ivory-warm`}>
      {/* Map Control Bar Overlay */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 bg-ivory-surface/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-borderMuted shadow-sm text-xs font-semibold text-darkText">
        <span className="flex items-center gap-1.5 font-normal">
          <Layers className="w-3.5 h-3.5 text-forest" />
          <span>نقشه:</span>
        </span>
        <button
          onClick={() => {
            setUseOfflineFallback(false);
            setTileError(false);
          }}
          className={`px-2 py-0.5 rounded transition-colors ${!useOfflineFallback ? 'bg-forest text-white' : 'text-slateGreen hover:text-darkText'}`}
        >
          OpenStreetMap
        </button>
        <button
          onClick={() => setUseOfflineFallback(true)}
          className={`px-2 py-0.5 rounded transition-colors ${useOfflineFallback ? 'bg-forest text-white' : 'text-slateGreen hover:text-darkText'}`}
        >
          وکتور شماتیک (آفلاین)
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-ivory-surface/95 backdrop-blur-sm p-3 rounded-lg border border-borderMuted shadow-sm text-xs text-darkText hidden sm:block">
        <div className="font-semibold text-forest mb-2 flex items-center gap-1">
          <Radio className="w-3 h-3 text-forest animate-pulse" />
          راهنمای نقشه شهرآگاه
        </div>
        <div className="space-y-1.5 font-normal">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-terracotta inline-block border border-white"></span>
            <span>بحرانی (نیازمند اقدام فوری)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber inline-block border border-white"></span>
            <span>بالا (اولویت دوم)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-mutedGreen inline-block border border-white"></span>
            <span>متوسط و عادی</span>
          </div>
          <div className="text-[10px] text-slateGreen pt-1 border-t border-borderMuted mt-1">
            * عدد داخل نشانگر: تعداد گزارش‌های تجمیع‌شده
          </div>
        </div>
      </div>

      {/* Main Map or Fallback Canvas */}
      {!useOfflineFallback && !tileError ? (
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
          attributionControl={false}
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            eventHandlers={{
              tileerror: () => {
                setTileError(true);
              },
            }}
          />

          {displayIssues.map((issue) => {
            const isHotspot = Boolean(issue.isCriticalHotspot && scenario.isActive);
            const icon = createCustomIcon(issue.priority, issue.reportsCount, isHotspot);

            return (
              <Marker
                key={issue.id}
                position={[issue.lat, issue.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    flyToLocation(issue.lat, issue.lng, 15);
                  },
                }}
              >
                <Popup className="shahragah-popup">
                  <div className="p-1 min-w-[220px] text-right font-sans" dir="rtl">
                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-borderMuted mb-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded text-white" 
                            style={{ backgroundColor: issue.priority === 'critical' ? '#D97852' : issue.priority === 'high' ? '#D5AA59' : '#789184' }}>
                        {issue.priorityTitle}
                      </span>
                      <span className="text-[11px] text-slateGreen">{issue.districtName}</span>
                    </div>

                    <h4 className="font-semibold text-xs text-darkText mb-1.5 leading-snug">
                      {issue.title}
                    </h4>

                    <div className="text-[11px] text-slateGreen mb-2 flex items-center gap-1 font-normal">
                      <MapPin className="w-3 h-3 text-terracotta shrink-0" />
                      <span className="truncate">{issue.locationName}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] bg-ivory-warm p-1.5 rounded mb-2.5">
                      <span className="text-slateGreen font-normal">گزارش‌های مردمی:</span>
                      <span className="font-bold text-forest">{issue.reportsCount} گزارش</span>
                    </div>

                    <button
                      onClick={() => openIssueDetails(issue.id)}
                      className="w-full flex items-center justify-center gap-1 py-1.5 px-3 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {interactiveMode === 'admin' ? 'مشاهده جزئیات و ارجاع' : 'مشاهده اطلاعات مسئله'}
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      ) : (
        /* Stylized Vector Grid Fallback for Offline / Safe Mode */
        <div className="relative w-full h-full bg-[#EAE7DC] overflow-hidden flex flex-col justify-between">
          {/* Subtle Tehran Grid & District Outlines */}
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#75847B" strokeWidth="0.5" strokeDasharray="2,2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <path d="M 50 180 Q 400 190 950 170" fill="none" stroke="#B85E39" strokeWidth="3" opacity="0.4" />
            <path d="M 50 290 Q 500 300 950 280" fill="none" stroke="#203B35" strokeWidth="4" opacity="0.5" />
            <path d="M 280 40 L 290 500" fill="none" stroke="#789184" strokeWidth="3" opacity="0.5" />
            <path d="M 520 20 L 510 520" fill="none" stroke="#789184" strokeWidth="4" opacity="0.5" />
            <path d="M 720 50 L 730 480" fill="none" stroke="#789184" strokeWidth="3" opacity="0.4" />
          </svg>

          {/* District Labels */}
          <div className="absolute top-14 left-1/4 text-xs font-semibold text-slateGreen/60 select-none">منطقه ۲ (صادقیه - گیشا)</div>
          <div className="absolute top-8 right-1/4 text-xs font-semibold text-slateGreen/60 select-none">منطقه ۱ (تجریش - شمیران)</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-slateGreen/60 select-none">منطقه ۶ (ولیعصر - فاطمی)</div>
          <div className="absolute bottom-12 right-1/3 text-xs font-semibold text-slateGreen/60 select-none">منطقه ۱۲ (بازار تهران)</div>

          {/* Vector Map Notification */}
          <div className="relative z-10 m-4 max-w-sm bg-white/90 p-2.5 rounded-lg border border-borderMuted shadow-sm flex items-start gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-forest">حالت نقشه وکتور شماتیک فعال است</span>
              <p className="text-slateGreen text-[11px] leading-relaxed mt-0.5 font-normal">
                تمام موقعیت‌ها و نقاط بحرانی با مختصات نسبی تهران نمایش داده می‌شوند و کاملاً تعاملی هستند.
              </p>
            </div>
          </div>

          {/* Interactive Issue Pins positioned relative to coordinates */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {displayIssues.map((issue) => {
              const topPercent = Math.max(10, Math.min(88, 100 - ((issue.lat - 35.63) / 0.18) * 100));
              const leftPercent = Math.max(10, Math.min(88, ((issue.lng - 51.28) / 0.27) * 100));

              const isHotspot = Boolean(issue.isCriticalHotspot && scenario.isActive);
              let bgColor = issue.priority === 'critical' ? '#D97852' : issue.priority === 'high' ? '#D5AA59' : '#789184';

              return (
                <div
                  key={issue.id}
                  style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  onClick={() => openIssueDetails(issue.id)}
                >
                  {isHotspot && (
                    <span 
                      className="absolute -inset-3 rounded-full animate-ping opacity-80"
                      style={{ backgroundColor: bgColor }}
                    />
                  )}
                  <div 
                    className="relative flex items-center justify-center text-white rounded-full font-bold text-xs shadow-md border-2 border-white transition-transform group-hover:scale-125"
                    style={{ backgroundColor: bgColor, width: '36px', height: '36px' }}
                  >
                    {issue.reportsCount}
                  </div>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 whitespace-nowrap bg-darkText text-white text-[10px] px-2 py-1 rounded shadow-lg font-normal">
                    {issue.title}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 text-[11px] text-slateGreen z-10 font-normal">
            * برای تعویض به نمای OpenStreetMap از دکمه بالای نقشه استفاده کنید.
          </div>
        </div>
      )}
    </div>
  );
};
