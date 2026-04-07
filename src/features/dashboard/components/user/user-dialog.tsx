import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { User as UserIcon } from "lucide-react";
import UserForm from "./user-form";
import type { UserFormValues } from "../../validators/user-schema";
import type { Outlet } from "@/types/outlet";

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onSubmit: (values: UserFormValues) => void;
  isLoading: boolean;
  isEditingSelf?: boolean;
  initialValues?: UserFormValues;
  outlets: Outlet[];
  buttonText: string;
}

const UserDialog = ({
  isOpen,
  onOpenChange,
  title,
  description,
  onSubmit,
  isLoading,
  isEditingSelf,
  initialValues,
  outlets,
  buttonText,
}: UserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl p-0 overflow-hidden ring-1 ring-white/20">
        <DialogHeader className="pt-8 pb-6 px-10 bg-green-50/50 border-b border-green-100 flex flex-col items-center text-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-green-100/50 flex items-center justify-center text-green-700 ring-1 ring-green-200 shadow-sm relative">
            <UserIcon strokeWidth={2.5} size={28} />
          </div>
          <div className="space-y-1.5">
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 leading-none">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed px-4">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="p-10">
          <UserForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            isEditingSelf={isEditingSelf}
            initialValues={initialValues}
            outlets={outlets}
            buttonText={buttonText}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
