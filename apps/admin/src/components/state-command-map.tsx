import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { Layers, MapPin, AlertTriangle, ShieldCheck, Flame } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import type { CorporationTelemetry, DigitalTwinIncident } from "@/services/types";
import { cn } from "@/lib/utils";

interface StateCommandMapProps {
  corporations: CorporationTelemetry[];
  incidents: DigitalTwinIncident[];
  activeLayers: Record<string, boolean>;
  selectedCity: string | null;
  onSelectCity: (city: string) => void;
  className?: string;
}

export function StateCommandMap({
  corporations,
  incidents,
  activeLayers,
  selectedCity,
  onSelectCity,
  className,
}: StateCommandMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const markersRef = useRef<Leaflet.LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let mapInstance: Leaflet.Map | null = null;

    import("leaflet").then((L) => {
      if (!containerRef.current || mapRef.current) return;

      // Center on Maharashtra (approx 19.5, 76.0)
      mapInstance = L.map(containerRef.current, {
        center: [19.3, 76.0],
        zoom: 7,
        minZoom: 6,
        maxZoom: 14,
        zoomControl: true,
      });

      // CartoDB Positron / OpenStreetMap basemap
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(mapInstance);

      markersRef.current = L.layerGroup().addTo(mapInstance);
      mapRef.current = mapInstance;
      setMapReady(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map markers when data, layers, or selected city changes
  useEffect(() => {
    if (!mapReady || !mapRef.current || !markersRef.current) return;

    import("leaflet").then((L) => {
      if (!markersRef.current) return;
      markersRef.current.clearLayers();

      // 1. Plot Municipal Corporations
      if (activeLayers.active_work_orders !== false) {
        corporations.forEach((corp) => {
          const isSelected = selectedCity === corp.city;
          const radius = Math.max(8, Math.min(22, corp.active_cases / 250));

          const circle = L.circleMarker([corp.lat, corp.lng], {
            radius,
            color: isSelected ? "#FF6F00" : "#0A369D",
            weight: isSelected ? 3 : 1.5,
            fillColor: isSelected ? "#FF6F00" : "#0A369D",
            fillOpacity: 0.65,
          });

          circle.bindPopup(`
            <div style="font-family: sans-serif; min-width: 200px; padding: 4px;">
              <h4 style="margin: 0 0 4px; font-size: 13px; font-weight: bold;">${corp.name}</h4>
              <p style="margin: 0 0 4px; font-size: 11px; color: #666;">Division: ${corp.division}</p>
              <div style="font-size: 11px; line-height: 1.5;">
                <strong>Active Cases:</strong> ${corp.active_cases.toLocaleString()}<br/>
                <strong>Resolution Rate:</strong> ${corp.resolved_rate}%<br/>
                <strong>Taxpayer Savings:</strong> ₹${corp.taxpayer_savings_cr} Cr
              </div>
            </div>
          `);

          circle.on("click", () => {
            onSelectCity(corp.city);
          });

          markersRef.current?.addLayer(circle);
        });
      }

      // 2. Plot Critical Incidents / Collapse Perimeters
      if (activeLayers.critical_cascades !== false) {
        incidents.forEach((inc) => {
          const pulseIcon = L.divIcon({
            className: "custom-pulse-marker",
            html: `
              <div style="
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #F43F5E;
                border: 2px solid white;
                box-shadow: 0 0 12px #F43F5E;
                animation: pulse 1.5s infinite;
              "></div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          const marker = L.marker([inc.lat, inc.lng], { icon: pulseIcon });

          marker.bindPopup(`
            <div style="font-family: sans-serif; min-width: 220px; padding: 4px;">
              <span style="display:inline-block; padding: 2px 6px; font-size: 9px; font-weight: bold; background: #FFE4E6; color: #BE123C; border-radius: 4px;">
                ${inc.severity} (${inc.priority})
              </span>
              <h4 style="margin: 4px 0; font-size: 12px; font-weight: bold; color: #111;">${inc.title}</h4>
              <p style="margin: 0 0 4px; font-size: 10px; color: #666;">${inc.location} (${inc.city})</p>
              <div style="font-size: 11px; line-height: 1.4;">
                <strong>Affected Population:</strong> ${inc.affected_citizens.toLocaleString()}<br/>
                <strong>Cost Escalation Multiplier:</strong> ${inc.cost_multiplier}x<br/>
                <strong>Departments:</strong> ${inc.departments.join(", ")}
              </div>
            </div>
          `);

          markersRef.current?.addLayer(marker);

          // 3. Risk Perimeter Circle
          if (activeLayers.risk_perimeters !== false) {
            const riskCircle = L.circle([inc.lat, inc.lng], {
              radius: inc.impact_radius_km * 1000,
              color: "#FF6F00",
              weight: 1.5,
              dashArray: "4, 6",
              fillColor: "#FF6F00",
              fillOpacity: 0.12,
            });
            markersRef.current?.addLayer(riskCircle);
          }
        });
      }
    });
  }, [mapReady, corporations, incidents, activeLayers, selectedCity, onSelectCity]);

  // Recenter if city selected
  useEffect(() => {
    if (!mapReady || !mapRef.current || !selectedCity) return;
    const corp = corporations.find((c) => c.city.toLowerCase() === selectedCity.toLowerCase());
    if (corp) {
      mapRef.current.setView([corp.lat, corp.lng], 10, { animate: true });
    }
  }, [selectedCity, mapReady, corporations]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-[480px] rounded-3xl overflow-hidden border border-border/60 shadow-xl bg-surface/50 z-0",
        className
      )}
    />
  );
}
