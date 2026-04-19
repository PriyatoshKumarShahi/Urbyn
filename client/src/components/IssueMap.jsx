import { Fragment, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

const createLabelIcon = (issue) =>
  L.divIcon({
    className: '',
    html: `<div class="marker-label">➜ ${issue.title}<br/><span style="font-weight:600">by ${issue.createdBy?.name || issue.reporterName}</span></div>`,
    iconSize: [150, 46],
    iconAnchor: [12, 12]
  });

export default function IssueMap({ issues }) {
  const center = useMemo(() => {
    if (!issues.length) return [28.6677, 77.4538];
    return [issues[0].location.coordinates[1], issues[0].location.coordinates[0]];
  }, [issues]);

  return (
    <div className="h-[560px]">
      <MapContainer center={center} zoom={13} scrollWheelZoom className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {issues.map((issue) => {
          const lat = issue.location.coordinates[1];
          const lng = issue.location.coordinates[0];
          const color = issue.status === 'resolved' ? '#22c55e' : issue.status === 'in-progress' ? '#facc15' : '#fb7185';
          return (
            <Fragment key={issue._id}>
              <CircleMarker key={`${issue._id}-circle`} center={[lat, lng]} radius={10 + (issue.hotspotWeight || 1)} pathOptions={{ color, fillColor: color, fillOpacity: 0.35 }} />
              <Marker key={issue._id} position={[lat, lng]} icon={createLabelIcon(issue)}>
                <Popup>
                  <div className="space-y-1">
                    <div className="font-black">{issue.title}</div>
                    <div className="text-xs">Creator: {issue.createdBy?.name || issue.reporterName}</div>
                    <div className="text-xs">Area: {issue.areaName || issue.addressText}</div>
                    <Link to={`/issues/${issue._id}`} className="font-bold underline">Open issue</Link>
                  </div>
                </Popup>
              </Marker>
            </Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
