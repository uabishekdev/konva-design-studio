import React from "react";
import { Line } from "react-konva";

const AlignmentGuides = ({ guides, width, height }) => {
  return (
    <>
      {guides.vertical.map((x, i) => (
        <Line
          key={`v-guide-${i}`}
          points={[x, 0, x, height]}
          stroke="#ff00ff"
          strokeWidth={1}
          dash={[4, 4]}
          listening={false}
        />
      ))}
      {guides.horizontal.map((y, i) => (
        <Line
          key={`h-guide-${i}`}
          points={[0, y, width, y]}
          stroke="#ff00ff"
          strokeWidth={1}
          dash={[4, 4]}
          listening={false}
        />
      ))}
    </>
  );
};

export default AlignmentGuides;
