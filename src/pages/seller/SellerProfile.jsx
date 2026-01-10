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
    area: "",
    gstNumber: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      ifscCode: ""
    }
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
          area: data.area || "",
          gstNumber: data.gstNumber || "",
          bankDetails: {
            accountName: data.bankDetails?.accountName || "",
            accountNumber: data.bankDetails?.accountNumber || "",
            bankName: data.bankDetails?.bankName || "",
            ifscCode: data.bankDetails?.ifscCode || ""
          }
        });
      } catch (err) {
        console.error("Failed to load seller profile", err);
        toast.error("Failed to load seller profile");
      } finally {
        setFetchingProfile(false);
      }
    })();
  }, []);

  // Detect location
  const [lastDetectTime, setLastDetectTime] = useState(0);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by this browser.");
      return;
    }

    const now = Date.now();
    if (now - lastDetectTime < 10000) {
      const remaining = Math.ceil((10000 - (now - lastDetectTime)) / 1000);
      toast.error(`Please wait ${remaining}s before detecting again.`);
      return;
    }

    setLastDetectTime(now);

    const handleSuccess = (pos) => {
      const { latitude, longitude } = pos.coords;
      setProfile((existing) => ({
        ...existing,
        lat: latitude,
        lng: longitude,
        // Reset address if you want to force reverse geocoding or keep it? 
        // User didn't ask to clear address, but fresh coords are key.
      }));
      toast.success("Location coordinates detected");
    };

    const handleError = (err) => {
      console.warn("High accuracy location failed, retrying with low accuracy...", err);
      // Fallback: Try with low accuracy and longer timeout
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        (finalErr) => {
          toast.error("Unable to fetch location: " + finalErr.message);
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 0 }
      );
    };

    // First attempt: High Accuracy, Fresh (maximumAge: 0)
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Save seller profile
  const saveProfile = async () => {
    setLoading(true);
    try {
      const res = await api.put("/seller/profile", profile);
      const data = res.data || {};

      // Merge response while ensuring structure exists
      setProfile(prev => ({
        ...prev,
        ...data,
        bankDetails: {
          accountName: data.bankDetails?.accountName || prev.bankDetails?.accountName || "",
          accountNumber: data.bankDetails?.accountNumber || prev.bankDetails?.accountNumber || "",
          bankName: data.bankDetails?.bankName || prev.bankDetails?.bankName || "",
          ifscCode: data.bankDetails?.ifscCode || prev.bankDetails?.ifscCode || ""
        }
      }));

      useAuthStore.getState().setUser(data);
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
    <div className="dark:text-black dark:bg-gray-800 max-w-7xl mx-auto bg-white p-4 sm:p-6 lg:p-8 shadow-lg rounded-xl space-y-6">
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

      {/* Business & Banking Section */}
      <div className="border-t dark:border-gray-700 pt-6">
        <h3 className="text-lg font-bold dark:text-gray-200 mb-4">Business & Banking Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GSTIN */}
          <div>
            <label className="dark:text-white text-sm font-semibold">GSTIN</label>
            <input
              value={profile.gstNumber}
              onChange={(e) =>
                setProfile({ ...profile, gstNumber: e.target.value.toUpperCase() })
              }
              placeholder="e.g. 29ABCDE1234F1Z5"
              className="w-full dark:bg-gray-800 dark:text-white border p-2 rounded mt-1 uppercase"
            />
          </div>

          {/* Bank Account Name */}
          <div>
            <label className="dark:text-white text-sm font-semibold">Account Holder Name</label>
            <input
              value={profile.bankDetails?.accountName || ""}
              onChange={(e) =>
                setProfile({ ...profile, bankDetails: { ...profile.bankDetails, accountName: e.target.value } })
              }
              className="w-full dark:bg-gray-800 dark:text-white border p-2 rounded mt-1"
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="dark:text-white text-sm font-semibold">Account Number</label>
            <input
              value={profile.bankDetails?.accountNumber || ""}
              onChange={(e) =>
                setProfile({ ...profile, bankDetails: { ...profile.bankDetails, accountNumber: e.target.value } })
              }
              className="w-full dark:bg-gray-800 dark:text-white border p-2 rounded mt-1"
            />
          </div>

          {/* Bank Name */}
          <div>
            <label className="dark:text-white text-sm font-semibold">Bank Name</label>
            <input
              value={profile.bankDetails?.bankName || ""}
              onChange={(e) =>
                setProfile({ ...profile, bankDetails: { ...profile.bankDetails, bankName: e.target.value } })
              }
              className="w-full dark:bg-gray-800 dark:text-white border p-2 rounded mt-1"
            />
          </div>

          {/* IFSC Code */}
          <div>
            <label className="dark:text-white text-sm font-semibold">IFSC Code</label>
            <input
              value={profile.bankDetails?.ifscCode || ""}
              onChange={(e) =>
                setProfile({ ...profile, bankDetails: { ...profile.bankDetails, ifscCode: e.target.value.toUpperCase() } })
              }
              placeholder="e.g. SBIN0001234"
              className="w-full dark:bg-gray-800 dark:text-white border p-2 rounded mt-1 uppercase"
            />
          </div>
        </div>
      </div>

      {/* Map Preview + Detect Button */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <div className="dark:text-white text-sm font-semibold">Shop location preview</div>
            <p className="dark:text-gray-400 text-xs text-gray-500 mt-1">
              When buyers view your shop, they can open the location directly in Google Maps.
            </p>
          </div>
          <Button onClick={detectLocation}>Detect my location</Button>
        </div>

        <MapPreview
          lat={profile.lat}
          lng={profile.lng}
          className="w-full h-64 rounded-xl overflow-hidden shadow-sm border dark:border-gray-700"
        />
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