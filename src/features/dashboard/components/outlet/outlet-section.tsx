import { useState } from 'react';
import OutletTable from './outlet-table';
import type { Outlet } from '@/types/outlet';
import { Plus, RefreshCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OutletDialog from './outlet-dialog';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import type { OutletFormValues } from '../../validators/outlet-schema';
import { toast } from 'sonner';
import { 
    useQuery, 
    useMutation, 
    useQueryClient 
} from '@tanstack/react-query';
import { 
    getOutlets, 
    addOutlet, 
    updateOutlet, 
    deleteOutlet,
    getOutletTransactions
} from '@/services/outlet-api';
import { Spinner } from '@/components/ui/spinner';
import OutletDetailDialog from './outlet-detail-dialog';

const OutletSection = () => {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
    const [selectedDetailOutlet, setSelectedDetailOutlet] = useState<Outlet | null>(null);
    const [outletToDelete, setOutletToDelete] = useState<string | null>(null);

    const { 
        data: outlets = [], 
        isLoading: isFetching, 
        isError,
        refetch 
    } = useQuery({
        queryKey: ['outlets'],
        queryFn: getOutlets,
    });

    const { 
        data: transactions = [], 
        isLoading: isTxFetching 
    } = useQuery({
        queryKey: ['outlet-transactions', selectedDetailOutlet?.id],
        queryFn: () => getOutletTransactions(selectedDetailOutlet!.id),
        enabled: !!selectedDetailOutlet && isDetailOpen,
    });

    const addMutation = useMutation({
        mutationFn: addOutlet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outlets'] });
            toast.success("New outlet added successfully! 🍵");
            setIsDialogOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to add outlet");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: string, values: OutletFormValues }) => 
            updateOutlet(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outlets'] });
            toast.success("Outlet updated successfully! 🍵");
            setIsDialogOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update outlet");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteOutlet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outlets'] });
            toast.success("Outlet removed successfully");
            setIsConfirmOpen(false);
            setOutletToDelete(null);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete outlet");
        }
    });

    const handleAdd = () => {
        setSelectedOutlet(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (outlet: Outlet) => {
        setSelectedOutlet(outlet);
        setIsDialogOpen(true);
    };

    const handleDeleteTrigger = (id: string) => {
        setOutletToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (outletToDelete) {
            deleteMutation.mutate(outletToDelete);
        }
    };

    const handleViewDetail = (outlet: Outlet) => {
        setSelectedDetailOutlet(outlet);
        setIsDetailOpen(true);
    };

    const handleSubmit = (values: OutletFormValues) => {
        if (selectedOutlet) {
            updateMutation.mutate({ id: selectedOutlet.id, values });
        } else {
            addMutation.mutate(values);
        }
    };

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-red-50/50 rounded-2xl border border-red-100 ring-1 ring-red-50 text-center">
                <p className="text-red-700 font-bold mb-4 italic">Oops! Failed to load outlets.</p>
                <Button 
                    onClick={() => refetch()} 
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50 rounded-xl px-6 font-bold uppercase tracking-widest text-xs"
                >
                    <RefreshCcw size={14} className="mr-2" />
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 p-6 rounded-2xl border border-gray-100 ring-1 ring-gray-50/50 shadow-xs backdrop-blur-sm">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">Outlet Addresses</h2>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-none">
                        Manage your store outlets and branches across regions.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {isFetching && <Spinner className="size-4 text-green-700 mr-2" />}
                    <Button 
                        onClick={handleAdd}
                        disabled={isFetching}
                        className="bg-green-700 hover:bg-green-600 text-white rounded-xl h-10 px-4 font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-md shadow-green-900/10 outline-hidden"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Outlet
                    </Button>
                </div>
            </div>

            <div className={isFetching ? "opacity-60 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}>
                <OutletTable 
                    outlets={outlets} 
                    onEdit={handleEdit}
                    onDelete={handleDeleteTrigger}
                    onViewDetail={handleViewDetail}
                />
            </div>

            <OutletDetailDialog 
                isOpen={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                outletName={selectedDetailOutlet?.name ?? ''}
                transactions={transactions}
                isLoading={isTxFetching}
            />

            <OutletDialog 
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={selectedOutlet ? "Edit Outlet" : "Add New Outlet"}
                description={selectedOutlet ? "Update the details of your existing store location." : "Create a new store location to start managing its inventory and sales."}
                onSubmit={handleSubmit}
                isLoading={addMutation.isPending || updateMutation.isPending}
                initialValues={selectedOutlet ? {
                    name: selectedOutlet.name,
                    address: selectedOutlet.address,
                    status: selectedOutlet.status
                } : undefined}
                buttonText={selectedOutlet ? "Update Outlet" : "Save Outlet"}
            />

            <ConfirmDialog 
                isOpen={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Delete Outlet?"
                description="This action cannot be undone. All data associated with this outlet will be permanently removed from the system."
                onConfirm={handleConfirmDelete}
                isLoading={deleteMutation.isPending}
                confirmText="Delete Outlet"
                variant="danger"
                icon={<Trash2 size={32} />}
            />
        </div>
    );
};

export default OutletSection;
