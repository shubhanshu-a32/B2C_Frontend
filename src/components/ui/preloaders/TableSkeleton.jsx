import React from "react";
import Skeleton from "./Skeleton";

const TableSkeleton = () => {
    return (
        <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Skeleton className="h-6 w-32" />
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <Skeleton className="h-16 w-16 rounded-md" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-1/3" />
                                <Skeleton className="h-4 w-1/4" />
                            </div>
                        </div>
                        <div className="hidden md:flex gap-4">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableSkeleton;
