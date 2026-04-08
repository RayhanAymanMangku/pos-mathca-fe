import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/store/store"
import { useShallow } from 'zustand/shallow'
import { formLoginSchema } from '../validators/login-schema'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type z from "zod"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useState } from "react"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { login, isLoading } = useStore(useShallow((state) => ({
        login: state.login,
        isLoading: state.isLoading,
    })))

    const form = useForm<z.infer<typeof formLoginSchema>>({
        resolver: zodResolver(formLoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof formLoginSchema>) => {
        try {
            const sanitizedValues = {
                ...values,
                email: values.email.trim().toLowerCase()
            };
            await login(sanitizedValues);
            const user = useStore.getState().user;
            toast.success(`Welcome back, ${user?.name}! 🍵`);
            
            if (user?.role === 'DRIVER') {
                navigate('/dashboard/pos');
            } else {
                navigate('/dashboard');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
            toast.error(errorMessage);
        }
    }

    return (
        <Card className="max-w-[440px] w-full rounded-[2.5rem] border-none shadow-2xl shadow-green-900/5 bg-white/80 backdrop-blur-xl ring-1 ring-white/20 p-2 sm:p-4">
            <CardHeader className='flex flex-col items-center gap-4 pb-8 pt-6'>
                <div className="relative group">
                    <div className="absolute inset-0 bg-green-200 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                    <div className="relative h-20 w-20 rounded-3xl bg-green-50 p-3 ring-1 ring-green-100 flex items-center justify-center overflow-hidden shadow-sm">
                        <img 
                            src="/assets/logo.jpg" 
                            alt="POS Matcha Logo" 
                            className="w-full h-full object-contain mix-blend-multiply opacity-90" 
                        />
                    </div>
                </div>
                
                <div className="text-center space-y-1.5 mt-2">
                    <CardTitle className='text-3xl font-bold tracking-tight text-gray-900'>Welcome Back</CardTitle>
                    <CardDescription className='text-sm font-medium text-muted-foreground'>
                        Enter your credentials to access your store
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="px-6 sm:px-8">
                <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FieldGroup className="gap-5">
                        <Controller
                            name='email'
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="space-y-2">
                                    <FieldLabel htmlFor='login-form-email' className='text-xs font-bold uppercase tracking-widest text-gray-500 ml-1'>
                                        Email Address
                                    </FieldLabel>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <Input
                                            {...field}
                                            id='login-form-email'
                                            aria-invalid={fieldState.invalid}
                                            placeholder='name@example.com'
                                            autoComplete='email'
                                            className={cn(
                                                "pl-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all duration-200",
                                                fieldState.invalid && "border-red-500 bg-red-50/30"
                                            )}
                                        />
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="ml-1" />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name='password'
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <FieldLabel htmlFor='login-form-password' className='text-xs font-bold uppercase tracking-widest text-gray-500'>
                                            Password
                                        </FieldLabel>
                                        {/* <button type="button" className="text-[10px] font-bold text-green-700 hover:text-green-800 uppercase tracking-widest transition-colors outline-hidden">
                                            Forgot Password?
                                        </button> */}
                                    </div>
                                    <div className='relative group'>
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <Input
                                            {...field}
                                            id='login-form-password'
                                            type={showPassword ? 'text' : 'password'}
                                            aria-invalid={fieldState.invalid}
                                            placeholder='••••••••'
                                            autoComplete='current-password'
                                            className={cn(
                                                "pl-10 pr-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all duration-200",
                                                fieldState.invalid && "border-red-500 bg-red-50/30"
                                            )}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowPassword(!showPassword)}
                                            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer outline-hidden'
                                            tabIndex={-1}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="ml-1" />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>

            <CardFooter className='flex flex-col gap-6 pt-8 pb-10 px-6 sm:px-8'>
                <Button 
                    disabled={isLoading} 
                    type="submit" 
                    className="bg-green-800 hover:bg-green-700 text-white w-full rounded-xl h-14 text-base font-bold shadow-lg shadow-green-900/10 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer outline-hidden" 
                    form="login-form"
                >
                    {isLoading ? <Spinner className='w-5 h-5 text-white/50 animate-spin' /> : 'Sign In'}
                </Button>
                
                <div className="text-center">
                    <p className="text-xs text-muted-foreground font-medium">
                        Don't have an account? <button className="text-green-700 font-bold hover:underline outline-hidden cursor-pointer">Contact Admin</button>
                    </p>
                </div>
            </CardFooter>
        </Card>
    )
}

export default LoginForm