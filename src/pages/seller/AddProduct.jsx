import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import useCategoryStore from "../../store/categoryStore"; // Import store
import { Upload, X, ImageIcon } from "lucide-react";

export default function AddProduct() {
  const navigate = useNavigate();
  const { categories, fetchCategories } = useCategoryStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    stock: "",
    variant: "",
    commission: "",
    category: "",
    subcategory: "",
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /* ---------- CATEGORY LOGIC ---------- */
  // form.category is expected to be an ID for product creation
  const selectedCategory = categories.find(
    (c) => c._id === form.category
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subcategory: "" } : {}),
    }));
  };

  /* ---------- IMAGE UPLOAD ---------- */
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      setUploading(true);
      const res = await api.post(
        "/products/upload-images",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setImages((prev) => [...prev, ...(res.data.images || [])]);
      toast.success("Images uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  /* ---------- SUBMIT PRODUCT ---------- */
  const submit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.category || !form.subcategory) {
      return toast.error("All fields are required");
    }

    try {
      await api.post("/products", {
        ...form,
        price: Number(form.price),
        price: Number(form.price),
        stock: Number(form.stock),
        commission: Number(form.commission),
        images,
      });

      toast.success("Product added successfully");
      navigate("/seller/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

  const inputClass = "w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Add New Product</h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">Create a new product listing for your store.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => navigate("/seller/products")}
            className="flex-1 md:flex-none px-4 py-2 text-center text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={uploading}
            className="flex-1 md:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors text-center"
          >
            Publish Product
          </button>
        </div>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN - MAIN INFO */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">General Information</h3>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Product Title</label>
                <input
                  name="title"
                  placeholder="e.g. Vintage Leather Jacket"
                  value={form.title}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  name="description"
                  placeholder="Describe your product..."
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Media</h3>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center transition-colors hover:border-blue-500 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-900/50">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-3">
                  <Upload size={24} />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">Click to upload images</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">or drag and drop here</p>
              </label>
              {uploading && <p className="text-blue-500 mt-2 font-medium">Uploading...</p>}
            </div>

            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                    <img
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="space-y-6">

          {/* Organization */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Organization</h3>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Sub-Category</label>
                <select
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={!selectedCategory}
                >
                  <option value="">Select Sub-Category</option>
                  {selectedCategory?.subCategories?.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>


          {/* Pricing & Stock */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Pricing & Stock</h3>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Stock Quantity</label>
                <input
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Variant (e.g. Size, Color)</label>
                <input
                  name="variant"
                  placeholder="e.g. XL, Red, 128GB"
                  value={form.variant}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Commission (%)</label>
                <input
                  name="commission"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={form.commission}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
