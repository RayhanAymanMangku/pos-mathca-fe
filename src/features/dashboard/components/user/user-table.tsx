import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { User } from "@/types/user";
import { Edit, Trash2, MoreHorizontal, ShieldCheck, Truck, Map as MapIcon, Signal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import DriverMapModal from "./driver-map-modal";

const ITEMS_PER_PAGE = 8;

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => {
  const currentUser = useStore(useShallow((state) => state.user));
  const [selectedDriver, setSelectedDriver] = useState<User | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(users.length / ITEMS_PER_PAGE));
  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOpenMap = (user: User) => {
    setSelectedDriver(user);
    setIsMapOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-2xl shadow-green-900/5 overflow-hidden ring-1 ring-gray-100">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 py-5 pl-8">Staff Member</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Auth & ID</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Position</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Live Map</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-8 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 opacity-40">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">No personnel detected</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-green-50/30 border-gray-100 transition-colors group">
                  <TableCell className="py-5 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-black text-xs ring-1 ring-white shadow-sm transition-transform group-hover:scale-105">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{user.name}</span>
                        <span className="text-[10px] font-medium text-gray-400">{user.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700">{user.email}</span>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">Verified Account</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-xs",
                          user.role === 'ADMIN'
                            ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                            : "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          {user.role === 'ADMIN' ? <ShieldCheck size={12} strokeWidth={2.5} /> : <Truck size={12} strokeWidth={2.5} />}
                          {user.role}
                        </div>
                      </Badge>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        @ {user.outlet?.name || "Unassigned"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role === "DRIVER" ? (
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenMap(user)}
                          className="h-8 rounded-xl px-3 bg-white border-gray-100 shadow-xs hover:border-green-600 hover:text-green-700 transition-all cursor-pointer outline-hidden group/map"
                        >
                          <MapIcon className="size-3.5 mr-2 group-hover/map:scale-110 transition-transform" strokeWidth={2.5} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Track</span>
                        </Button>
                        <div className="flex items-center gap-1.5 opacity-50">
                          <Signal className="size-3 text-gray-400" />
                          <span className="text-[8px] font-black uppercase tracking-tighter text-gray-400">Live</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-8 h-1 bg-gray-100 rounded-full opacity-30" />
                    )}
                  </TableCell>
                  <TableCell className="px-8 text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-white hover:shadow-sm border-transparent hover:border-gray-100 transition-all cursor-pointer outline-hidden">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-1.5 border-none shadow-xl rounded-2xl ring-1 ring-gray-100 bg-white/95 backdrop-blur-lg" align="end">
                        <Button
                          variant="ghost"
                          onClick={() => onEdit(user)}
                          className="w-full justify-start text-[11px] font-bold text-gray-700 hover:text-green-700 hover:bg-green-50/80 rounded-xl h-10 px-3 transition-all cursor-pointer outline-hidden group"
                        >
                          <Edit className="mr-2 h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                          Edit Profile
                        </Button>
                        {user.id !== currentUser?.id && (
                          <Button
                            variant="ghost"
                            onClick={() => onDelete(user.id)}
                            className="w-full justify-start text-[11px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl h-10 px-3 transition-all cursor-pointer outline-hidden group"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                            Delete User
                          </Button>
                        )}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, users.length)} of {users.length} staff
          </p>
          <Pagination>
            <PaginationContent className="flex-wrap gap-2">
              <PaginationItem>
                <PaginationPrevious
                  className={cn(
                    "cursor-pointer hover:bg-green-50 hover:text-green-700 border-gray-100 rounded-2xl h-10 px-4 text-[10px] font-black uppercase tracking-widest transition-all shadow-xs bg-white",
                    currentPage === 1 && "pointer-events-none opacity-40 grayscale"
                  )}
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i} className="hidden sm:inline-block">
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    className={cn(
                      "cursor-pointer rounded-2xl h-10 w-10 text-[10px] font-black transition-all shadow-xs",
                      currentPage === i + 1
                        ? "bg-green-700 text-white hover:bg-green-800 shadow-lg shadow-green-900/10 border-green-600"
                        : "hover:bg-green-50 hover:text-green-700 border-gray-100 text-gray-400 bg-white"
                    )}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  className={cn(
                    "cursor-pointer hover:bg-green-50 hover:text-green-700 border-gray-100 rounded-2xl h-10 px-4 text-[10px] font-black uppercase tracking-widest transition-all shadow-xs bg-white",
                    currentPage === totalPages && "pointer-events-none opacity-40 grayscale"
                  )}
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <DriverMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        driver={selectedDriver}
      />
    </div>
  );
};

export default UserTable;
