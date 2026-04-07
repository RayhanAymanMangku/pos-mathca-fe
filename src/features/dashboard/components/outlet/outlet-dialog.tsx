import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import OutletForm from './outlet-form';
import type { OutletFormValues } from '../../validators/outlet-schema';
import { Store } from 'lucide-react';

interface OutletDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onSubmit: (values: OutletFormValues) => void;
  isLoading: boolean;
  initialValues?: OutletFormValues;
  buttonText: string;
}

const OutletDialog: React.FC<OutletDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  onSubmit,
  isLoading,
  initialValues,
  buttonText
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl p-0 overflow-hidden ring-1 ring-white/20">
        <DialogHeader className="pt-8 pb-6 px-8 bg-green-50/50 border-b border-green-100 flex flex-col items-center text-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-green-100/50 flex items-center justify-center text-green-700 ring-1 ring-green-200 shadow-sm">
            <Store strokeWidth={2.5} size={28} />
          </div>
          <div className="space-y-1.5">
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">{title}</DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="p-8">
            <OutletForm 
                onSubmit={onSubmit} 
                isLoading={isLoading} 
                initialValues={initialValues}
                buttonText={buttonText}
            />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OutletDialog;
