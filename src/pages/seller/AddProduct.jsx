import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { CATEGORIES } from "../../constants/categories";

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subcategory: "",
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  /* ---------- CATEGORY LOGIC ---------- */
  const selectedCategory = CATEGORIES.find(
    (c) => c.id === form.category
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

      setImages(res.data.images || []);
      toast.success("Images uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
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
        stock: Number(form.stock),
        images,
      });

      toast.success("Product added successfully");
      navigate("/seller/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>

      <form onSubmit={submit} className="space-y-4">

        <input
          name="title"
          placeholder="Product title"
          value={form.title}
          onChange={handleChange}
          className="input"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="input"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="input"
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="input"
        />

        {/* CATEGORY */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input"
        >
          <option value="">Select Category</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        {/* SUB CATEGORY */}
        <select
          name="subcategory"
          value={form.subcategory}
          onChange={handleChange}
          className="input"
          disabled={!selectedCategory}
        >
          <option value="">Select Sub-Category</option>
          {selectedCategory?.subs.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block font-medium mb-1">Product Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />

          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading…</p>
          )}

          <div className="flex gap-2 mt-2">
            {images.map((img) => (
              <img
                key={img}
                src={img}
                alt="preview"
                className="h-16 w-16 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}


// import { useState } from "react";
// import api from "../../services/api";
// import toast from "react-hot-toast";

// export default function AddProduct() {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     price: "",
//     stock: "",
//     category: "",
//     subcategory: "",
//   });

//   const [images, setImages] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const handleInput = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleImageUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     const data = new FormData();
//     files.forEach((file) => data.append("images", file));

//     setUploading(true);

//     try {
//       const res = await api.post("/uploads/images", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setImages(res.data.images);
//       toast.success("Images uploaded successfully!");

//     } catch (err) {
//       console.error(err);
//       toast.error("Image upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const submitProduct = async () => {
//     if (!form.title || !form.price) {
//       toast.error("Title and price are required");
//       return;
//     }

//     try {
//       const payload = { ...form, images };
//       await api.post("/products", payload);

//       toast.success("Product added!");

//       setForm({
//         title: "",
//         description: "",
//         price: "",
//         stock: "",
//         category: "",
//         subcategory: "",
//       });

//       setImages([]);

//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add product");
//     }
//   };

//   // -----------

//   return (
//     <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow text-gray-900 dark:text-gray-100">
//       <h2 className="text-2xl font-bold mb-4">Add Product</h2>

//       {/* TITLE */}
//       <input
//         name="title"
//         value={form.title}
//         onChange={handleInput}
//         placeholder="Product Title"
//         className="w-full border dark:border-gray-700 dark:bg-gray-700 rounded p-2"
//       />

//       {/* DESCRIPTION */}
//       <textarea
//         name="description"
//         value={form.description}
//         onChange={handleInput}
//         placeholder="Product Description"
//         className="w-full border dark:border-gray-700 dark:bg-gray-700 rounded p-2 mt-3"
//       />

//       {/* PRICE */}
//       <input
//         name="price"
//         value={form.price}
//         onChange={handleInput}
//         placeholder="Price"
//         type="number"
//         className="w-full border dark:border-gray-700 dark:bg-gray-700 rounded p-2 mt-3"
//       />

//       {/* STOCK */}
//       <input
//         name="stock"
//         value={form.stock}
//         onChange={handleInput}
//         placeholder="Stock"
//         type="number"
//         className="w-full border dark:border-gray-700 dark:bg-gray-700 rounded p-2 mt-3"
//       />

//       {/* CATEGORY */}
//       <input
//         name="category"
//         value={form.category}
//         onChange={handleInput}
//         placeholder="Category"
//         className="w-full border dark:border-gray-700 dark:bg-gray-700 rounded p-2 mt-3"
//       />

//       {/* SUBCATEGORY */}
//       <input
//         name="subcategory"
//         value={form.subcategory}
//         onChange={handleInput}
//         placeholder="Subcategory"
//         className="w-full border dark:border-gray-700 dark:bg-gray-700 rounded p-2 mt-3"
//       />

//       {/* IMAGE UPLOAD */}
//       <div className="mt-4">
//         <label className="block font-semibold mb-1">Upload Images</label>
//         <input type="file" multiple onChange={handleImageUpload} />

//         {uploading && (
//           <p className="text-blue-400 text-sm mt-1">Uploading...</p>
//         )}
//       </div>

//       {/* IMAGE PREVIEW */}
//       <div className="flex gap-3 mt-4 flex-wrap">
//         {images.map((img, idx) => (
//           <img
//             key={idx}
//             src={img}
//             alt="uploaded"
//             className="w-20 h-20 object-cover rounded"
//           />
//         ))}
//       </div>

//       <button
//         onClick={submitProduct}
//         className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
//       >
//         Add Product
//       </button>
//     </div>
//   );
// }
