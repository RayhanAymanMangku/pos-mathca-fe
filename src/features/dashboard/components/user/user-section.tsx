import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/user-api";
import { getOutlets } from "@/services/outlet-api";
import UserTable from "./user-table";
import UserDialog from "./user-dialog";
import type { User, CreateUserPayload } from "@/types/user";
import type { UserFormValues } from "../../validators/user-schema";
import { toast } from "sonner";
import { Plus, RefreshCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { useResourceDialog } from "@/hooks/use-resource-dialog";


const UserSection = () => {
  const queryClient = useQueryClient();
  const {
    isOpen,
    isConfirmOpen,
    selectedItem: selectedUser,
    itemToDelete: userToDelete,
    handleAdd,
    handleEdit,
    handleDeleteTrigger,
    closeDialog,
    closeConfirm,
  } = useResourceDialog<User>();

  const currentUser = useStore(useShallow((state) => state.user));
  const isEditingSelf = selectedUser?.id === currentUser?.id;

  // Fetch Users
  const {
    data: users = [],
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // Fetch Outlets (for the dialog)
  const { data: outlets = [] } = useQuery({
    queryKey: ["outlets"],
    queryFn: getOutlets,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Personnel deployed successfully! 🍵");
      closeDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to deploy personnel");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateUserPayload> }) =>
      updateUser(id, data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      // If editing self, update the store to reflect changes immediately
      if (isEditingSelf && updatedUser) {
        useStore.getState().setUser(updatedUser as User);
      }
      
      toast.success("Personnel profile updated! 🍵");
      closeDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Personnel removed from system");
      closeConfirm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove personnel");
    },
  });


  const handleSubmit = (values: UserFormValues) => {
    // Sanitize data: remove empty strings for password and outletId
    const sanitizedData = { ...values };
    
    if (!sanitizedData.password) {
      delete sanitizedData.password;
    }
    
    if (!sanitizedData.currentPassword) {
      delete sanitizedData.currentPassword;
    }
    
    if (!sanitizedData.outletId) {
      delete sanitizedData.outletId;
    }

    if (selectedUser) {
      updateMutation.mutate({ id: selectedUser.id, data: sanitizedData });
    } else {
      createMutation.mutate(sanitizedData as CreateUserPayload);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 p-6 rounded-2xl border border-gray-100 ring-1 ring-gray-50/50 shadow-xs backdrop-blur-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 leading-tight flex items-center gap-2">
            Personnel Directory
          </h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-none">
            Manage your staff infrastructure and system access.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isUsersFetching && <Spinner className="size-4 text-green-700" />}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isUsersFetching}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-green-700 hover:border-green-100 hover:bg-green-50/50 shadow-xs transition-all outline-hidden cursor-pointer group"
          >
            <RefreshCcw size={15} className="group-active:rotate-180 transition-transform duration-500" />
          </button>
          <Button
            onClick={handleAdd}
            disabled={isUsersLoading}
            className="bg-green-800 hover:bg-green-700 text-white rounded-xl h-10 px-4 font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-md shadow-green-900/10 outline-hidden"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className={isUsersFetching && !isUsersLoading ? "opacity-60 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}>
        {isUsersLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-sm rounded-2xl border border-dashed border-gray-200 gap-4">
                <Spinner className="size-8 text-green-600 opacity-20" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Synchronizing HQ Personnel</p>
            </div>
        ) : (
            <UserTable
              users={users}
              onEdit={handleEdit}
              onDelete={handleDeleteTrigger}
            />
        )}
      </div>

      {/* Dialogs */}
      <UserDialog
        isOpen={isOpen}
        onOpenChange={closeDialog}
        title={selectedUser ? "Update Personnel" : "Deploy Personnel"}
        description={selectedUser ? "Update credentials and roles for this staff member." : "Register a new personnel member into our system infrastructure."}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        isEditingSelf={isEditingSelf}
        initialValues={selectedUser ? {
          name: selectedUser.name,
          email: selectedUser.email,
          phone: selectedUser.phone,
          role: selectedUser.role,
          outletId: selectedUser.outletId || "", 
          password: "", 
          currentPassword: "", 
        } : undefined}
        outlets={outlets}
        buttonText={selectedUser ? "Update Profile" : "Deploy Personnel"}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onOpenChange={closeConfirm}
        title="Revoke System Access?"
        description="This will permanently remove the personnel member from our core infrastructure. This action is irreversible."
        onConfirm={() => userToDelete && deleteMutation.mutate(userToDelete)}
        isLoading={deleteMutation.isPending}
        confirmText="Revoke Access"
        variant="danger"
        icon={<Trash2 size={32} />}
      />
    </div>
  );
};

export default UserSection;
