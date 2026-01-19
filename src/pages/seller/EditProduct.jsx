import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import useCategoryStore from "../../store/categoryStore";
import { Upload, X, ImageIcon, Plus, Trash2, Check, ArrowLeft } from "lucide-react";
import variantService from "../../services/variantService";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, fetchCategories } = useCategoryStore();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form State
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

  // Variant State
  const [options, setOptions] = useState([]); // [{ name: 'Size', values: ['S', 'M'], inputValue: '' }]
  const [variants, setVariants] = useState([]); // [{ name: 'Size: S / Color: Red', price: 100, stock: 10, ... }]
  const [originalVariantIds, setOriginalVariantIds] = useState(new Set()); // To track deletions

  // Image State
  const [mainImage, setMainImage] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);

  useEffect(() => {
    fetchCategories();
    loadProductData();
  }, [id]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Product
      const { data: product } = await api.get(`/products/${id}`);

      setForm({
        title: product.title,
        description: product.description || "",
        price: product.price,
        stock: product.stock,
        commission: product.commission || 0,
        category: product.category?._id || product.category || "",
        subcategory: product.subcategory?._id || product.subcategory || "",
        weight: product.specs?.weight || "",
        weightUnit: product.specs?.weightUnit || "kg"
      });

      // Images
      if (product.images && product.images.length > 0) {
        setMainImage(product.images[0]);
        setAdditionalImages(product.images.slice(1));
      }

      // 2. Fetch Variants
      try {
        const { data: fetchedVariants } = await variantService.getVariantsByProduct(id);

        // 3. Reverse-Engineer Options from fetched variants
        let extractedOptions = []; // { name, values: Set }
        if (fetchedVariants.length > 0) {
          fetchedVariants.forEach(v => {
            if (v.attributes) {
              v.attributes.forEach(attr => {
                let existingOpt = extractedOptions.find(o => o.name === attr.name);
                if (!existingOpt) {
                  existingOpt = { name: attr.name, values: new Set() };
                  extractedOptions.push(existingOpt);
                }
                existingOpt.values.add(attr.value);
              });
            }
          });

          // Convert Sets to Arrays for state
          const initializedOptions = extractedOptions.map(o => ({
            name: o.name,
            values: Array.from(o.values),
            inputValue: ""
          }));
          setOptions(initializedOptions);

          // Normalize Fetched Variants Names to match Generator Logic
          // Generator logic: values joined by " / " based on option order
          const normalizedVariants = fetchedVariants.map(v => {
            // Sort attributes based on the order in extractedOptions to ensure "Size / Color" vs "Color / Size" consistency
            const orderedValues = initializedOptions.map(opt => {
              const attr = v.attributes.find(a => a.name === opt.name);
              return attr ? attr.value : "";
            });
            const generatedName = orderedValues.filter(Boolean).join(" / ");

            return {
              ...v,
              name: generatedName // Force name to match generator expectation
            };
          });

          setVariants(normalizedVariants);
          setOriginalVariantIds(new Set(normalizedVariants.map(v => v._id)));
        } else {
          setVariants([]);
          setOriginalVariantIds(new Set());
        }
      } catch (err) {
        // console.warn("No variants found or failed to load variants", err);
      }

    } catch (error) {
      // console.error(error);
      toast.error("Failed to load product");
      navigate("/seller/products");
    } finally {
      setLoading(false);
    }
  };


  /* ---------- VARIANT GENERATOR LOGIC (Shopify Style) ---------- */
  /* ---------- VARIANT GENERATOR LOGIC (Shopify Style) ---------- */
  const addOption = () => {
    setOptions([...options, { name: "", values: [], inputValue: "" }]);
  };

  const removeOption = (idx) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  const updateOptionName = (idx, name) => {
    const newOptions = [...options];
    newOptions[idx] = { ...newOptions[idx], name: name.toUpperCase() };
    setOptions(newOptions);
  };

  const updateOptionInputValue = (idx, val) => {
    const newOptions = [...options];
    newOptions[idx] = { ...newOptions[idx], inputValue: val.toUpperCase() };
    setOptions(newOptions);
  };

  const addOptionValue = (idx) => {
    const val = options[idx].inputValue;
    if (!val || !val.trim()) return;

    const newOptions = [...options];
    const currentValues = newOptions[idx].values;
    const cleanVal = val.trim().toUpperCase();

    if (!currentValues.includes(cleanVal)) {
      newOptions[idx] = {
        ...newOptions[idx],
        values: [...currentValues, cleanVal],
        inputValue: ""
      };
      setOptions(newOptions);
    }
  };

  const removeOptionValue = (idx, valIdx) => {
    const newOptions = [...options];
    newOptions[idx] = {
      ...newOptions[idx],
      values: newOptions[idx].values.filter((_, i) => i !== valIdx)
    };
    setOptions(newOptions);
  };

  // Auto-generate variants when options change
  useEffect(() => {
    // If we rely purely on generation, we might lose "custom edits" to price/stock of existing rows IF the key changes.
    // The key is the 'name' (e.g. "Size: S / Color: Red").

    if (loading) return; // Don't run during initial load to avoid overwriting fetched data immediately

    if (options.length === 0) {
      // If no options, but we had variants, maybe user deleted all options?
      // Let's keep it simple: No options = No variants (unless user wants manual, but we stick to generator)
      if (variants.length > 0 && options.length === 0 && !loading) {
        // Only clear if user explicitly removed options interaction
        // For now, let's allow clearing.
        setVariants([]);
      }
      return;
    }

    const validOptions = options.filter(o => o.values.length > 0);
    if (validOptions.length === 0) return;

    const cartesian = (args) => {
      const result = [];
      const max = args.length - 1;
      function helper(arr, i) {
        for (let j = 0, l = args[i].length; j < l; j++) {
          const a = arr.slice(0);
          a.push(args[i][j]);
          if (i === max) result.push(a);
          else helper(a, i + 1);
        }
      }
      helper([], 0);
      return result;
    };

    const combinations = cartesian(validOptions.map(o => o.values));

    setVariants(prev => {
      return combinations.map(combo => {
        // Construct name exactly how we did in AddProduct
        // Wait, AddProduct used `join(" / ")` on values only. 
        // Better to include Keys for clarity if we want: "Size: S / Color: Red"? 
        // AddProduct used pure values: "S / Red". Let's stick to that for consistency OR matching existing logic.
        // My reverse engineer logic used attributes. 
        // Let's stick to: "S / Red"

        const name = combo.join(" / ");

        // Try to find existing variant with this name to preserve ID and custom Price/Stock
        // We check 'prev' (current state) AND potentially we should have checked initial fetch?
        // 'prev' is sufficient because it starts with fetched data.
        const existing = prev.find(v => v.name === name);

        return {
          _id: existing?._id, // Keep ID if exists
          name: name,
          attributes: validOptions.map((opt, i) => ({ name: opt.name, value: combo[i] })),
          price: existing ? existing.price : form.price,
          stock: existing ? existing.stock : form.stock
        };
      });
    });

  }, [options, form.price, form.stock, loading]);
  // Added 'loading' dependency to prevent running this before data is ready, 
  // though the 'if (loading) return' check handles it.


  const updateVariantField = (idx, field, value) => {
    const newVariants = [...variants];
    newVariants[idx] = { ...newVariants[idx], [field]: value };
    setVariants(newVariants);
  };

  const removeVariant = (idx) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };


  /* ---------- SUBMIT ---------- */
  const selectedCategory = categories.find(c => c._id === form.category);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const uploadFiles = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    try {
      setUploading(true);
      const res = await api.post("/products/upload-images", formData, { headers: { "Content-Type": "multipart/form-data" } });
      return res.data.images || [];
    } catch (err) {
      toast.error("Image upload failed");
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleMainImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const uploaded = await uploadFiles(files);
    if (uploaded.length) setMainImage(uploaded[0]);
  };

  const handleAdditionalImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (additionalImages.length + files.length > 4) return toast.error("Max 4 additional images");
    const uploaded = await uploadFiles(files);
    setAdditionalImages(prev => [...prev, ...uploaded]);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) return toast.error("Title and Price required");

    try {
      setUploading(true);

      // 1. Update Product
      const allImages = [mainImage, ...additionalImages].filter(Boolean);
      await api.put(`/products/${id}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        commission: Number(form.commission),
        images: allImages,
        specs: {
          weight: form.weight,
          weightUnit: form.weightUnit
        }
      });

      // 2. Handle Variants
      // Identify IDs currently in valid variants list
      const currentIds = new Set(variants.map(v => v._id).filter(Boolean));

      // Determine deletions (Original IDs NOT in Current IDs)
      const toDeleteIds = [...originalVariantIds].filter(oid => !currentIds.has(oid));

      // Delete removed variants
      await Promise.all(toDeleteIds.map(vid => variantService.deleteVariant(vid)));

      // Create or Update current variants
      const variantPromises = variants.map(v => {
        const variantData = {
          productId: id,
          name: v.name,
          price: Number(v.price),
          stock: Number(v.stock),
          attributes: v.attributes
        };

        if (v._id) {
          // Update
          return variantService.updateVariant(v._id, variantData);
        } else {
          // Create
          return variantService.createVariant(variantData);
        }
      });

      await Promise.all(variantPromises);

      toast.success("Product updated successfully");
      navigate("/seller/products");

    } catch (error) {
      // console.error(error);
      toast.error("Failed to update product");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading product data...</div>;

  const inputClass = "w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/seller/products")} className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Edit Product</h2>
            <p className="text-sm text-gray-500">Update product details and variants</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={submit}
            disabled={uploading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          >
            {uploading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">General Information</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Product Title</label>
                <input name="title" value={form.title} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={6} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Images</h3>

            {/* Main Image */}
            <div className="mb-6">
              <label className={labelClass}>Main Image</label>
              {!mainImage ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-900/50">
                  <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" id="edit-main-img" />
                  <label htmlFor="edit-main-img" className="cursor-pointer text-blue-600 font-medium">Upload Main Image</label>
                </div>
              ) : (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img src={mainImage} alt="Main" className="w-full h-full object-contain" />
                  <button type="button" onClick={() => setMainImage("")} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"><X size={16} /></button>
                </div>
              )}
            </div>

            {/* Additional Images */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {additionalImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                  <img src={img} alt="Add" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setAdditionalImages(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><X size={12} /></button>
                </div>
              ))}
              {additionalImages.length < 4 && (
                <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 bg-gray-50">
                  <input type="file" accept="image/*" multiple onChange={handleAdditionalImagesUpload} className="hidden" />
                  <Plus className="text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add</span>
                </label>
              )}
            </div>
          </div>

          {/* VARIANTS */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Variants</h3>

            {/* Options Generator */}
            <div className="space-y-4 mb-6">
              {options.map((opt, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 relative">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                    <div className="sm:col-span-1">
                      <label className="text-xs font-bold uppercase text-gray-500">Option Name</label>
                      <input value={opt.name} onChange={(e) => updateOptionName(idx, e.target.value)} className={inputClass} placeholder="e.g. Size" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase text-gray-500">Option Values</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {opt.values.map((val, vIdx) => (
                          <span key={vIdx} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm flex items-center gap-1">
                            {val}
                            <button type="button" onClick={() => removeOptionValue(idx, vIdx)}><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={opt.inputValue}
                          onChange={(e) => updateOptionInputValue(idx, e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOptionValue(idx))}
                          className={inputClass}
                          placeholder="Add value..."
                        />
                        <button type="button" onClick={() => addOptionValue(idx)} className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg"><Check size={20} /></button>
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeOption(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              ))}
              {options.length < 3 && (
                <button type="button" onClick={addOption} className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1"><Plus size={16} /> Add Option</button>
              )}
            </div>

            {/* Variants Table */}
            {variants.length > 0 && (
              <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3">Variant</th>
                      <th className="px-4 py-3 w-32">Price</th>
                      <th className="px-4 py-3 w-32">Stock</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {variants.map((v, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{v.name}</td>
                        <td className="px-4 py-2">
                          <input type="number" value={v.price} onChange={(e) => updateVariantField(idx, 'price', e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 outline-none focus:border-blue-500 text-gray-900 dark:text-white" />
                        </td>
                        <td className="px-4 py-2">
                          <input type="number" value={v.stock} onChange={(e) => updateVariantField(idx, 'stock', e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 outline-none focus:border-blue-500 text-gray-900 dark:text-white" />
                        </td>
                        <td className="px-4 py-2">
                          <button type="button" onClick={() => removeVariant(idx)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Organization</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                  <option value="">Select</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Sub-Category</label>
                <select name="subcategory" value={form.subcategory} onChange={handleChange} className={inputClass} disabled={!selectedCategory}>
                  <option value="">Select</option>
                  {selectedCategory?.subCategories?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Pricing & Stock</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Base Price</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Total Stock</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Weight</label>
                  <input name="weight" value={form.weight} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Unit</label>
                  <select name="weightUnit" value={form.weightUnit} onChange={handleChange} className={inputClass}>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}