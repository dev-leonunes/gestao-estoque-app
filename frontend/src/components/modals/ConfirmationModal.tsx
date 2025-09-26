import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isLoading = false
}: ConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black rounded-lg max-w-[450px] w-[90%] shadow-lg p-0 border-0">
                <DialogHeader className="p-6 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
                    </div>
                </DialogHeader>
                <div className="px-6 pb-6">
                    <p className="text-gray-600 mb-6">
                        {message}
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="!bg-white !hover:bg-gray-50 !text-black transition-colors"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700 text-white transition-colors"
                        >
                            {isLoading ? 'Processando...' : confirmText}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
