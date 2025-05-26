import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div> {/* Image Placeholder */}
      <div className="p-5">
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div> {/* Category Placeholder */}
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div> {/* Date Placeholder */}
        
        <div className="h-6 bg-gray-300 rounded w-full mb-2"></div> {/* Title Line 1 Placeholder */}
        <div className="h-6 bg-gray-300 rounded w-5/6 mb-4"></div> {/* Title Line 2 Placeholder */}
        
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div> {/* Description Line 1 */}
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div> {/* Description Line 2 */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div> {/* Description Line 3 */}
        
        <div className="h-4 bg-gray-300 rounded w-1/2"></div> {/* Source Placeholder */}
      </div>
    </div>
  );
};

export default SkeletonCard;
