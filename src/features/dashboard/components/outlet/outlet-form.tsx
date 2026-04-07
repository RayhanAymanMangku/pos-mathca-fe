import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { outletSchema, type OutletFormValues } from '../../validators/outlet-schema';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface OutletFormProps {
    initialValues?: OutletFormValues;
    onSubmit: (values: OutletFormValues) => void;
    isLoading: boolean;
    buttonText: string;
}

const OutletForm = ({
    initialValues,
    onSubmit,
    isLoading,
    buttonText
}: OutletFormProps) => {
    const form = useForm<OutletFormValues>({
        resolver: zodResolver(outletSchema),
        defaultValues: initialValues || {
            name: '',
            address: '',
            status: true,
        },
    });

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup className="gap-5">
                {/* Outlet Name */}
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                            <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                                Outlet Name
                            </FieldLabel>
                            <Input
                                {...field}
                                placeholder="Enter outlet name"
                                className="h-11 rounded-xl bg-gray-50/50 border-gray-100 focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                {/* Outlet Address */}
                <Controller
                    name="address"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                            <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                                Address
                            </FieldLabel>
                            <Input
                                {...field}
                                placeholder="Enter full address"
                                className="h-11 rounded-xl bg-gray-50/50 border-gray-100 focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                {/* Status Selection */}
                <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                        <Field className="space-y-1.5">
                            <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                                Status
                            </FieldLabel>
                            <div className="flex bg-gray-50/50 p-1 rounded-xl ring-1 ring-gray-100">
                                <button
                                    type="button"
                                    onClick={() => field.onChange(true)}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                                        field.value 
                                            ? "bg-green-600 text-white shadow-sm ring-1 ring-green-500" 
                                            : "text-gray-400 hover:text-gray-600"
                                    }`}
                                >
                                    Active
                                </button>
                                <button
                                    type="button"
                                    onClick={() => field.onChange(false)}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                                        !field.value 
                                            ? "bg-gray-400 text-white shadow-sm ring-1 ring-gray-300" 
                                            : "text-gray-400 hover:text-gray-600"
                                    }`}
                                >
                                    Inactive
                                </button>
                            </div>
                        </Field>
                    )}
                />
            </FieldGroup>

            <div className="pt-2">
                <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full h-11 rounded-xl bg-green-800 hover:bg-green-700 font-bold uppercase tracking-widest transition-all shadow-md shadow-green-900/10"
                >
                    {isLoading ? <Spinner className="size-4 mr-2" /> : buttonText}
                </Button>
            </div>
        </form>
    );
};

export default OutletForm;
