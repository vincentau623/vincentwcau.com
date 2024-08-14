
export default function MiniProjectLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-4 mx-4 text-center justify-items-center">
      {children}
    </div>);
}