import { IoScale, IoSearch, IoSparkles, IoChatbubbleEllipses, IoList } from 'react-icons/io5';
import Link from 'next/link';

const features = [
    {
        title: "Case Search",
        description: "Search through New Zealand's legal case database with AI-powered insights",
        icon: IoSearch,
        href: "/law/search",
        color: "bg-blue-500",
        actionText: "Start Searching"
    },
    {
        title: "Browse Cases",
        description: "Explore our comprehensive database of New Zealand legal cases",
        icon: IoList,
        href: "/law/cases",
        color: "bg-emerald-500",
        actionText: "Browse Cases"
    },
    {
        title: "I'm Feeling Lucky",
        description: "Discover a random interesting legal case from our database",
        icon: IoSparkles,
        href: "/law/cases/random",
        color: "bg-yellow-500",
        actionText: "Try Your Luck",
        badge: "New"
    },
    {
        title: "AI Legal Assistant",
        description: "Chat with our AI to get legal insights and case analysis",
        icon: IoChatbubbleEllipses,
        href: "/law/chat",
        color: "bg-purple-500",
        actionText: "Start Chat",
        badge: "New"
    }
];

export default function LawPage() {
    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-4">
                        <IoScale className="w-16 h-16 text-blue-600" />
                        <div className="absolute -top-2 -left-2 w-20 h-20 bg-blue-600 rounded-full opacity-20 animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to LawQ
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Your AI-powered platform for legal research and analysis
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                    {features.map((feature) => (
                        <Link
                            href={feature.href}
                            key={feature.title}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 h-full">
                                <div className="flex items-start gap-4">
                                    <div className={`${feature.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {feature.title}
                                            </h2>
                                            {feature.badge && (
                                                <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                                                    {feature.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-2 text-gray-600">
                                            {feature.description}
                                        </p>
                                        <div className="mt-4">
                                            <span className="inline-flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all duration-300">
                                                {feature.actionText}
                                                <svg className="w-0 h-5 group-hover:w-5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
} 