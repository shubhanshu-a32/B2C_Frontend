export default function MapPreview({ lat, lng, address, className = "w-72 h-40 rounded overflow-hidden", zoom = 15 }) {
  if ((!lat || !lng) && !address) return <div className={`${className} bg-gray-100 flex items-center justify-center text-sm text-gray-500`}>No location</div>;

  let embedSrc;
  let openUrl;

  if (lat && lng) {
    embedSrc = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
    openUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  } else {
    // Fallback to address
    const safeAddress = encodeURIComponent(address);
    embedSrc = `https://maps.google.com/maps?q=${safeAddress}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
    openUrl = `https://www.google.com/maps/search/?api=1&query=${safeAddress}`;
  }

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