import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import useCategoryStore from "../../store/categoryStore"; // Import store
import { Upload, X, ImageIcon, Plus, Trash2, Check } from "lucide-react";
import variantService from "../../services/variantService";

export default function AddProduct() {
  const navigate = useNavigate();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    commission: "",
    category: "",
    subcategory: "",
    weight: "",
    weightUnit: "kg"
  });

  // Variant State (Shopify Style)
  const [options, setOptions] = useState([]); // [{ name: 'Size', values: ['S', 'M'] }]
  const [variants, setVariants] = useState([]); // Generated combinations

  // Image & Upload State
  const [mainImage, setMainImage] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  /* ---------- VARIANT LOGIC (SHOPIFY STYLE) ---------- */
  const addOption = () => {
    setOptions([...options, { name: "", values: [], inputValue: "" }]);
  };

  const removeOption = (idx) => {
    const newOptions = [...options];
    newOptions.splice(idx, 1);
    setOptions(newOptions);
  };

  const updateOptionName = (idx, name) => {
    const newOptions = [...options];
    newOptions[idx].name = name;
    setOptions(newOptions);
  };

  const updateOptionInputValue = (idx, val) => {
    const newOptions = [...options];
    newOptions[idx].inputValue = val;
    setOptions(newOptions);
  };

  const addOptionValue = (idx) => {
    const val = options[idx].inputValue;
    if (!val || !val.trim()) return;

    const newOptions = [...options];
    if (!newOptions[idx].values.includes(val.trim())) {
      newOptions[idx].values.push(val.trim());
      newOptions[idx].inputValue = ""; // Clear input
      setOptions(newOptions);
    }
  };

  const removeOptionValue = (idx, valIdx) => {
    const newOptions = [...options];
    newOptions[idx].values.splice(valIdx, 1);
    setOptions(newOptions);
  };

  // Auto-generate variants when options change
  useEffect(() => {
    if (options.length === 0) {
      setVariants([]);
      return;
    }

    // Filter out options with no values
    const validOptions = options.filter(o => o.values.length > 0);
    if (validOptions.length === 0) {
      setVariants([]);
      return;
    }

    // Cartesian product helper
    const cartesian = (args) => {
      const result = [];
      const max = args.length - 1;
      function helper(arr, i) {
        for (let j = 0, l = args[i].length; j < l; j++) {
          const a = arr.slice(0); // clone arr
          a.push(args[i][j]);
          if (i === max) result.push(a);
          else helper(a, i + 1);
        }
      }
      helper([], 0);
      return result;
    };

    const combinations = cartesian(validOptions.map(o => o.values));

    // Map combinations to variant objects, preserving existing price/stock if variant name matches
    setVariants(prev => {
      return combinations.map(combo => {
        const name = combo.join(" / ");
        const existing = prev.find(v => v.name === name);
        return {
          name: name,
          attributes: validOptions.map((opt, i) => ({ name: opt.name, value: combo[i] })),
          price: existing ? existing.price : form.price,
          stock: existing ? existing.stock : form.stock
        };
      });
    });

  }, [options, form.price, form.stock]);

  const updateVariantField = (idx, field, value) => {
    const newVariants = [...variants];
    newVariants[idx][field] = value;
    setVariants(newVariants);
  };

  const removeVariant = (idx) => {
    // Note: This only removes it from display temporarily; regeneration might bring it back if options exist.
    // In Shopify, you typically delete the option value to remove variants, or uncheck them.
    // For simplicity, let's just allow removing from the specific list if needed, but regeneration will overwrite.
    // Actually, better to strictly stick to options driving generation.
    // But allowing manual delete is fine for "I don't sell Small/Red".
    // We'd need to flag it as deleted or simple filter.
    const newVariants = [...variants];
    newVariants.splice(idx, 1);
    setVariants(newVariants);
  };


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
  const uploadFiles = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      setUploading(true);
      const res = await api.post(
        "/products/upload-images",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data.images || [];
    } catch (err) {
      // console.error(err);
      toast.error("Image upload failed");
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleMainImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 2MB limit`);
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    const uploadedUrls = await uploadFiles(validFiles);
    if (uploadedUrls.length > 0) {
      setMainImage(uploadedUrls[0]);
    }
  };

  const handleAdditionalImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 2MB limit`);
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    if (additionalImages.length + validFiles.length > 4) {
      return toast.error("You can only upload up to 4 additional images");
    }

    const uploadedUrls = await uploadFiles(validFiles);
    setAdditionalImages((prev) => [...prev, ...uploadedUrls]);
  };

  const removeMainImage = () => setMainImage("");
  const removeAdditionalImage = (indexToRemove) => {
    setAdditionalImages(additionalImages.filter((_, index) => index !== indexToRemove));
  };

  /* ---------- SUBMIT PRODUCT ---------- */
  const submit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.category || !form.subcategory) {
      return toast.error("All fields are required");
    }

    if (!mainImage) {
      return toast.error("Main product image is required");
    }

    // Combine images: Main image is always first (index 0)
    const allImages = [mainImage, ...additionalImages];

    try {
      setUploading(true); // Reuse uploading state for submission blocking

      // 1. Create Base Product
      const productRes = await api.post("/products", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        commission: Number(form.commission),
        images: allImages,
        specs: {
          // If variants exist, these might be "default" or left empty. 
          // For now, let's keep them if user filled them in main form (though I removed them from UI below)
          weight: form.weight,
          weightUnit: form.weightUnit || 'kg'
        }
      });

      const newProductId = productRes.data._id;

      // 2. Create Variants if any
      if (variants.length > 0) {
        // Create an array of promises
        const variantPromises = variants.map(v => {
          return variantService.createVariant({
            productId: newProductId,
            price: Number(v.price || form.price), // Fallback to base price
            stock: Number(v.stock || 0),
            attributes: v.attributes, // Directly use generated attributes
            // images: [] 
          });
        });

        await Promise.all(variantPromises);
      }

      toast.success("Product and variants added successfully");
      navigate("/seller/products");
    } catch (err) {
      // console.error(err);
      toast.error("Failed to add product");
    } finally {
      setUploading(false);
    }
  };

  const inputClass = "w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Add New Product</h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">Create a new product listing with optional variants.</p>
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
            {uploading ? "Publishing..." : "Publish Product"}
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Product Images</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Maximum image size: 2MB</p>

            <div className="space-y-6">
              {/* Main Image Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Main Image (Required)</label>
                {!mainImage ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center transition-colors hover:border-blue-500 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-900/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                      id="main-image-upload"
                    />
                    <label htmlFor="main-image-upload" className="cursor-pointer flex flex-col items-center">
                      <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-3">
                        <Upload size={24} />
                      </div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">Upload Main Image</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This will be the cover image</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                    <img
                      src={mainImage}
                      alt="Main"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeMainImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/70 text-white text-xs rounded-full">
                      Main Image
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Images Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Images (Optional, max 4)</label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {additionalImages.map((img, idx) => (
                    <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                      <img
                        src={img}
                        alt={`Additional ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {additionalImages.length < 4 && (
                    <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center cursor-pointer transition-colors relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImagesUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Upload additional images"
                      />
                      <div className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full mb-2">
                        <ImageIcon size={20} className="text-gray-500 dark:text-gray-400" />
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Add Image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* VARIANTS SECTION - SHOPIFY STYLE */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Variants</h3>
              <p className="text-sm text-gray-500">Add options like size or color to create variants.</p>
            </div>

            {/* Option Definition */}
            <div className="space-y-4 mb-6">
              {options.map((opt, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 relative">
                  <div className="mb-3">
                    <label className="text-sm font-semibold block mb-1">Option Name</label>
                    <input
                      className={inputClass}
                      value={opt.name}
                      onChange={(e) => updateOptionName(idx, e.target.value)}
                      placeholder="e.g. Size, Color"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold block mb-1">Option Values</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {opt.values.map((val, vIdx) => (
                        <span key={vIdx} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm flex items-center gap-1">
                          {val}
                          <button type="button" onClick={() => removeOptionValue(idx, vIdx)}><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        className={inputClass}
                        placeholder="Add value (e.g. Small, Red)"
                        value={opt.inputValue || ""}
                        onChange={(e) => updateOptionInputValue(idx, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addOptionValue(idx);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => addOptionValue(idx)}
                        className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        title="Add Value"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {options.length < 3 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus size={16} /> Add another option
                </button>
              )}
            </div>

            {/* Generated Variants Table */}
            {variants.length > 0 && (
              <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium border-b dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3">Variant</th>
                      <th className="px-4 py-3 w-32">Price (₹)</th>
                      <th className="px-4 py-3 w-32">Stock</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {variants.map((v, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          {v.name}
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 outline-none focus:border-blue-500"
                            value={v.price}
                            onChange={(e) => updateVariantField(idx, 'price', e.target.value)}
                            placeholder={form.price || "0"}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 outline-none focus:border-blue-500"
                            value={v.stock}
                            onChange={(e) => updateVariantField(idx, 'stock', e.target.value)}
                            placeholder="0"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <button type="button" onClick={() => removeVariant(idx)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Base Pricing & Stock</h3>

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

              {/* REMOVED SIZE/COLOR FROM BASE FORM AS WE USE VARIANTS NOW, OR KEEP FOR BACKWARD COMPAT (Leaving Weight) */}
              {/* <div className="grid grid-cols-2 gap-4">
                 ... (Size/Color removed to encourage using Variants, but Weight kept)
              </div> */}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Weight</label>
                  <input
                    name="weight"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.weight || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Unit</label>
                  <select
                    name="weightUnit"
                    value={form.weightUnit || "kg"}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                  </select>
                </div>
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
      </form >
    </div >
  );
}
