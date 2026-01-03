import { useEffect, useState } from "react";
import api from "../../services/api";
import MapPreview from "../../components/MapPreview";
import Button from "../../components/ui/Button";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import ProfileSkeleton from "../../components/ui/preloaders/ProfileSkeleton";

export default function SellerProfile() {
  const { user } = useAuthStore();

  const [profile, setProfile] = useState({
    shopName: "",
    ownerName: "",
    address: "",
    lat: null,
    lng: null,
    pincode: "",
    area: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [deliveryLocations, setDeliveryLocations] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");

  useEffect(() => {
    (async () => {
      setFetchingProfile(true);
      try {
        const res = await api.get("/seller/profile");
        const locRes = await api.get("/location");
        const locations = locRes.data || [];
        setDeliveryLocations(locations);

        const data = res.data || {};

        // If we have a saved area, set the dropdown
        if (data.area) {
          setSelectedArea(data.area);
        }

        setProfile({
          shopName: data.shopName || "",
          ownerName: data.ownerName || "",
          address: data.address || "",
          lat: data.lat || null,
          lng: data.lng || null,
          pincode: data.pincode || "",
          area: data.area || ""
        });
      } catch (err) {
        console.error("Failed to load seller profile", err);
        toast.error("Failed to load seller profile");
      } finally {
        setFetchingProfile(false);
      }
    })();
  }, []);

  // Detect location & reverse-geocode
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        setProfile((existing) => ({
          ...existing,
          lat: latitude,
          lng: longitude
        }));

        try {
          const res = await api.get("/location/reverse", {
            params: { lat: latitude, lng: longitude }
          });

          setProfile((existing) => ({
            ...existing,
            address: res.data.address
          }));

          toast.success("Location detected");
        } catch (err) {
          console.error("Reverse geocode error:", err);
          toast.error("Failed to fetch formatted address");
        }
      },
      (err) => {
        toast.error("Unable to fetch location: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Save seller profile
  const saveProfile = async () => {
    setLoading(true);
    try {
      const res = await api.put("/seller/profile", profile);
      setProfile(res.data);
      useAuthStore.getState().setUser(res.data);
      toast.success("Profile updated");
    } catch (err) {
      console.error("Save profile error:", err);
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) return <div className="p-6"><ProfileSkeleton /></div>;

  return (
    <div className="dark:text-black dark:bg-gray-800 max-w-7xl mx-auto bg-white p-8 lg:p-10 shadow-lg rounded-xl space-y-6">
      <h2 className="dark:text-white text-2xl font-bold">Seller Profile</h2>

      {/* Shop Name */}
      <div>
        <label className="dark:text-white text-sm font-semibold">Shop / Business Name</label>
        <input
          value={profile.shopName}
          onChange={(e) =>
            setProfile({ ...profile, shopName: e.target.value })
          }
          className="w-full dark:bg-gray-800 dark:text-white border p-2 rounded mt-1"
        />
      </div>

      {/* Owner Name */}
      <div>
        <label className="dark:text-white text-sm font-semibold">Owner Full Name</label>
        <input
          value={profile.ownerName}
          onChange={(e) =>
            setProfile({ ...profile, ownerName: e.target.value })
          }
          className="w-full dark:bg-gray-800 dark:text-white border p-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="dark:text-white text-sm font-semibold">Registered Mobile Number</label>
        <input
          value={user?.mobile || ""}
          readOnly
          className="w-full border p-2 rounded mt-1 bg-gray-100 dark:bg-gray-700 cursor-not-allowed dark:text-gray-300"
        />
        <p className="text-xs text-gray-500 mt-1">This number cannot be changed.</p>
      </div>

      {/* Location Dropdown */}
      <div>
        <label className="dark:text-white text-sm font-semibold">Select Location *</label>
        <select
          value={selectedArea}
          onChange={(e) => {
            const areaName = e.target.value;
            setSelectedArea(areaName);
            const selected = deliveryLocations.find((l) => l.area === areaName);
            if (selected) {
              setProfile((prev) => ({
                ...prev,
                city: selected.district,
                state: selected.state,
                pincode: selected.pincode,
                area: selected.area, // Ensure area is set
                address: prev.address ? `${prev.address} (${selected.area}, ${selected.pincode})` : `${selected.area}, ${selected.district}, ${selected.state} - ${selected.pincode}`
              }));
            }
          }}
          className="w-full dark:bg-gray-800 dark:text-white border p-2 rounded mt-1"
        >
          <option value="">-- Choose Location --</option>
          {deliveryLocations.map((loc) => (
            <option key={loc._id} value={loc.area}>
              {loc.area} ({loc.pincode})
            </option>
          ))}
        </select>
      </div>

      {/* Address */}
      {/* Address */}
      <div>
        <label className="dark:text-white text-sm font-semibold">Address (full address)</label>
        <textarea
          value={profile.address}
          onChange={(e) =>
            setProfile({ ...profile, address: e.target.value })
          }
          className="w-full dark:bg-gray-800 dark:text-white border p-2 rounded mt-1"
        />
      </div>

      {/* Map Preview + Detect Button
      <div className="flex items-start gap-4">
        <div>
          <div className="dark:text-white text-sm font-semibold mb-2">Shop location preview</div>
          <MapPreview lat={profile.lat} lng={profile.lng} />
        </div>

        <div className="flex dark:bg-gray-800 dark:text-white flex-col gap-2">
          <Button onClick={detectLocation}>Detect my location</Button>
          <div className="dark:text-white text-sm text-gray-500">
            When buyers view your shop, they can open the location directly in Google Maps.
          </div>
        </div>
      </div> */}

      {/* Save Button */}
      <div className="flex gap-3">
        <Button onClick={saveProfile} loading={loading}>
          Save Profile
        </Button>
      </div>
    </div>
  );
}