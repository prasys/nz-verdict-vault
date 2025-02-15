interface ProcessCardProps {
    title: string;
    steps: string[];
}

export function ProcessCard({ title, steps }: ProcessCardProps) {
    return (
        <div className="card bg-base-200 mb-8">
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <ol className="list-decimal list-inside space-y-2">
                    {steps.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </div>
        </div>
    );
} 