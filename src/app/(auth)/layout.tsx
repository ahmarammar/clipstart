export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[linear-gradient(190.77deg,#101521_0.22%,#0C101A_51.91%,#0B0F1A_99.78%)] relative">
      {children}
      <div className="h-171.5 w-171.5 bg-[#3B82F60D] fixed left-[73.26%] rounded-[0.625rem] blur-[13.338rem] -top-[13.67%]"></div>
      <div className="h-254 w-254 border border-[#2D3A5A] bg-[#3B82F60D] fixed -left-[45.69%] rounded-[0.625rem] blur-[13.338rem] top-[44.92%]"></div>
    </div>
  );
}
