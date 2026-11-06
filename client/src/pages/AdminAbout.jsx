import { useState, useEffect } from "react";
import API from "../api/axios";

const EMPTY = {
  name: "",
  role: "",
  tagline: "",
  description: "",
  aboutText: "",
};

const LIMITS = { tagline: 120, description: 200, aboutText: 1200 };

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-2.5 text-sm text-dark placeholder-gray-400 " +
  "transition focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10";

const Field = ({ label, hint, counter, children }) => (
  <div>
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label className="text-sm font-semibold text-dark">{label}</label>
      {counter}
    </div>
    {children}
    {hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
  </div>
);

const Counter = ({ value, max }) => (
  <span
    className={`text-xs tabular-nums ${
      value > max ? "text-red-500" : "text-gray-400"
    }`}
  >
    {value}/{max}
  </span>
);

const SectionTitle = ({ title, text }) => (
  <div className="mb-5">
    <h2 className="text-lg font-bold text-dark">{title}</h2>
    <p className="text-sm text-gray-500">{text}</p>
  </div>
);

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="mb-2 h-9 w-72 rounded-lg bg-gray-200" />
    <div className="mb-8 h-4 w-96 max-w-full rounded bg-gray-200" />
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-4 rounded-2xl bg-white p-8 shadow-md lg:col-span-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-11 rounded-xl bg-gray-100" />
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-white shadow-md lg:col-span-2" />
    </div>
  </div>
);

const AdminAbout = () => {
  const [formData, setFormData] = useState(EMPTY);
  const [saved, setSaved] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data } = await API.get("/about");
        const next = {
          name: data.name || "",
          role: data.role || "",
          tagline: data.tagline || "",
          description: data.description || "",
          aboutText: data.aboutText || "",
        };
        setFormData(next);
        setSaved(next);
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Could not load the about section." });
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const isDirty = JSON.stringify(formData) !== JSON.stringify(saved);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDiscard = () => setFormData(saved);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put("/about", formData);
      setSaved(formData);
      setMessage({ type: "success", text: "About section updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update about section." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) return <Skeleton />;

  const initial = (formData.name || "?").trim().charAt(0).toUpperCase();

  return (
    <div>
      {/* Toast */}
      {message && (
        <div
          role="status"
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border bg-white px-5 py-3 text-sm font-semibold shadow-lg ${
            message.type === "success"
              ? "border-green-200 text-green-700"
              : "border-red-200 text-red-600"
          }`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs text-white ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.type === "success" ? "✓" : "!"}
          </span>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Edit About Section</h1>
        <p className="mt-1 text-gray-500">
          Update how you introduce yourself. The preview on the right shows your
          changes as you type.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-5">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md lg:col-span-3"
        >
          <div className="space-y-8 p-6 sm:p-8">
            <section>
              <SectionTitle
                title="Identity"
                text="Who you are and what you do."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={inputClass}
                    required
                  />
                </Field>
                <Field label="Role">
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Full-Stack Developer"
                    className={inputClass}
                    required
                  />
                </Field>
              </div>
            </section>

            <div className="border-t border-gray-100" />

            <section>
              <SectionTitle
                title="Headline"
                text="The first lines visitors read."
              />
              <div className="space-y-5">
                <Field
                  label="Tagline"
                  counter={
                    <Counter
                      value={formData.tagline.length}
                      max={LIMITS.tagline}
                    />
                  }
                >
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="One line that sums you up"
                    className={inputClass}
                    required
                  />
                </Field>
                <Field
                  label="Short Description"
                  hint="Shown beneath your tagline."
                  counter={
                    <Counter
                      value={formData.description.length}
                      max={LIMITS.description}
                    />
                  }
                >
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="A sentence or two of context"
                    className={`${inputClass} resize-none`}
                    rows="2"
                    required
                  ></textarea>
                </Field>
              </div>
            </section>

            <div className="border-t border-gray-100" />

            <section>
              <SectionTitle
                title="Your story"
                text="The detailed version for your About page."
              />
              <Field
                label="About Text (Detailed)"
                counter={
                  <Counter
                    value={formData.aboutText.length}
                    max={LIMITS.aboutText}
                  />
                }
              >
                <textarea
                  name="aboutText"
                  value={formData.aboutText}
                  onChange={handleChange}
                  placeholder="Tell your background, skills and what drives you"
                  className={`${inputClass} resize-y leading-relaxed`}
                  rows="7"
                  required
                ></textarea>
              </Field>
            </section>
          </div>

          {/* Action bar */}
          <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-gray-100 bg-gray-50/70 px-6 py-4 sm:flex-row sm:items-center sm:px-8">
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <span
                className={`h-2 w-2 rounded-full ${
                  isDirty ? "bg-amber-400" : "bg-green-500"
                }`}
              />
              {isDirty ? "You have unsaved changes" : "All changes saved"}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDiscard}
                disabled={!isDirty || saving}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-dark transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={!isDirty || saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>

        {/* Live preview */}
        <aside className="lg:sticky lg:top-6 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
            <div className="h-20 bg-primary" />
            <div className="px-6 pb-6">
              <div className="-mt-9 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-4 border-white bg-dark text-2xl font-bold text-white shadow-md">
                {initial}
              </div>
              <h3 className="mt-4 text-xl font-bold text-dark">
                {formData.name || "Your name"}
              </h3>
              <p className="text-sm font-semibold text-primary">
                {formData.role || "Your role"}
              </p>
              <p className="mt-4 text-base font-medium italic text-dark/80">
                {formData.tagline || "Your tagline appears here"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {formData.description || "Your short description appears here."}
              </p>
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="line-clamp-5 whitespace-pre-line text-sm leading-relaxed text-gray-500">
                  {formData.aboutText || "Your detailed about text appears here."}
                </p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-gray-400">
            Live preview. The public page may look slightly different.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default AdminAbout;