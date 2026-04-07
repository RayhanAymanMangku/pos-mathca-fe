import { useLocation } from "react-router-dom";

export interface BreadcrumbSegment {
    path: string;
    display: string;
    isLast: boolean;
}

export const useBreadcrumb = () => {
    const location = useLocation();
    const pathname = location.pathname;

    const pathSegments = pathname.split('/').filter(s => s.length > 0);
    const breadcrumbSegments = pathSegments.filter(s => s !== 'dashboard');

    const segments: BreadcrumbSegment[] = breadcrumbSegments.map((segment, index, array) => ({
        path: '/' + pathSegments.slice(0, index + 2).join('/'),
        display: segment.charAt(0).toUpperCase() + segment.slice(1),
        isLast: index === array.length - 1,
    }));

    return { segments, pathname };
};
