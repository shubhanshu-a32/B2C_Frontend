import React from "react";
import Skeleton from "./Skeleton";

const ProductSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col border border-transparent dark:border-gray-700 h-full">
            {/* Image Placeholder */}
            <Skeleton className="h-44 w-full rounded-lg mb-3" />

            {/* Title Placeholder */}
            <Skeleton className="h-6 w-3/4 mb-2" />

            {/* Rating & Reviews Placeholder */}
            <div className="flex items-center gap-2 mb-3">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-4 w-8" />
            </div>

            {/* Description Placeholder */}
            <div className="space-y-1 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Footer (Price & Buttons) */}
            <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                {/* Price */}
                <Skeleton className="h-8 w-20" />

                {/* Buttons */}
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 p-2 rounded border" /> {/* Wishlist */}
                    <Skeleton className="h-9 w-24 rounded" /> {/* Add to Cart */}
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
