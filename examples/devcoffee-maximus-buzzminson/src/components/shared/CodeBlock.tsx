import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {highlightCode} from '../../utils/syntaxHighlight';

interface CodeBlockProps {
  code: string;
  startFrame?: number;
  endFrame?: number;
  highlightLines?: number[];
  style?: React.CSSProperties;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  startFrame = 0,
  endFrame = 30,
  highlightLines = [],
  style = {},
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const lines = code.split('\n');

  return (
    <div
      style={{
        opacity,
        ...style,
      }}
      className="code-font text-sm bg-code-background text-gray-300 p-6 rounded-lg shadow-2xl border border-gray-700"
    >
      {lines.map((line, index) => {
        const lineNumber = index + 1;
        const isHighlighted = highlightLines.includes(lineNumber);

        return (
          <div
            key={index}
            className={`${
              isHighlighted ? 'bg-yellow-500 bg-opacity-20 border-l-4 border-yellow-500 pl-2' : ''
            }`}
          >
            <span className="text-gray-600 select-none mr-4 inline-block w-8 text-right">
              {lineNumber}
            </span>
            <span>{highlightCode(line)}</span>
          </div>
        );
      })}
    </div>
  );
};
