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
  "w-full rounded-xl bg-gray-50/80 px-5 py-3.5 text-sm text-black placeholder:text-gray-400 ring-1 ring-black/[0.08] " +
  "shadow-[inset_0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-300 hover:bg-white hover:ring-black/20 " +
  "focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:shadow-[0_10px_24px_-12px_rgba(16,24,40,0.25)]";

const Field = ({ label, hint, counter, children }) => (
  <div>
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <label className="text-sm font-semibold text-black">{label}</label>
      {counter}
    </div>
    {children}
    {hint && <p className="mt-2 text-xs text-black/55">{hint}</p>}
  </div>
);

const Counter = ({ value, max }) => (
  <span
    className={`text-xs tabular-nums ${
      value > max ? "text-red-500" : "text-black/40"
    }`}
  >
    {value}/{max}
  </span>
);

const SectionTitle = ({ title, text }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold tracking-tight text-black">{title}</h2>
    <p className="mt-1 text-sm text-black/60">{text}</p>
  </div>
);

const Skeleton = () => (
  <div className="animate-pulse max-w-6xl">
    <div className="mb-8 rounded-[2rem] bg-white p-12 ring-1 ring-black/[0.06]">
      <div className="mb-4 h-12 w-80 max-w-full rounded-xl bg-gray-200" />
      <div className="h-4 w-96 max-w-full rounded bg-gray-200" />
    </div>
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-4 rounded-3xl bg-white p-8 ring-1 ring-black/[0.06] lg:col-span-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-gray-100" />
        ))}
      </div>
      <div className="h-80 rounded-3xl bg-white ring-1 ring-black/[0.06] lg:col-span-2" />
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
    <div className="max-w-6xl">
      <style>{`
        @keyframes dash-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-12px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dash-rise { opacity: 0; animation: dash-rise .8s cubic-bezier(.2,.7,.2,1) forwards; }
        .toast-in { animation: toast-in .35s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .dash-rise { opacity: 1; animation: none; }
          .toast-in { animation: none; }
        }
      `}</style>

      {/* Toast */}
      {message && (
        <div
          role="status"
          className={`toast-in fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold shadow-[0_20px_40px_-12px_rgba(16,24,40,0.3)] ring-1 ${
            message.type === "success"
              ? "ring-green-200 text-green-700"
              : "ring-red-200 text-red-600"
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
      <div
        className="dash-rise relative mb-8 overflow-hidden rounded-[2rem] bg-white px-8 py-12 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_30px_60px_-30px_rgba(16,24,40,0.2)] md:px-16 md:py-16"
        style={{ animationDelay: "0ms" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(rgba(0,0,0,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            WebkitMaskImage: "radial-gradient(ellipse at 90% 0%, black, transparent 65%)",
            maskImage: "radial-gradient(ellipse at 90% 0%, black, transparent 65%)",
          }}
        />
        <div className="pointer-events-none absolute bottom-8 left-0 top-8 w-1 rounded-r-full bg-primary" />
        <div className="relative">
          <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-black md:text-6xl">
            Edit About Section
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-black/60">
            Update how you introduce yourself. The preview on the right shows your
            changes as you type.
          </p>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-5">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="dash-rise overflow-hidden rounded-3xl bg-white ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_50px_-24px_rgba(16,24,40,0.2)] lg:col-span-3"
          style={{ animationDelay: "120ms" }}
        >
          <div className="space-y-9 p-6 sm:p-10">
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
          <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-gray-100 bg-gray-50/70 px-6 py-5 sm:flex-row sm:items-center sm:px-10">
            <p className="flex items-center gap-2.5 text-sm text-black/60">
              <span
                className={`h-2 w-2 rounded-full ${
                  isDirty
                    ? "bg-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.2)]"
                    : "bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.15)]"
                }`}
              />
              {isDirty ? "You have unsaved changes" : "All changes saved"}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDiscard}
                disabled={!isDirty || saving}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black ring-1 ring-black/10 transition-all duration-300 hover:bg-gray-50 hover:ring-black/25 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={!isDirty || saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white ring-1 ring-primary shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-primary disabled:hover:text-white"
              >
                {saving && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/40 border-t-current" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>

        {/* Live preview */}
        <aside
          className="dash-rise lg:sticky lg:top-32 lg:col-span-2"
          style={{ animationDelay: "240ms" }}
        >
          <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_30px_60px_-28px_rgba(16,24,40,0.3)]">
            <div className="relative h-24 bg-primary">
              <div
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
            </div>
            <div className="px-7 pb-7">
              <div className="relative z-10 -mt-10 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-white text-3xl font-bold text-black shadow-[0_14px_28px_-10px_rgba(16,24,40,0.4)] ring-1 ring-black/10">
                {initial}
              </div>
              <h3 className="mt-5 text-2xl font-bold tracking-tight text-black">
                {formData.name || "Your name"}
              </h3>
              <p className="text-sm font-semibold text-primary">
                {formData.role || "Your role"}
              </p>
              <p className="mt-5 text-base font-medium italic text-black/80">
                {formData.tagline || "Your tagline appears here"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-black/65">
                {formData.description || "Your short description appears here."}
              </p>
              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="line-clamp-5 whitespace-pre-line text-sm leading-relaxed text-black/55">
                  {formData.aboutText || "Your detailed about text appears here."}
                </p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-black/40">
            Live preview. The public page may look slightly different.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default AdminAbout;