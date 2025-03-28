// app/law/reasoning/page.tsx
'use client';
import { useState } from 'react';
import { uploadAndAnalyzePDF } from '@/backend/server-actions/law/reasoning/analyzePDF';

export default function ReasoningPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const result = await uploadAndAnalyzePDF(file);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Legal Reasoning Tool</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="btn btn-primary"
      >
        {isLoading ? 'Analyzing...' : 'Analyze PDF'}
      </button>
      {analysis && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Analysis Results</h2>
          <p><strong>Narrative:</strong> {analysis.narrative}</p>
          <p><strong>Legal Framework:</strong> {analysis.framework}</p>
          <p><strong>Reasoning:</strong> {analysis.reasoning}</p>
          <p><strong>Recommendation:</strong> {analysis.recommendation}</p>
        </div>
      )}
    </div>
  );
}