import React, { useEffect, useRef } from "react";
import { Transformer } from "react-konva";

const CustomTransformer = ({ selectedId }) => {
  const transformerRef = useRef();

  useEffect(() => {
    if (selectedId) {
      const stage = transformerRef.current.getStage();
      const selectedNode = stage.findOne(`#${selectedId}`);

      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  return (
    <Transformer
      ref={transformerRef}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      }}
      borderStroke="#0ea5e9"
      borderStrokeWidth={2}
      anchorFill="#fff"
      anchorStroke="#0ea5e9"
      anchorStrokeWidth={2}
      anchorSize={8}
      anchorCornerRadius={4}
    />
  );
};

export default CustomTransformer;
