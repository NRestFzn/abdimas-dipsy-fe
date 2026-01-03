import { useMemo } from "react";

interface UseInfiniteSelectOptionsProps<T> {
    queryResult: any;
    labelKey: keyof T | ((item: T) => string);
    valueKey: keyof T;
}

export function useInfiniteSelectOptions<T>({ 
    queryResult, 
    labelKey, 
    valueKey 
}: UseInfiniteSelectOptionsProps<T>) {
    
    const { 
        data, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage, 
        isLoading 
    } = queryResult;

    const options = useMemo(() => {
        return data?.pages.flatMap((page: any) => {
            const dataArray = Array.isArray(page) ? page : (page.data || []);
            return dataArray?.map((item: T) => ({
                label: typeof labelKey === 'function' ? labelKey(item) : String(item[labelKey]),
                value: item[valueKey],
                original: item 
            }));
        }) || [];
    }, [data, labelKey, valueKey]);

    const onPopupScroll = (e: any) => {
        const target = e.target;
        if (!isFetchingNextPage && hasNextPage && 
            target.scrollTop + target.offsetHeight >= target.scrollHeight - 10) {
            fetchNextPage();
        }
    };

    return {
        options,
        onPopupScroll,
        isLoading,
        isFetchingNextPage
    };
}