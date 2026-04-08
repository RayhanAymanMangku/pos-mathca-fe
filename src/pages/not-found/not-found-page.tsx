import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, MoveLeft, Ghost } from "lucide-react"

const NotFoundPage = () => {
    return (
        <div className="min-h-screen w-full bg-green-50/30 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-300/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-md w-full text-center relative z-10">
                {/* 404 Illustration Area */}
                <div className="relative mb-8 flex justify-center">
                    <div className="absolute inset-0 bg-green-100 rounded-full blur-3xl opacity-50 animate-pulse" />
                    <div className="relative h-40 w-40 rounded-full bg-white shadow-2xl shadow-green-900/10 flex items-center justify-center ring-1 ring-green-50">
                        <Ghost size={80} className="text-green-800/20 absolute" />
                        <span className="text-7xl font-black text-green-900 tracking-tighter mix-blend-multiply">
                            404
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Oops! Page spilled... 🍵
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-[320px] mx-auto">
                        We couldn't find the page you're looking for. It might have been moved or never existed in this tea shop.
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        asChild
                        variant="ghost"
                        className="group order-2 sm:order-1 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-xl px-6 h-12 transition-all cursor-pointer outline-hidden"
                        onClick={() => window.history.back()}
                    >
                        <div className="flex items-center gap-2">
                            <MoveLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Go Back
                        </div>
                    </Button>
                    
                    <Button
                        asChild
                        className="order-1 sm:order-2 bg-green-800 hover:bg-green-700 text-white rounded-xl px-8 h-12 text-xs font-bold uppercase tracking-widest shadow-lg shadow-green-900/20 transition-all hover:scale-[1.05] active:scale-95 cursor-pointer outline-hidden overflow-hidden group"
                    >
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <Home size={16} className="group-hover:rotate-12 transition-transform" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                {/* Footer Quote */}
                <p className="mt-12 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                    Brewing a better experience
                </p>
            </div>
        </div>
    )
}

export default NotFoundPage