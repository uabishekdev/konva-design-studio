import React, { useRef } from "react";
import { Text } from "react-konva";

const TextFrame = ({
  element,
  onSelect,
  onDragEnd,
  onTransformEnd,
  onDoubleClick,
}) => {
  const textRef = useRef();

  return (
    <Text
      ref={textRef}
      id={element.id}
      x={element.x}
      y={element.y}
      text={element.text}
      fontSize={element.fontSize}
      fontFamily={element.fontFamily}
      fill={element.fill}
      width={element.width}
      height={element.height}
      rotation={element.rotation}
      opacity={element.opacity}
      align={element.align}
      verticalAlign={element.verticalAlign}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      onTransformEnd={() => onTransformEnd(textRef.current)}
      onDblClick={onDoubleClick}
      onDblTap={onDoubleClick}
    />
  );
};

export default TextFrame;
