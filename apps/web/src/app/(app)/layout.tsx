import Header from '@/src/components/header';
import MobileNav from '@/src/components/mobile-nav';
import { FetchingIndicator } from '@/src/components/fetching-indicator';
import { HomeBackground } from '@/src/components/home-background';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full h-screen pb-16 md:pb-0">
      {/* Grid texture — fades from top, matches auth layout depth */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.18]
          [background-image:linear-gradient(to_right,var(--grid-gray)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-gray)_1px,transparent_1px)]
          [background-size:64px_64px]
          [mask-image:radial-gradient(ellipse_150%_80%_at_50%_0%,black_20%,transparent_85%)]"
      />
      <HomeBackground />
      <Header />
      <FetchingIndicator />
      {children}
      <MobileNav />
    </div>
  );
}
