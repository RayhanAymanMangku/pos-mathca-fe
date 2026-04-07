import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { User, Mail, LogOut, ChevronDown } from 'lucide-react'
import { useStore } from '@/store/store'
import { getInitials } from '@/lib/utils'
import { useShallow } from 'zustand/shallow'
import ConfirmDialog from '@/components/ui/confirm-dialog'

const UserPopover = () => {
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    
    const { user, logout, isLoading } = useStore(useShallow((state) => ({
        user: state.user,
        logout: state.logout,
        isLoading: state.isLoading,
    })));

    const handleLogoutConfirm = () => {
        logout();
        setIsLogoutOpen(false);
    };
    
    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl group cursor-pointer outline-hidden">
                        <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-800 font-bold text-xs shrink-0 ring-1 ring-green-200 shadow-sm">
                            {user?.name ? getInitials(user.name) : '?'}
                        </div>
                        <div className="hidden sm:flex flex-col items-start leading-none">
                            <span className="text-xs font-bold text-gray-900 leading-tight">{user?.name ?? 'User'}</span>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">{user?.role ?? '-'}</span>
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 transition-colors hidden sm:block" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0 border-none shadow-2xl rounded-2xl overflow-hidden ring-1 ring-gray-100 mt-2" align="end">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10 bg-white/80 backdrop-blur-sm">
                            <div className="animate-spin h-5 w-5 border-2 border-green-600 border-t-transparent rounded-full" />
                        </div>
                    ) : user ? (
                        <div className="bg-white">
                            {/* User header */}
                            <div className="flex items-center gap-3 p-5 bg-green-50/50 border-b border-green-100">
                                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-900 font-bold text-sm shrink-0 ring-1 ring-green-200 shadow-sm">
                                    {getInitials(user.name ?? 'U')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 text-sm truncate leading-tight">{user.name}</p>
                                    <p className="text-[11px] text-muted-foreground truncate font-medium mt-0.5">{user.email}</p>
                                </div>
                            </div>
 
                            {/* Details */}
                            <div className="p-3 space-y-1">
                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50/80 transition-colors group">
                                    <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-green-600 transition-colors">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mb-1">Full Name</p>
                                        <p className="text-xs font-semibold text-gray-800 leading-none">{user.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50/80 transition-colors group">
                                    <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-green-600 transition-colors">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mb-1">Email Address</p>
                                        <p className="text-xs font-semibold text-gray-800 truncate leading-none">{user.email}</p>
                                    </div>
                                </div>
                            </div>
 
                            <Separator className="mx-4 w-auto opacity-50" />
 
                            <div className="p-3">
                                <Button
                                    onClick={() => setIsLogoutOpen(true)}
                                    variant="ghost"
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-11 font-bold text-xs uppercase tracking-widest cursor-pointer outline-hidden"
                                >
                                    <div className="mr-3 h-8 w-8 rounded-lg flex items-center justify-center">
                                        <LogOut className="h-4 w-4" />
                                    </div>
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground text-sm bg-white">
                            No user data available
                        </div>
                    )}
                </PopoverContent>
            </Popover>

            <ConfirmDialog 
                isOpen={isLogoutOpen}
                onOpenChange={setIsLogoutOpen}
                title="Sign Out?"
                description="Are you sure you want to leave? Any unsaved changes in your current session might be lost.🍵"
                onConfirm={handleLogoutConfirm}
                confirmText="Sign Out Now"
                variant="primary"
                icon={<LogOut size={32} />}
            />
        </div>
    )
}
 
export default UserPopover