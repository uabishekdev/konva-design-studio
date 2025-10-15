import React, { useRef, useEffect } from "react";
import { Text, Group, Rect } from "react-konva";

const TextFrame = ({
  element,
  onSelect,
  onDragEnd,
  onDragMove,
  onTransformEnd,
  onDoubleClick,
  onContextMenu,
  isSelected,
}) => {
  const textRef = useRef();
  const groupRef = useRef();

  useEffect(() => {
    if (textRef.current) {
      if (element.shadow) {
        textRef.current.shadowColor(element.shadow.color || "rgba(0,0,0,0.5)");
        textRef.current.shadowBlur(element.shadow.blur || 5);
        textRef.current.shadowOffsetX(element.shadow.offsetX || 2);
        textRef.current.shadowOffsetY(element.shadow.offsetY || 2);
        textRef.current.shadowOpacity(element.shadow.opacity || 0.5);
      }
    }
  }, [element.shadow]);

  const textProps = {
    text: element.text,
    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    fill: element.fill,
    width: element.width,
    align: element.align,
    verticalAlign: element.verticalAlign,
    fontStyle: element.fontStyle || "normal",
    textDecoration: element.textDecoration || "",
    letterSpacing: element.letterSpacing || 0,
    lineHeight: element.lineHeight || 1.2,
    wrap: "word",
  };

  if (element.stroke) {
    textProps.stroke = element.stroke;
    textProps.strokeWidth = element.strokeWidth || 1;
  }

  return (
    <Group
      ref={groupRef}
      id={element.id}
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      opacity={element.opacity}
      draggable={!element.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      onDragMove={onDragMove}
      onTransformEnd={() => onTransformEnd(groupRef.current)}
      onDblClick={onDoubleClick}
      onDblTap={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {/* Background rect if needed */}
      {element.backgroundColor && (
        <Rect
          x={0}
          y={0}
          width={element.width}
          height={element.height || element.fontSize * 1.2}
          fill={element.backgroundColor}
          cornerRadius={element.backgroundRadius || 0}
        />
      )}

      <Text ref={textRef} {...textProps} />
    </Group>
  );
};

export default TextFrame;
