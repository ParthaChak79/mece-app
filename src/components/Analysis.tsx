import React, { useEffect, useRef } from 'react';
import { Problem } from '../types';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface AnalysisProps {
  problem: Problem;
  content: string;
}

export function Analysis({ problem, content }: AnalysisProps) {
  const analysisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [problem.id]);

  const formatContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      const indent = (line.match(/^[#-*\s]+/) || [''])[0].length;
      const formattedLine = line.replace(/^[#-*\s]+/, '').trim();
      
      if (!formattedLine) return null;

      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`py-2 flex items-start gap-2 ${
            indent === 0 ? 'mt-4' : 'mt-1'
          }`}
          style={{ paddingLeft: `${indent * 1.5}rem` }}
        >
          {indent > 0 && (
            <ChevronRight 
              className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" 
              style={{ 
                opacity: indent === 2 ? 0.5 : 1,
                transform: `scale(${indent === 2 ? 0.8 : 1})`
              }}
            />
          )}
          <span className={`
            ${indent === 0 ? 'text-xl font-bold text-gray-900 dark:text-white' : ''}
            ${indent === 1 ? 'text-lg font-semibold text-gray-800 dark:text-gray-200' : ''}
            ${indent === 2 ? 'text-base text-gray-700 dark:text-gray-300' : ''}
          `}>
            {formattedLine}
          </span>
        </motion.div>
      );
    });
  };

  return (
    <motion.div
      ref={analysisRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 scroll-mt-8"
    >
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              {problem.title}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {problem.description}
            </p>
          </motion.div>
          
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            {formatContent(content)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}