import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserFormValues } from "../../validators/user-schema";
import { Field, FieldLabel, FieldError, FieldGroup, FieldContent } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { Outlet } from "@/types/outlet";
import { Truck, MapPin, KeyRound, Lock, Eye, EyeOff } from "lucide-react";

interface UserFormProps {
  initialValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => void;
  isLoading: boolean;
  isEditingSelf?: boolean;
  buttonText: string;
  outlets: Outlet[];
}

const UserForm = ({
  initialValues,
  onSubmit,
  isLoading,
  isEditingSelf,
  buttonText,
  outlets,
}: UserFormProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      password: "",
      currentPassword: "",
      phone: initialValues?.phone || "",
      role: initialValues?.role || "DRIVER",
      outletId: initialValues?.outletId || "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="gap-5">
        {/* Full Name */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-1.5">
              <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                Staff Name
              </FieldLabel>
              <Input
                {...field}
                placeholder="Enter personnel name"
                className="h-11 rounded-xl bg-gray-50/50 border-gray-100 focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all shadow-sm"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Email & Phone Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                  Auth Email
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="staff@matcha.com"
                  className="h-11 rounded-xl bg-gray-50/50 border-gray-100 focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all shadow-sm"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                  Contact Number
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="08..."
                  className="h-11 rounded-xl bg-gray-50/50 border-gray-100 focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all shadow-sm"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Password Group */}
        <div className="flex flex-col gap-5">
          {isEditingSelf && initialValues && (
            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                  <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Current Key
                  </FieldLabel>
                  <FieldContent>
                    <div className="relative w-full">
                      <Input
                        {...field}
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-10 rounded-xl bg-gray-50/50 border-gray-100 focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all shadow-sm pl-9 pr-10 text-xs w-full"
                      />
                      <KeyRound size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700 transition-colors cursor-pointer"
                      >
                        {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-[9px]" />}
                  </FieldContent>
                </Field>
              )}
            />
          )}

          {/* New Password */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  {initialValues ? "New Key" : "Security Cipher"}
                </FieldLabel>
                <FieldContent>
                  <div className="relative w-full">
                    <Input
                      {...field}
                      type={showNewPassword ? "text" : "password"}
                      placeholder={initialValues ? "••••••••" : "••••••••"}
                      className="h-10 rounded-xl bg-gray-50/50 border-gray-100 focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all shadow-sm pl-9 pr-10 text-xs w-full"
                    />
                    <Lock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700 transition-colors cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-[9px]" />}
                </FieldContent>
              </Field>
            )}
          />
        </div>

        {/* Role & Station Group */}
        {!isEditingSelf && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                  <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                    System Rank
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-2 focus:ring-green-600/20 font-bold text-xs shadow-sm">
                      <SelectValue placeholder="Select rank" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100 shadow-xl bg-white overflow-hidden">
                      <SelectItem value="DRIVER" className="text-xs font-bold focus:bg-blue-50 rounded-lg cursor-pointer py-2.5">
                        <div className="flex items-center gap-2">
                          <Truck size={14} className="text-blue-700" />
                          FIELD DRIVER
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="outletId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                  <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                    Base Station
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-2 focus:ring-green-600/20 font-bold text-xs shadow-sm">
                      <SelectValue placeholder="Select outlet" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100 shadow-xl bg-white overflow-hidden">
                      {outlets.map((outlet) => (
                        <SelectItem key={outlet.id} value={outlet.id} className="text-xs font-bold focus:bg-green-50 rounded-lg cursor-pointer py-2.5">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-green-700" />
                            {outlet.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        )}
      </FieldGroup>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-green-800 hover:bg-green-700 text-white rounded-xl font-bold uppercase tracking-widest shadow-md shadow-green-900/10 transition-all active:scale-[0.98]"
        >
          {isLoading ? <Spinner className="size-4 mr-2" /> : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
