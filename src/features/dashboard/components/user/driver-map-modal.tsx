import { Dialog as DialogPrimitive } from "radix-ui";
import type { User } from "@/types/user";
import { format, formatDistanceToNow, differenceInHours } from "date-fns";
import { Building2, ExternalLink, X, Wifi, WifiOff, RefreshCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDriverLocations } from "@/services/user-api";


const toUtcDate = (dateStr: string): Date => {
  const normalized = dateStr
    .replace(' ', 'T')                           // '2026-04-07 02:...' → '2026-04-07T02:...'
    .replace(/([.\d]+)$/, (m) => m + 'Z');       // append Z if no timezone suffix
  return new Date(normalized);
};

function OsmMapIframe({ lat, lng }: { lat: number; lng: number }) {
  const delta = 0.008;
  const west = (lng - delta).toFixed(6);
  const south = (lat - delta).toFixed(6);
  const east = (lng + delta).toFixed(6);
  const north = (lat + delta).toFixed(6);
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <iframe
      src={src}
      width="100%"
      height="100%"
      style={{ border: "none", display: "block" }}
      title="Driver Location Map"
      loading="lazy"
    />
  );
}

interface DriverMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: User | null;
}

export default function DriverMapModal({ isOpen, onClose, driver: initialDriver }: DriverMapModalProps) {
  const { data: liveDrivers = [], isLoading, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["driver-locations"],
    queryFn: getDriverLocations,
    enabled: isOpen,
    refetchInterval: 5 * 60 * 1000,      // 5 min — matches driver's update cadence
    refetchIntervalInBackground: false,   // pause when tab not focused
    staleTime: 5 * 60 * 1000,
  });

  if (!initialDriver) return null;

  const liveDriver = liveDrivers.find((d) => d.id === initialDriver.id);
  const driver = liveDriver ? { ...initialDriver, ...liveDriver } : initialDriver;

  const lat = driver.latitude ? Number(driver.latitude) : null;
  const lng = driver.longitude ? Number(driver.longitude) : null;
  const hasLocation = lat !== null && lng !== null;

  const lastContact =
    driver.locationUpdatedAt ||
    (liveDriver && hasLocation && dataUpdatedAt
      ? new Date(dataUpdatedAt).toISOString()
      : null) ||
    driver.updatedAt ||
    null;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />

        {/* Content — bypasses shadcn sm:max-w-sm entirely */}
        <DialogPrimitive.Content
          className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl bg-white rounded-2xl shadow-2xl outline-none overflow-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between gap-4 px-8 py-5 border-b border-gray-100">
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-11 w-11 rounded-xl bg-green-600 text-white flex items-center justify-center text-base font-black shadow shrink-0">
                {driver.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <DialogPrimitive.Title className="text-base font-black text-gray-900 leading-none truncate">
                  {driver.name}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mt-1">
                  Live GPS Monitoring
                </DialogPrimitive.Description>
              </div>
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shrink-0 ${hasLocation ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                <div className={`h-1.5 w-1.5 rounded-full ${hasLocation ? "bg-green-500 animate-pulse" : "bg-amber-500"}`} />
                {isLoading ? "Syncing..." : hasLocation ? "Signal Active" : "Awaiting Signal"}
              </div>
            </div>

            <DialogPrimitive.Close
              className="h-9 w-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer outline-none shrink-0"
              aria-label="Close"
            >
              <X size={18} strokeWidth={2.5} />
            </DialogPrimitive.Close>
          </div>

          {/* ── Info Cards ── */}
          <div className="grid grid-cols-2 gap-4 px-8 py-4 border-b border-gray-100 bg-gray-50/40">
            <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-gray-100 shadow-xs">
              <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                <Building2 size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Station / Outlet</p>
                <p className="text-sm font-bold text-gray-900 truncate">{driver.outlet?.name ?? "Unassigned"}</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3.5 bg-white rounded-xl border shadow-xs ${lastContact && differenceInHours(new Date(), toUtcDate(lastContact)) > 6 ? "border-amber-200 bg-amber-50/30" : "border-gray-100"}`}>
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${lastContact && differenceInHours(new Date(), toUtcDate(lastContact)) > 6 ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-600"}`}>
                {hasLocation ? <Wifi size={16} /> : <WifiOff size={16} />}
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Last GPS Sync</p>
                {lastContact ? (
                  <>
                    <p className="text-xs font-bold text-gray-900 leading-none">
                      {format(toUtcDate(lastContact), "HH:mm:ss, dd MMM")}
                    </p>
                    <p className={`text-[9px] font-black mt-1 uppercase tracking-widest ${
                      differenceInHours(new Date(), toUtcDate(lastContact)) > 6
                        ? "text-amber-500"
                        : "text-gray-400"
                    }`}>
                      {differenceInHours(new Date(), toUtcDate(lastContact)) > 6 ? "⚠ " : ""}
                      {formatDistanceToNow(toUtcDate(lastContact), { addSuffix: true })}
                    </p>
                  </>
                ) : (
                  <p className="text-xs font-bold text-gray-400">Not yet synced</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Map (iframe) ── */}
          <div style={{ height: "480px", overflow: "hidden", position: "relative" }}>
            {!hasLocation ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 gap-4">
                <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <WifiOff size={32} strokeWidth={2} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-gray-800 uppercase tracking-tight">No GPS Signal</p>
                  <p className="text-[11px] text-gray-400 mt-1">Driver hasn't sent coordinates yet</p>
                </div>
                <button
                  onClick={() => refetch()}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <RefreshCcw size={12} /> Refresh
                </button>
              </div>
            ) : (
              <>
                {/* GPS Fix overlay */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2.5 rounded-xl shadow-lg border border-gray-100" style={{ zIndex: 10 }}>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">GPS Fix</p>
                  <p className="text-xs font-black text-gray-900 tabular-nums">{lat.toFixed(6)}, {lng.toFixed(6)}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ExternalLink size={9} /> Google Maps
                  </a>
                </div>

                <OsmMapIframe lat={lat} lng={lng} />
              </>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Auto-sync every 10s
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-gray-700 transition-colors cursor-pointer active:scale-95"
            >
              Close
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
