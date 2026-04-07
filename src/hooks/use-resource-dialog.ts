import { useState } from 'react';

/**
 * A reusable hook to manage the standard UI state for resource management sections
 * (Create, Edit, Delete dialogs).
 */
export function useResourceDialog<T>() {
    const [isOpen, setIsOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    /**
     * Prepares the state for adding a new resource.
     */
    const handleAdd = () => {
        setSelectedItem(null);
        setIsOpen(true);
    };

    /**
     * Prepares the state for editing an existing resource.
     */
    const handleEdit = (item: T) => {
        setSelectedItem(item);
        setIsOpen(true);
    };

    /**
     * Prepares the state for deleting a resource.
     */
    const handleDeleteTrigger = (id: string) => {
        setItemToDelete(id);
        setIsConfirmOpen(true);
    };

    const closeDialog = () => setIsOpen(false);
    const closeConfirm = () => setIsConfirmOpen(false);

    return {
        // State
        isOpen,
        isConfirmOpen,
        selectedItem,
        itemToDelete,
        
        // Direct setters (if custom logic is needed)
        setIsOpen,
        setIsConfirmOpen,
        setSelectedItem,
        setItemToDelete,

        // Handlers
        handleAdd,
        handleEdit,
        handleDeleteTrigger,
        closeDialog,
        closeConfirm,
    };
}
