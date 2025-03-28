'use client';
import { useState } from 'react';
import { uploadAndAnalyzePDF } from '@/backend/server-actions/law/reasoning/analyzePDF';

export default function ReasoningPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsLoading(true);
    setError(null); // Reset error
    try {
      const result = await uploadAndAnalyzePDF(file);
      setAnalysis(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Legal Reasoning Tool</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
          <button
            type="submit"
            disabled={isLoading || !file}
            className="btn w-full mb-8 btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Analyzing...' : 'Analyze PDF'}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        {analysis && (
          <div className="mt-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold">Legal Narrative</h2>
              <p className="text-gray-700">{analysis.narrative}</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold">Legal Framework</h2>
              <p className="text-gray-700">{analysis.framework}</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold">Reasoning</h2>
              <p className="text-gray-700">{analysis.reasoning}</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold">Recommendation</h2>
              <p className="text-gray-700">{analysis.recommendation}</p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}