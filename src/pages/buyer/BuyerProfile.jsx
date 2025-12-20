import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

export default function BuyerProfile() {
  const authUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [profile, setProfile] = useState({ fullName: "", address: "", lat: null, lng: null, addresses: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/buyer/profile");
        const data = res.data || {};
        setProfile((p) => ({
          ...p,
          fullName: data.fullName || data.full_name || p.fullName,
          address: data.address || p.address,
          lat: data.lat ?? p.lat,
          lng: data.lng ?? p.lng,
          addresses: data.addresses || p.addresses || []
        }));
      } catch (err) {
        console.error("Failed to load buyer profile:", err);
        toast.error("Failed to load profile");
      }
    })();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setProfile((p) => ({ ...p, lat: latitude, lng: longitude }));
        try {
          const r = await api.get("/location/reverse", { params: { lat: latitude, lng: longitude } });
          if (r.data?.address) {
            setProfile((p) => ({ ...p, address: r.data.address }));
            toast.success("Location detected");
          } else {
            toast.success("Coordinates detected — edit address if needed");
          }
        } catch (err) {
          console.error("Reverse geocode:", err);
          toast.error("Reverse geocode failed");
        }
      },
      (err) => {
        toast.error("Unable to get location: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const saveProfile = async () => {
    if (!profile.fullName?.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const res = await api.put("/buyer/profile", {
        fullName: profile.fullName,
        address: profile.address,
        lat: profile.lat,
        lng: profile.lng
      });
      const data = res.data || {};
      setProfile((p) => ({
        ...p,
        fullName: data.fullName || p.fullName,
        address: data.address || p.address,
        lat: data.lat ?? p.lat,
        lng: data.lng ?? p.lng,
        addresses: data.addresses || p.addresses
      }));
      // Also update auth store so dashboards show the latest fullName
      setUser({
        ...authUser,
        fullName: data.fullName || profile.fullName,
      });
      toast.success("Profile updated");
    } catch (err) {
      console.error("saveProfile error:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to save profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (addr) => {
    if (!addr?.trim()) {
      toast.error("Address cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const res = await api.put("/buyer/profile", { address: addr });
      const data = res.data || {};
      setProfile((p) => ({ ...p, addresses: data.addresses || [addr, ...p.addresses] }));
      toast.success("Address saved");
    } catch (err) {
      console.error("saveAddress error:", err);
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  if (!authUser) return <div className="p-6">Loading user...</div>;

  return (
    <div className="dark:text-gray-100 max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Welcome {authUser.fullName || "Buyer"}
        </p>
      </div>

      <div>
        <label className="text-sm font-semibold">Full name</label>
        <input
          value={profile.fullName || ""}
          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
          className="w-full border p-2 rounded mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Full address</label>
        <textarea
          value={profile.address || ""}
          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          className="w-full border p-2 rounded mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={detectLocation} className="px-4 py-2 bg-blue-600 text-white rounded">Detect my location</button>
        <button onClick={saveProfile} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {profile.lat && profile.lng && (
        <div className="w-48 h-32 rounded overflow-hidden border">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${profile.lat},${profile.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              alt="map preview"
              src={
                process.env.REACT_APP_GOOGLE_STATIC_MAP_KEY
                  ? `https://maps.googleapis.com/maps/api/staticmap?center=${profile.lat},${profile.lng}&zoom=16&size=400x200&markers=color:red%7C${profile.lat},${profile.lng}&key=${process.env.REACT_APP_GOOGLE_STATIC_MAP_KEY}`
                  : `https://via.placeholder.com/400x200?text=Map`
              }
              className="w-full h-full object-cover"
            />
          </a>
        </div>
      )}

      <div>
        <h3 className="font-semibold">Saved addresses</h3>
        <ul className="mt-2 space-y-2">
          {(!profile.addresses || profile.addresses.length === 0) ? (
            <li className="text-gray-500">No addresses found</li>
          ) : (
            profile.addresses.map((a, idx) => (
              <li key={idx} className="bg-gray-50 dark:bg-gray-700 p-3 rounded break-words">{a}</li>
            ))
          )}
        </ul>
      </div>

      <div>
        <label className="text-sm font-semibold">Add quick address</label>
        <QuickAddressInput onSave={addAddress} />
      </div>
    </div>
  );
}

function QuickAddressInput({ onSave }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex gap-2 mt-2">
      <input value={val} onChange={(e) => setVal(e.target.value)} className="flex-1 border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
      <button onClick={() => { onSave(val); setVal(""); }} className="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
    </div>
  );
}
