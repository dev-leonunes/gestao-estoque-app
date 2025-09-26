import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface QuickActionButtonProps {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export function QuickActionButton({ label, icon, href }: QuickActionButtonProps) {
  return (
    <Link to={href}>
      <Button variant="outline" className="flex items-center gap-2" asChild>
        <div>
          {icon}
          {label}
        </div>
      </Button>
    </Link>
  );
}
