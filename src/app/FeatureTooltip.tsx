'use client';
import React, { useState } from 'react';

interface FeatureTooltipProps {
  children: React.ReactNode;
  examples: string[];
  title?: string;
}

export default function FeatureTooltip({ children, examples, title }: FeatureTooltipProps) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      {children}
      {show && (
        <div className="absolute left-8 md:left-16 z-50 mt-3 w-80 max-w-xs bg-white/90 border border-gray-200 shadow-2xl rounded-xl p-4 text-gray-900 text-sm animate-fade-in" style={{backdropFilter: 'blur(8px)'}}>
          <div className="font-semibold mb-2 text-indigo-700 flex items-center gap-2">
            <span className="text-xl">💡</span> {title || 'Ejemplos para gráficas'}
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {examples.map((ex, i) => (
              <li key={i} className="text-gray-800">{ex}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
