import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {beforeCode} from '../../data/codeSnippets';
import {highlightCode} from '../../utils/syntaxHighlight';

export const CodeEditor: React.FC = () => {
  const frame = useCurrentFrame();

  // Character-by-character typing effect
  const charsToShow = Math.floor(
    interpolate(frame, [0, 120], [0, beforeCode.length], {
      extrapolateRight: 'clamp',
    })
  );

  const displayedCode = beforeCode.substring(0, charsToShow);

  // Split into lines for syntax highlighting
  const lines = displayedCode.split('\n');
  const lastLineIndex = lines.length - 1;
  const lastLine = lines[lastLineIndex];

  // "Feature Complete" checkmark appears at frame 120
  const checkmarkOpacity = interpolate(frame, [120, 135], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill className="flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-3xl w-full mx-8">
        {/* Editor header */}
        <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center gap-2 border-b border-gray-700">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-gray-400 text-sm">fetchUserData.js</span>
        </div>

        {/* Code content */}
        <div className="bg-code-background rounded-b-lg p-6 code-font text-sm text-gray-300 relative min-h-[400px]">
          <pre className="whitespace-pre-wrap leading-relaxed">
            {lines.map((line, index) => {
              // For the last line (currently being typed), only highlight what's shown
              if (index === lastLineIndex) {
                return (
                  <div key={index}>
                    {highlightCode(line)}
                    <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1" />
                  </div>
                );
              }
              // For complete lines, show full highlighting
              return <div key={index}>{highlightCode(line)}</div>;
            })}
          </pre>

          {/* Feature Complete badge */}
          <div
            style={{opacity: checkmarkOpacity}}
            className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
          >
            <span className="text-xl">✓</span>
            <span className="font-semibold">Feature Complete</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
