import React, { useRef } from "react";
import { Rect, Circle, Group } from "react-konva";

const ShapeFrame = ({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}) => {
  const shapeRef = useRef();

  const commonProps = {
    id: element.id,
    draggable: true,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: onDragEnd,
    onTransformEnd: () => onTransformEnd(shapeRef.current),
    fill: element.fill,
    stroke: isSelected ? "#0ea5e9" : element.borderColor,
    strokeWidth: isSelected ? 3 : element.borderWidth || 0,
  };

  if (element.shape === "circle") {
    return (
      <Circle
        ref={shapeRef}
        x={element.x}
        y={element.y}
        radius={element.radius || 50}
        {...commonProps}
      />
    );
  }

  return (
    <Rect
      ref={shapeRef}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      cornerRadius={element.cornerRadius || 0}
      {...commonProps}
    />
  );
};

export default ShapeFrame;
