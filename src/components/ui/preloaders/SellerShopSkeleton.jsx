import React from "react";
import Skeleton from "./Skeleton";
import ProductSkeleton from "./ProductSkeleton";

const SellerShopSkeleton = () => {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Hero Skeleton */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 w-full" />
                <div className="px-6 pb-6 mt-[-3rem] relative z-10">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Avatar */}
                        <Skeleton className="w-24 h-24 rounded-2xl shadow-lg border-4 border-white dark:border-gray-800" />

                        {/* Info */}
                        <div className="flex-1 pt-0 md:pt-14 space-y-3">
                            <Skeleton className="h-8 w-64" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-32 rounded-full" />
                                <Skeleton className="h-6 w-48 rounded-full" />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="pt-0 md:pt-14 flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                            <Skeleton className="h-10 w-24 rounded-xl" />
                            <Skeleton className="h-10 w-32 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="space-y-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SellerShopSkeleton;
