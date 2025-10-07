import React, { useRef } from "react";
import { Group, Rect, Circle, Ellipse, Image as KonvaImage } from "react-konva";
import { useDispatch } from "react-redux";
import { setSelectedId } from "../../../store/slices/canvasSlice";
import useImage from "use-image";

const FrameContainer = ({
  element,
  isSelected,
  onDragEnd,
  onTransformEnd,
  children,
}) => {
  const groupRef = useRef();
  const dispatch = useDispatch();
  const [image] = useImage(children?.src, "anonymous");

  const handleDragStart = () => {
    dispatch(setSelectedId(element.id));
  };

  const getImageProps = () => {
    if (!image || !children) return null;

    const imgWidth = image.width;
    const imgHeight = image.height;
    const frameAspect = element.width / element.height;
    const imgAspect = imgWidth / imgHeight;

    let scale, x, y;
    if (frameAspect > imgAspect) {
      scale = element.width / imgWidth;
      x = 0;
      y = (element.height - imgHeight * scale) / 2;
    } else {
      scale = element.height / imgHeight;
      x = (element.width - imgWidth * scale) / 2;
      y = 0;
    }

    return {
      x,
      y,
      width: imgWidth,
      height: imgHeight,
      scaleX: scale,
      scaleY: scale,
    };
  };

  const imageProps = getImageProps();

  const clipFunc = (ctx) => {
    const shapeType = element.shapeType || "rect";

    switch (shapeType) {
      case "circle":
        const circleRadius = Math.min(element.width, element.height) / 2;
        ctx.arc(
          element.width / 2,
          element.height / 2,
          circleRadius,
          0,
          Math.PI * 2
        );
        break;

      case "ellipse":
        ctx.ellipse(
          element.width / 2,
          element.height / 2,
          element.width / 2,
          element.height / 2,
          0,
          0,
          Math.PI * 2
        );
        break;

      default:
        if (element.cornerRadius > 0) {
          const w = element.width;
          const h = element.height;
          const r = Math.min(element.cornerRadius, w / 2, h / 2);

          ctx.moveTo(r, 0);
          ctx.lineTo(w - r, 0);
          ctx.quadraticCurveTo(w, 0, w, r);
          ctx.lineTo(w, h - r);
          ctx.quadraticCurveTo(w, h, w - r, h);
          ctx.lineTo(r, h);
          ctx.quadraticCurveTo(0, h, 0, h - r);
          ctx.lineTo(0, r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.closePath();
        } else {
          ctx.rect(0, 0, element.width, element.height);
        }
    }
  };

  const renderBackgroundShape = () => {
    const shapeType = element.shapeType || "rect";
    const fill = element.fill || "#f1f5f9";

    switch (shapeType) {
      case "circle":
        return (
          <Circle
            radius={Math.min(element.width, element.height) / 2}
            x={element.width / 2}
            y={element.height / 2}
            fill={fill}
          />
        );

      case "ellipse":
        return (
          <Ellipse
            x={element.width / 2}
            y={element.height / 2}
            radiusX={element.width / 2}
            radiusY={element.height / 2}
            fill={fill}
          />
        );

      default:
        return (
          <Rect
            width={element.width}
            height={element.height}
            fill={fill}
            cornerRadius={element.cornerRadius || 0}
          />
        );
    }
  };

  const renderBorderShape = () => {
    const shapeType = element.shapeType || "rect";
    const strokeColor = isSelected
      ? "#0ea5e9"
      : element.borderColor || "#64748b";
    const strokeWidth = isSelected ? 4 : element.borderWidth || 2;

    switch (shapeType) {
      case "circle":
        return (
          <Circle
            radius={Math.min(element.width, element.height) / 2}
            x={element.width / 2}
            y={element.height / 2}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
        );

      case "ellipse":
        return (
          <Ellipse
            x={element.width / 2}
            y={element.height / 2}
            radiusX={element.width / 2}
            radiusY={element.height / 2}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
        );

      default:
        return (
          <Rect
            width={element.width}
            height={element.height}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            cornerRadius={element.cornerRadius || 0}
          />
        );
    }
  };

  return (
    <Group
      ref={groupRef}
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation || 0}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onTransformEnd={() => onTransformEnd(groupRef.current)}
    >
      {renderBackgroundShape()}
      {children && image && imageProps && (
        <Group clipFunc={clipFunc}>
          <KonvaImage image={image} {...imageProps} />
        </Group>
      )}
      {renderBorderShape()}
    </Group>
  );
};

export default FrameContainer;
