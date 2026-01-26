export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="w-full flex justify-center">{children}</div>
    </div>
  );
}
