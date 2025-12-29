import React from "react";
import Skeleton from "./Skeleton";

const ProfileSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-8">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
                <Skeleton className="h-10 w-24 rounded" />
                <Skeleton className="h-10 w-32 rounded" />
            </div>
        </div>
    );
};

export default ProfileSkeleton;
