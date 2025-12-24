"use client";

import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathRendererProps {
  content: string;
  className?: string;
}

export function MathRenderer({ content, className }: MathRendererProps) {
  const renderContent = () => {
    if (!content) return null;

    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let partIndex = 0;

    // Simple approach: split by $ and process alternating segments
    // Even indices = normal text, odd indices = math
    const segments = content.split('$');
    
    segments.forEach((segment, index) => {
      if (segment === '') return; // Skip empty segments
      
      if (index % 2 === 0) {
        // Even index = normal text
        parts.push(
          <span key={`text-${partIndex++}`}>
            {segment}
          </span>
        );
      } else {
        // Odd index = math expression
        try {
          const html = katex.renderToString(segment, {
            displayMode: false,
            throwOnError: false,
            output: 'html',
            strict: false
          });
          
          parts.push(
            <span
              key={`math-${partIndex++}`}
              dangerouslySetInnerHTML={{ __html: html }}
              className="inline"
            />
          );
        } catch (error) {
          // If rendering fails, show the original text
          parts.push(
            <span key={`error-${partIndex++}`} className="text-red-400">
              ${segment}$
            </span>
          );
        }
      }
    });

    return parts.length > 0 ? <>{parts}</> : content;
  };

  return (
    <div className={className}>
      {renderContent()}
    </div>
  );
}
