import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Product {
    id: string
    name: string
}

interface ProductComboboxProps {
    products: Product[]
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    emptyText?: string
    disabled?: boolean
}

export function ProductCombobox({
    products,
    value,
    onValueChange,
    placeholder = "Selecione um produto...",
    emptyText = "Nenhum produto encontrado.",
    disabled = false,
}: ProductComboboxProps) {
    const [open, setOpen] = React.useState(false)

    const sortedProducts = React.useMemo(() => {
        return [...products].sort((a, b) => a.name.localeCompare(b.name))
    }, [products])

    const selectedProduct = sortedProducts.find((product) => product.id === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {selectedProduct ? (
                        <span className="truncate">
                            {selectedProduct.name}
                        </span>
                    ) : (
                        placeholder
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] w-full p-0">
                <Command>
                    <CommandInput placeholder="Digite para buscar produtos..." />
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {sortedProducts.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    value={product.name}
                                    onSelect={() => {
                                        onValueChange(product.id === value ? "" : product.id)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4 ",
                                            value === product.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <span className="truncate">{product.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
