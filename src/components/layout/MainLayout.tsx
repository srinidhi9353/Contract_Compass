import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  userName?: string;
}

export function MainLayout({ children, title, subtitle, userName }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header title={title} subtitle={subtitle} userName={userName} />
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
