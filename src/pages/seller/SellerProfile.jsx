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
    lng: null
  });

  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  useEffect(() => {
    (async () => {
      setFetchingProfile(true);
      try {
        const res = await api.get("/seller/profile");
        const data = res.data || {};

        setProfile({
          shopName: data.shopName || "",
          ownerName: data.ownerName || "",
          address: data.address || "",
          lat: data.lat || null,
          lng: data.lng || null
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
    <div className="dark:text-black dark:bg-gray-800 max-w-4xl mx-auto bg-white p-6 shadow rounded-lg space-y-4">
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

      {/* Map Preview + Detect Button */}
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
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button onClick={saveProfile} loading={loading}>
          Save Profile
        </Button>
      </div>
    </div>
  );
}