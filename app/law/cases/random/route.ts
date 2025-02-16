import { getRandomCase } from '@/backend/server-actions/law/cases/getRandomCase';
import { redirect } from 'next/navigation';

export async function GET() {
    try {
        const randomCase = await getRandomCase();
        redirect(`/law/cases/${randomCase.documentId}`);
    } catch (error) {
        console.error('Error in random case route:', error);
        redirect('/law/cases');
    }
} 