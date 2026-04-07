import { useEffect, useRef } from "react";
import { updateLocation } from "@/services/user-api";
import { useStore } from "@/store/store";
import { useShallow } from 'zustand/react/shallow';

const MIN_DISTANCE_METERS = 50;
const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6_371_000; // Earth radius in meters
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const useLocationTracking = () => {
    const { user, role } = useStore(useShallow((state) => ({
        user: state.user,
        role: state.role,
    })));

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    // Store last successfully sent coordinates to compare with new ones
    const lastSentRef = useRef<{ lat: number; lng: number } | null>(null);

    const trackLocation = async () => {
        if (!navigator.geolocation) {
            console.error("[Location Sync] Geolocation not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Skip update if driver hasn't moved MIN_DISTANCE_METERS since last sync
                if (lastSentRef.current) {
                    const distance = haversineMeters(
                        lastSentRef.current.lat,
                        lastSentRef.current.lng,
                        latitude,
                        longitude
                    );
                    if (distance < MIN_DISTANCE_METERS) {
                        console.log(`[Location Sync] Skipped — moved only ${distance.toFixed(1)}m (< ${MIN_DISTANCE_METERS}m)`);
                        return;
                    }
                }

                try {
                    await updateLocation(latitude, longitude);
                    lastSentRef.current = { lat: latitude, lng: longitude };
                    console.log(`[Location Sync] Updated: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                } catch (error) {
                    console.error("[Location Sync] Failed:", error);
                }
            },
            (error) => {
                console.error("[Location Sync] GPS error:", error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    useEffect(() => {
        if (user && role === "DRIVER") {
            // Immediate first sync on login
            trackLocation();

            intervalRef.current = setInterval(trackLocation, INTERVAL_MS);

            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        }
    }, [user, role]);
};
