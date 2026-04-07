import { useEffect } from "react";
import { useStore } from "@/store/store";
import { getOutletById } from "@/services/outlet-api";
import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";

export const useOutletSync = () => {
    const { user, outlet, setOutlet } = useStore(useShallow((state) => ({
        user: state.user,
        outlet: state.outlet,
        setOutlet: state.setOutlet,
    })));

    const outletId = user?.outletId;
    const hasOutlet = !!outlet;

    const { data: fetchedOutlet } = useQuery({
        queryKey: ["outlet", outletId],
        queryFn: () => getOutletById(outletId!),
        enabled: !!outletId && !hasOutlet,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (fetchedOutlet && !hasOutlet) {
            setOutlet(fetchedOutlet);
        }
    }, [fetchedOutlet, hasOutlet, setOutlet]);

    return {
        outletName: outlet?.name || "Matcha Branch",
        isLoading: !!outletId && !hasOutlet && !fetchedOutlet
    };
};
