import { Badge } from '@/components/ui/badge';

interface RecentProductItemProps {
  productName: string;
  category: string;
  stock: number;
  status: 'normal' | 'baixo' | 'crítico';
}

export function RecentProductItem({
  productName,
  category,
  stock,
  status,
}: RecentProductItemProps) {
  const getBadgeVariant = () => {
    if (status === 'baixo') {
      return 'secondary';
    }
    if (status === 'crítico') {
      return 'destructive';
    }
    return 'default';
  };

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
      <div className="flex flex-col">
        <p className="text-sm font-medium">{productName}</p>
        <p className="text-xs text-muted-foreground">{category}</p>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-sm text-muted-foreground">{stock} unidades</p>
        {status && <Badge variant={getBadgeVariant()}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>}
      </div>
    </div>
  );
}
