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
        className="quick-action-button w-full justify-start gap-2 bg-white hover:bg-gray-50 text-gray-900 border-gray-200 hover:border-gray-300 transition-colors"
      >
        {icon}
        <span className="text-gray-900">{label}</span>
      </Button>
    </Link>
  );
}
