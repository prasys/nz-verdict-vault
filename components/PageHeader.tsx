import { IconType } from 'react-icons';

interface PageHeaderProps {
    icon: IconType;
    title: string;
    description: string;
}

export function PageHeader({ icon: Icon, title, description }: PageHeaderProps) {
    return (
        <div className="text-center mb-8">
            <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-base-content/70">
                {description}
            </p>
        </div>
    );
} 