import React, { useState } from 'react';
import { ProblemCard } from './components/ProblemCard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AddProblemModal } from './components/AddProblemModal';
import { LoadingAnalysis } from './components/LoadingAnalysis';
import { Analysis } from './components/Analysis';
import { ThemeToggle } from './components/ThemeToggle';
import { useProblemStore } from './store/problemStore';
import { generateMECEAnalysis } from './services/openai';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const {
    problems,
    selectedProblem,
    setSelectedProblem,
    analysis,
    setAnalysis,
    isAnalyzing,
    setIsAnalyzing,
    error,
    setError,
    addProblem,
    saveProblemAnswer
  } = useProblemStore();

  const [showApiKeyModal, setShowApiKeyModal] = useState(!localStorage.getItem('openai_api_key'));
  const [showAddProblemModal, setShowAddProblemModal] = useState(false);

  const handleProblemSelect = async (problem: typeof problems[0]) => {
    if (problem.answer) {
      setSelectedProblem(problem);
      setAnalysis({ content: problem.answer });
      return;
    }

    if (!localStorage.getItem('openai_api_key')) {
      setShowApiKeyModal(true);
      return;
    }
    
    try {
      setIsAnalyzing(true);
      setError(null);
      setAnalysis(null);
      setSelectedProblem(problem);
      const result = await generateMECEAnalysis(problem);
      setAnalysis(result);
      saveProblemAnswer(problem.id, result.content);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error analyzing problem:', errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApiKeySubmit = (apiKey: string) => {
    localStorage.setItem('openai_api_key', apiKey);
    setShowApiKeyModal(false);
    if (selectedProblem) {
      handleProblemSelect(selectedProblem);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
            MECE Problem Solver
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Select a business or personal challenge to analyze using the MECE framework
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddProblemModal(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="mr-2" size={20} />
            Add New Problem
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProblemCard
                problem={problem}
                onClick={() => handleProblemSelect(problem)}
              />
            </motion.div>
          ))}
        </div>

        {isAnalyzing && <LoadingAnalysis />}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 rounded-lg shadow-md"
          >
            {error}
          </motion.div>
        )}

        {selectedProblem && analysis && !isAnalyzing && (
          <Analysis problem={selectedProblem} content={analysis.content} />
        )}
      </div>

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSubmit={handleApiKeySubmit}
      />

      <AddProblemModal
        isOpen={showAddProblemModal}
        onClose={() => setShowAddProblemModal(false)}
        onSubmit={(problem) => {
          addProblem(problem);
          setShowAddProblemModal(false);
        }}
      />
    </div>
  );
}

export default App;