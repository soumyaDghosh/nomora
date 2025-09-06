import { Link } from "react-router-dom";

interface QuickAccessCardProps {
    title: string;
    description: string;
    imageUrl: string;
    href?: string;
    onClick?: () => void;
    comingSoon?: boolean;
}

const QuickAccessCard = ({
    title,
    description,
    imageUrl,
    href,
    onClick,
    comingSoon = false
}: QuickAccessCardProps) => {
    const CardContent = () => (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col">
            <div className="relative mb-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                        src={imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMTIiIGZpbGw9IiM5Q0E5QjMiLz48L3N2Zz4=";
                        }}
                    />
                </div>
                {comingSoon && (
                    <div className="absolute -top-1 -right-1">
                        <span className="bg-gray-900 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                            Coming
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900 text-sm mb-1 leading-tight">
                    {title}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                    {description}
                </p>
            </div>
        </div>
    );

    if (onClick) {
        return (
            <button
                disabled={comingSoon}
                onClick={onClick}
                className="w-full h-full cursor-pointer"
            >
                <CardContent />
            </button>
        );
    }

    if (href && !comingSoon) {
        return (
            <Link to={href} className="block h-full">
                <CardContent />
            </Link>
        );
    }

    return <CardContent />;
}

export default QuickAccessCard