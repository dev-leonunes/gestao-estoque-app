import React from 'react';

type PageWrapperProps = {
    children: React.ReactNode;
};

export function PageWrapper({ children }: PageWrapperProps) {
    return (
        <main className="container mx-auto px-6 py-8">
            {children}
        </main>
    );
}
