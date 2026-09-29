import { FloatingNavbar } from "@/components/floating-navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <FloatingNavbar />
      {children}
    </div>
  );
}
