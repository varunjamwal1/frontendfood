import { useMemo } from "react";

export default function FormFields({
  type,
  data = {},
  setData,
  categories = [],
}) {
  /* ------------------ Handlers ------------------ */

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;

    setData((prev) => ({
      ...prev,
      [name]:
        inputType === "checkbox"
          ? checked
          : inputType === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setData((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  /* ------------------ Reusable Input ------------------ */

  const Input = ({
    name,
    label,
    type = "text",
    options = null,
    required = false,
  }) => (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>

      {options ? (
        <select
          id={name}
          name={name}
          value={data[name]?._id || data[name] || ""}
          onChange={handleChange}
          required={required}
          className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt._id} value={opt._id}>
              {opt.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={data[name] ?? ""}
          onChange={handleChange}
          required={required}
          className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        />
      )}
    </div>
  );

  /* ------------------ Image Preview ------------------ */

  const imagePreview = useMemo(() => {
    if (!data.image) return null;

    if (typeof data.image === "string") return data.image;
    if (data.preview) return data.preview;

    return null;
  }, [data.image, data.preview]);

  const ImageUpload = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full text-sm file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-lg file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-200 transition"
      />

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="w-24 h-24 object-cover rounded-xl border dark:border-slate-600"
        />
      )}
    </div>
  );

  /* ------------------ Layout Wrapper ------------------ */

  const Section = ({ children }) => (
    <div className="space-y-4">{children}</div>
  );

  /* ------------------ Switch Rendering ------------------ */

  switch (type) {
    case "category":
      return (
        <Section>
          <Input name="name" label="Category Name" required />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={data.description ?? ""}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>
          <ImageUpload />
        </Section>
      );

    case "item":
      return (
        <Section>
          <Input name="name" label="Item Name" required />
          <Input name="price" label="Price" type="number" required />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={data.description ?? ""}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          <Input
            name="category"
            label="Category"
            options={categories}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              name="type"
              label="Type"
              options={[
                { _id: "veg", name: "Veg" },
                { _id: "non-veg", name: "Non-Veg" },
              ]}
            />

            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                name="isPopular"
                checked={!!data.isPopular}
                onChange={handleChange}
                id="isPopular"
                className="w-4 h-4 accent-orange-500"
              />
              <label
                htmlFor="isPopular"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Popular
              </label>
            </div>
          </div>

          <ImageUpload />
        </Section>
      );

    case "table":
      return (
        <Section>
          <Input name="tableNumber" label="Table Number" required />
          <Input name="seats" label="Seats" type="number" required />
        </Section>
      );

    case "tax":
      return (
        <Section>
          <Input name="name" label="Tax Name" required />
          <Input name="rate" label="Rate (%)" type="number" required />
        </Section>
      );

    case "staff":
      return (
        <Section>
          <Input name="name" label="Staff Name" required />
          <Input name="email" label="Email Address" type="email" required />
          {!data._id && (
            <Input name="password" label="Password" type="password" required />
          )}
          <Input name="phone" label="Phone Number" type="tel" />
        </Section>
      );

    default:
      return null;
  }
}