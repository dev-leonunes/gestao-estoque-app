import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { ProductCombobox } from '../ui/product-combobox';
import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCreateMovement } from '../../hooks/useMovements';
import type { MovementType, CreateMovementDto } from '../../types/api';
import { toast } from 'sonner';

interface MovementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MovementModal({ isOpen, onClose }: MovementModalProps) {
    const { data: products } = useProducts();
    const { mutate: createMovement } = useCreateMovement();

    const [formData, setFormData] = useState<CreateMovementDto & { reason: string }>({
        productId: '',
        type: 'IN',
        quantity: 0,
        description: '',
        reason: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.productId || !formData.quantity || !formData.reason) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            const movementData: CreateMovementDto = {
                productId: formData.productId,
                type: formData.type,
                quantity: formData.quantity,
                description: formData.reason,
            };
            createMovement(movementData);
            toast.success('Movimentação criada com sucesso!');
            onClose();
            setFormData({
                productId: '',
                type: 'IN',
                quantity: 0,
                description: '',
                reason: '',
            });
        } catch (error) {
            console.error('Erro ao criar movimentação:', error);
            toast.error('Erro ao criar movimentação. Tente novamente.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[650px] w-[90%] p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold">Nova Movimentação</DialogTitle>
                </DialogHeader>
                <div className="px-6 pb-6">
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="productId">Produto *</Label>
                                <ProductCombobox
                                    products={products || []}
                                    value={formData.productId}
                                    onValueChange={(value) => setFormData({ ...formData, productId: value })}
                                    placeholder="Selecione um produto"
                                    emptyText="Nenhum produto encontrado"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo de Movimentação *</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value: MovementType) => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="IN">Entrada</SelectItem>
                                        <SelectItem value="OUT">Saída</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantidade *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={formData.quantity || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, quantity: Number(e.target.value) })
                                }
                                placeholder="Digite a quantidade"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason">Motivo *</Label>
                            <Textarea
                                id="reason"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder="Descreva o motivo da movimentação"
                                rows={3}
                                required
                                className="resize-none"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={onClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={!formData.productId || !formData.quantity || !formData.reason}
                            >
                                Criar Movimentação
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
