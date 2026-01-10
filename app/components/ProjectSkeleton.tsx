export default function ProjectSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Skeleton Card */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {/* Image Skeleton */}
        <div className="relative h-48 bg-gray-700">
          {/* Featured Badge Skeleton */}
          <div className="absolute top-3 right-3 h-5 w-16 bg-gray-600 rounded"></div>
        </div>
        
        {/* Content Skeleton */}
        <div className="p-6">
          {/* Title Skeleton */}
          <div className="h-6 bg-gray-700 rounded mb-3"></div>
          
          {/* Description Skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
          </div>
          
          {/* Tech Stack Skeleton */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-6 bg-gray-700 rounded-full w-16"></div>
            <div className="h-6 bg-gray-700 rounded-full w-20"></div>
            <div className="h-6 bg-gray-700 rounded-full w-16"></div>
            <div className="h-6 bg-gray-700 rounded-full w-24"></div>
          </div>
          
          {/* Links Skeleton */}
          <div className="flex gap-3">
            <div className="h-8 bg-gray-700 rounded-lg w-28"></div>
            <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
