import React from 'react';

type PageWrapperProps = {
  children: React.ReactNode;
};

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {children}
      </div>
    </main>
  );
}
