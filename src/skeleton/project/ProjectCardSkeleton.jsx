const ProjectCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse flex flex-col">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-6 flex-grow">
            <div className="h-3 bg-gray-300 rounded w-20 mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
            <div className="flex flex-wrap gap-1.5 mt-4">
                <div className="h-4 w-10 bg-gray-300 rounded"></div>
                <div className="h-4 w-12 bg-gray-300 rounded"></div>
                <div className="h-4 w-8 bg-gray-300 rounded"></div>
            </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="h-5 w-20 bg-gray-300 rounded"></div>
            <div className="flex gap-2">
                <div className="h-5 w-10 bg-gray-300 rounded"></div>
                <div className="h-5 w-10 bg-gray-300 rounded"></div>
            </div>
        </div>
    </div>
);
export default ProjectCardSkeleton