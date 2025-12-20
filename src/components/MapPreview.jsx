export default function MapPreview({ lat, lng, className = "w-72 h-40 rounded overflow-hidden", zoom = 15 }) {
  if (!lat || !lng) return <div className={`${className} bg-gray-100 flex items-center justify-center text-sm text-gray-500`}>No location</div>;

  const embedSrc = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  const openUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className={className}>
      <iframe
        title="map-preview"
        src={embedSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="mt-2">
        <a className="text-sm text-blue-600 hover:underline" href={openUrl} target="_blank" rel="noreferrer">Open in Google Maps</a>
      </div>
    </div>
  );
}