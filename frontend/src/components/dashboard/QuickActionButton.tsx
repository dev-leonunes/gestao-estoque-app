import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

interface QuickActionButtonProps {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export function QuickActionButton({ label, icon, href }: QuickActionButtonProps) {
  return (
    <Link to={href} className="block">
      <Button
        variant="outline"
        className="w-full justify-start gap-2 cursor-pointer"
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
}
