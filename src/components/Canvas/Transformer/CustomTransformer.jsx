import React, { useEffect, useRef } from "react";
import { Transformer } from "react-konva";
import { useSelector } from "react-redux";

const CustomTransformer = ({ selectedId, multiSelect }) => {
  const transformerRef = useRef();
  const elements = useSelector((state) => state.elements.items);

  useEffect(() => {
    if (!transformerRef.current) return;

    const stage = transformerRef.current.getStage();
    if (!stage) return;

    const selectedNodes = [];

    if (multiSelect && multiSelect.length > 0) {
      multiSelect.forEach((id) => {
        const node = stage.findOne(`#${id}`);
        if (node) selectedNodes.push(node);
      });
    } else if (selectedId) {
      const node = stage.findOne(`#${selectedId}`);
      if (node) selectedNodes.push(node);
    }

    if (selectedNodes.length > 0) {
      transformerRef.current.nodes(selectedNodes);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
    }
  }, [selectedId, multiSelect]);

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
      anchorSize={10}
      anchorCornerRadius={5}
      enabledAnchors={
        multiSelect && multiSelect.length > 1
          ? ["top-left", "top-right", "bottom-left", "bottom-right"]
          : [
              "top-left",
              "top-center",
              "top-right",
              "middle-right",
              "middle-left",
              "bottom-left",
              "bottom-center",
              "bottom-right",
            ]
      }
      rotateEnabled={!(multiSelect && multiSelect.length > 1)}
      keepRatio={false}
    />
  );
};

export default CustomTransformer;
