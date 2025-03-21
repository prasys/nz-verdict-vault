import CasesList from './CasesList';
import { SearchParams } from './types';
import { getCases } from './actions';

export default async function CasePage({ params }: PageProps) {
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const allCases = await getCases(searchParams);

    // Get the first 10 cases for the initial view
    const initialCases = allCases.slice(0, 10);

    return (
        <CasesList
            cases={initialCases}
            totalCases={allCases.length}
            searchParams={searchParams}
        />
    );
}
