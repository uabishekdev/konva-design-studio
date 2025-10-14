import React, { useRef } from "react";
import { Group, Rect, Text, Circle } from "react-konva";
import { Upload } from "lucide-react";

const FloatingUploadButton = ({ x, y, width, height, onUpload, visible }) => {
  const fileInputRef = useRef(null);

  if (!visible) return null;

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onUpload(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <Group listening={false}>
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="rgba(0, 0, 0, 0.5)"
        listening={false}
      />
      <Circle
        x={centerX}
        y={centerY}
        radius={60}
        fill="#3b82f6"
        shadowColor="black"
        shadowBlur={10}
        shadowOpacity={0.3}
        shadowOffsetY={4}
        listening={false}
      />
      <Text
        x={centerX - 50}
        y={centerY - 10}
        width={100}
        text="📤"
        fontSize={40}
        align="center"
        listening={false}
      />
      <Text
        x={centerX - 80}
        y={centerY + 40}
        width={160}
        text="Click to Upload"
        fontSize={16}
        fill="#ffffff"
        align="center"
        fontStyle="bold"
        listening={false}
      />
    </Group>
  );
};

export default FloatingUploadButton;
