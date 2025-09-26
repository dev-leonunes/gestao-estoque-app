import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import ProductForm from '../../pages/ProductForm';
import type { Product } from '../../types/api';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    product?: Product;
}

export function ProductModal({ isOpen, onClose, title = "Adicionar Novo Produto", product }: ProductModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!bg-white !text-black rounded-lg max-w-[650px] w-[90%] shadow-lg p-0 border-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold !text-gray-900">{title}</DialogTitle>
                </DialogHeader>
                <div className="px-6 pb-6">
                    <ProductForm onSuccess={onClose} product={product} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
