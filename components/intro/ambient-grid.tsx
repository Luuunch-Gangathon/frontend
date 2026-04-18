export function AmbientGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-[-60px]"
        style={{
          backgroundImage:
            'linear-gradient(oklch(1 0 0 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          animation: 'gridDrift 10s linear infinite',
        }}
      />
      <div
        className="absolute w-[700px] h-[700px] rounded-full -top-60 -left-40"
        style={{
          background: 'radial-gradient(circle, oklch(0.65 0.12 264) 0%, transparent 70%)',
          opacity: 0.07,
          animation: 'orbDrift 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full -bottom-20 right-0"
        style={{
          background: 'radial-gradient(circle, oklch(0.55 0.1 180) 0%, transparent 70%)',
          opacity: 0.05,
          animation: 'orbDrift 24s ease-in-out infinite reverse',
          animationDelay: '-8s',
        }}
      />
    </div>
  )
}
