import LoginForm from "@/features/auth/components/login-form"

const LoginPage = () => {
    const date = new Date().getFullYear()
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 uppercase tracking-tight">
            <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[50%] rounded-full bg-green-100/30 blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[50%] rounded-full bg-green-200/30 blur-[120px] animate-pulse delay-1000 pointer-events-none" />
            <div className="absolute top-1/4 right-[5%] h-[25%] w-[25%] rounded-full bg-yellow-50/40 blur-[100px] pointer-events-none" />
            
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            <div className="relative z-10 w-full px-4 flex justify-center animate-in fade-in zoom-in duration-700 ease-out sm:translate-y-[-20px]">
                <LoginForm/>
            </div>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest z-10">
                © {date} POS Matcha. Handcrafted for Excellence.
            </div>
        </div>
    )
}

export default LoginPage