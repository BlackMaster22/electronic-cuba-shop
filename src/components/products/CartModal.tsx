// src/components/products/CartModal.tsx
'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useUserStore } from '@/store/userStore';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SHIPPING_COST = 1500;

export function CartModal({ isOpen, onClose }: CartModalProps) {
    const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
    const [requiresShipping, setRequiresShipping] = useState(true);
    const user = useUserStore.getState().user;
    const shippingAddress = user?.address || {
        street: 'Dirección no configurada',
        number: '0',
        between: ['N/A', 'N/A'],
        neighborhood: 'N/A',
        municipality: 'N/A',
        province: 'N/A',
    };

    if (!isOpen) return null;

    const subtotal = getTotalPrice();
    const shippingCost = requiresShipping ? SHIPPING_COST : 0;
    const finalTotal = subtotal + shippingCost;

    const handleCheckout = async () => {
        if (items.length === 0) return;

        const orderData = {
            items: items.map(item => ({
                productId: item.productId,
                productName: item.name,
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.price * item.quantity,
            })),
            totalAmount: subtotal,
            requiresShipping,
            shippingCost,
            finalTotal,
            shippingAddress,
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                clearCart();
                onClose();
                alert('¡Compra realizada con éxito!');
            } else {
                const error = await response.json();
                console.error('Error al crear orden:', error);
                alert(error.message || 'Error al procesar la compra.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Error de conexión.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex text-gray-600 dark:text-gray-400 items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Carrito de compras</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Cerrar carrito"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">Tu carrito está vacío.</p>
                    ) : (
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.productId} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-md flex-shrink-0" />

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {item.price.toLocaleString('es-CU', { style: 'currency', currency: 'CUP' })}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Cantidad: {item.quantity}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                            className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                                            aria-label="Reducir cantidad"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                            className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                                            aria-label="Aumentar cantidad"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.productId)}
                                        className="p-1 text-red-500 hover:text-red-700"
                                        aria-label="Eliminar producto"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={requiresShipping}
                                    onChange={(e) => setRequiresShipping(e.target.checked)}
                                    className="rounded text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-gray-700 dark:text-gray-300">
                                    Envío a domicilio (+{SHIPPING_COST.toLocaleString('es-CU', { style: 'currency', currency: 'CUP' })})
                                </span>
                            </label>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                <span className="font-medium">{subtotal.toLocaleString('es-CU', { style: 'currency', currency: 'CUP' })}</span>
                            </div>
                            {requiresShipping && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Envío:</span>
                                    <span className="font-medium">{shippingCost.toLocaleString('es-CU', { style: 'currency', currency: 'CUP' })}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total:</span>
                                <span>{finalTotal.toLocaleString('es-CU', { style: 'currency', currency: 'CUP' })}</span>
                            </div>
                        </div>

                        <Button onClick={handleCheckout} className="w-full py-2">
                            Proceder al pago
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}