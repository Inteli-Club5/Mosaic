import { cn } from "../../lib/utils";
import React, { useState } from "react";
 
/**
 * InteractiveGridPattern is a component that renders a grid pattern with interactive squares.
 *
 * @param width - The width of each square.
 * @param height - The height of each square.
 * @param squares - The number of squares in the grid. The first element is the number of horizontal squares, and the second element is the number of vertical squares.
 * @param className - The class name of the grid.
 * @param squaresClassName - The class name of the squares.
 */
interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number]; // [horizontal, vertical]
  className?: string;
  squaresClassName?: string;
}
 
/**
 * The InteractiveGridPattern component.
 *
 * @see InteractiveGridPatternProps for the props interface.
 * @returns A React component.
 */
export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares;
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  const [trailSquares, setTrailSquares] = useState<{ index: number; opacity: number }[]>([]);
 
  return (
    <svg
      className={cn(
        "absolute inset-0 h-full w-full",
        className,
      )}
      viewBox={`0 0 ${width * horizontal} ${height * vertical}`}
      preserveAspectRatio="none"
      style={{ 
        width: '100%', 
        height: '100%'
      }}
      {...props}
    >
      {/* Background que respeita o container */}
      <rect
        x={0}
        y={0}
        width={width * horizontal}
        height={height * vertical}
        fill="white"
      />
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width;
        const y = Math.floor(index / horizontal) * height;
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            fill="transparent"
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth="1"
            className={cn(
              "transition-all duration-200 ease-in-out",
              squaresClassName,
            )}
            style={{
              fill: hoveredSquare === index 
                ? "rgba(59, 130, 246, 0.4)" 
                : trailSquares.find(t => t.index === index)
                  ? `rgba(59, 130, 246, ${trailSquares.find(t => t.index === index)?.opacity || 0})`
                  : "transparent",
              stroke: hoveredSquare === index 
                ? "rgba(59, 130, 246, 0.8)" 
                : trailSquares.find(t => t.index === index)
                  ? `rgba(59, 130, 246, ${(trailSquares.find(t => t.index === index)?.opacity || 0) + 0.2})`
                  : "rgba(0, 0, 0, 0.1)",
              pointerEvents: 'auto'
            }}
            onMouseEnter={() => setHoveredSquare(index)}
            onMouseLeave={() => {
              // Adicionar ao rastro
              setTrailSquares(prev => {
                const newTrail = [...prev.filter(t => t.index !== index), { index, opacity: 0.3 }];
                return newTrail.slice(-20); // Manter apenas os últimos 20 quadrados
              });
              
              // Fade out gradual do rastro
              const fadeOut = (currentIndex: number, currentOpacity: number) => {
                setTimeout(() => {
                  setTrailSquares(prev => 
                    prev.map(t => 
                      t.index === currentIndex 
                        ? { ...t, opacity: Math.max(0, t.opacity - 0.1) }
                        : t
                    ).filter(t => t.opacity > 0)
                  );
                  if (currentOpacity > 0.1) {
                    fadeOut(currentIndex, currentOpacity - 0.1);
                  }
                }, 200);
              };
              
              fadeOut(index, 0.3);
              setHoveredSquare(null);
            }}

          />
        );
      })}
    </svg>
  );
}