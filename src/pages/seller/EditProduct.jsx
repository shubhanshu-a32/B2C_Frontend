import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function EditProduct() {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await api.get(`/products/${id}`);
    setForm(data);
  };

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    await api.put(`/products/${id}`, form);
    alert("Updated!");
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="dark:text-gray-500 max-w-2xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

      <div className="space-y-4">
        <Input label="Title" name="title" value={form.title} onChange={change} />
        <Input label="Description" name="description" value={form.description} onChange={change} />
        <Input label="Price" name="price" type="number" value={form.price} onChange={change} />

        <select
          name="category"
          className="border p-2 rounded w-full"
          value={form.category}
          onChange={change}
        >
          <option value="Fashion">Fashion</option>
          <option value="Grocery">Grocery</option>
          <option value="Furniture">Furniture</option>
        </select>

        <Input label="Stock" name="stock" type="number" value={form.stock} onChange={change} />
        <Input label="Variant" name="variant" value={form.variant || ""} onChange={change} placeholder="e.g. XL, Red" />
      </div>

      <Button className="mt-6 w-full" onClick={submit}>
        Save Changes
      </Button>
    </div>
  );
}