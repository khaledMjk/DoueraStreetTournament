export default function PageHeader({ title, subtitle }) {
  return (
    <div className="bg-pitch-900 pitch-texture text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-white/70">{subtitle}</p>}
        <div className="mt-4 h-1 w-16 rounded-full bg-gold-400" />
      </div>
    </div>
  );
}
