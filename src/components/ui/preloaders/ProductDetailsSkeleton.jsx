import React from "react";
import Skeleton from "./Skeleton";

const ProductDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            {/* Breadcrumb Skeleton */}
            <div className="max-w-7xl mx-auto px-4 py-4 mb-4">
                <Skeleton className="h-4 w-64" />
            </div>

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Image Gallery Skeleton */}
                <div className="lg:col-span-5 flex flex-col-reverse lg:flex-row gap-4 h-fit">
                    {/* Thumbnails */}
                    <div className="flex lg:flex-col gap-3">
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} className="w-16 h-16 lg:w-20 lg:h-20 rounded" />
                        ))}
                    </div>
                    {/* Main Image */}
                    <Skeleton className="flex-1 h-[400px] lg:h-[500px] rounded-lg" />
                </div>

                {/* MIDDLE COLUMN: Product Info Skeleton */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-3/4" />
                    </div>

                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-32" />
                    </div>

                    <div className="py-4 border-t border-b dark:border-gray-700 space-y-2">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>

                    <div className="space-y-3">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: Buy Box Skeleton */}
                <div className="lg:col-span-3">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 space-y-4">
                        <Skeleton className="h-8 w-32" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                        <Skeleton className="h-12 w-full mt-4" /> {/* Seller info */}

                        <div className="flex gap-3 mb-4">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-16" />
                        </div>

                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full rounded-full" />
                            <Skeleton className="h-12 w-full rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsSkeleton;
