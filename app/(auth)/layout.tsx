export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 md:px-6">
      <div className="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-[var(--brand-100)] blur-3xl" />
      <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-[#d6e2ff] blur-3xl" />
      <div className="relative z-10 w-full max-w-[760px] rounded-[30px] border border-white/50 bg-white/70 p-6 backdrop-blur md:p-14">
        {children}
      </div>
    </div>
  );
}
