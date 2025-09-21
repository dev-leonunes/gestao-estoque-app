interface RecentProductItemProps {
  name: string;
  quantity: number;
}

export function RecentProductItem({ name, quantity }: RecentProductItemProps) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
      <div>
        <p className="text-sm font-medium">{name}</p>
      </div>
      <div className="text-sm text-muted-foreground">
        Estoque: <span className="font-semibold">{quantity}</span>
      </div>
    </div>
  );
}
