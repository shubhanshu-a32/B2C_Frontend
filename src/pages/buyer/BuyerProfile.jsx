import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import ProfileSkeleton from "../../components/ui/preloaders/ProfileSkeleton";

export default function BuyerProfile() {
  const authUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [profile, setProfile] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    addressMobile: "",
    mobileOption: "same", // 'same' | 'different'
    lat: null,
    lng: null,
    addresses: []
  });
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [deliveryLocations, setDeliveryLocations] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");

  useEffect(() => {
    // Fetch locations dynamically
    api.get("/location")
      .then((res) => setDeliveryLocations(res.data))
      .catch((err) => console.error("Failed to load locations", err));
  }, []);

  useEffect(() => {
    (async () => {
      setFetchingProfile(true);
      try {
        const res = await api.get("/buyer/profile");
        const data = res.data || {};
        setProfile((p) => ({
          ...p,
          fullName: data.fullName || data.full_name || p.fullName,
          address: data.address || p.address,
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          addressMobile: data.addressMobile || "",
          mobileOption: data.addressMobile ? "different" : "same",
          lat: data.lat ?? p.lat,
          lng: data.lng ?? p.lng,
          addresses: data.addresses || p.addresses || []
        }));
      } catch (err) {
        console.error("Failed to load buyer profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setFetchingProfile(false);
      }
    })();
  }, []);



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
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        mobile: profile.mobileOption === "different" ? profile.addressMobile : "",
        lat: profile.lat,
        lng: profile.lng
      });
      const data = res.data || {};
      setProfile((p) => ({
        ...p,
        fullName: data.fullName || p.fullName,
        address: data.address || p.address,
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        addressMobile: data.addressMobile || "",
        mobileOption: data.addressMobile ? "different" : "same",
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



  if (!authUser || fetchingProfile) return <div className="p-6"><ProfileSkeleton /></div>;

  return (
    <div className="dark:text-gray-100 max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
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
        <label className="text-sm font-semibold">WhatsApp Number</label>
        <input
          value={authUser.mobile || ""}
          readOnly
          className="w-full border p-2 rounded mt-1 bg-gray-100 dark:bg-gray-600 cursor-not-allowed dark:text-gray-100"
        />
        <p className="text-xs text-gray-500 mt-1">This number cannot be changed.</p>
      </div>

      <div>
        <label className="text-sm font-semibold">Full address (House No, Building, Street)</label>
        <textarea
          value={profile.address || ""}
          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          className="w-full border p-2 rounded mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
      </div>

      {/* New Fields */}
      {/* New Fields - Restricted Location Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold">Select Delivery Area *</label>
          <select
            value={selectedArea}
            onChange={(e) => {
              const areaName = e.target.value;
              setSelectedArea(areaName);
              const selected = deliveryLocations.find(l => l.area === areaName);
              if (selected) {
                setProfile({
                  ...profile,
                  city: selected.district, // Katni
                  state: selected.state,
                  pincode: selected.pincode,
                });
              }
            }}
            className="w-full border p-2 rounded mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="">-- Choose a Delivery Location --</option>
            {deliveryLocations.map((loc) => (
              <option key={loc.area} value={loc.area}>
                {loc.area} ({loc.pincode})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Delivery is currently limited to specific locations in Katni.</p>
        </div>

        <div>
          <label className="text-sm font-semibold">City (District)</label>
          <input
            value={profile.city || ""}
            readOnly
            className="w-full border p-2 rounded mt-1 bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">State</label>
          <input
            value={profile.state || ""}
            readOnly
            className="w-full border p-2 rounded mt-1 bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Pincode</label>
          <input
            value={profile.pincode || ""}
            readOnly
            className="w-full border p-2 rounded mt-1 bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
          />
        </div>
      </div>





      {/* {profile.lat && profile.lng && (
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
      )} */}

      <div>
        <h3 className="font-semibold">Saved addresses</h3>
        <ul className="mt-2 space-y-2">
          {(!profile.addresses || profile.addresses.length === 0) ? (
            <li className="text-gray-500">No addresses found</li>
          ) : (
            profile.addresses.map((a, idx) => (
              <li key={idx} className="bg-gray-50 dark:bg-gray-700 p-3 rounded break-words">
                {typeof a === 'string' ? a : `${a.addressLine}, ${a.city} ${a.state} ${a.pincode}`}
              </li>
            ))
          )}
        </ul>
      </div>



      <div className="flex justify-end mt-6 pt-6 border-t dark:border-gray-700">
        <button onClick={saveProfile} disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full sm:w-auto font-semibold shadow-md">
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}


