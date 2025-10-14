import React, { useRef, useState } from "react";
import {
  Group,
  Rect,
  Circle,
  Ellipse,
  Image as KonvaImage,
  Text,
} from "react-konva";
import { useDispatch } from "react-redux";
import { setSelectedId } from "../../../store/slices/canvasSlice";
import {
  updateElement,
  addImageToFrame,
} from "../../../store/slices/elementsSlice";
import useImage from "use-image";

const FrameContainer = ({
  element,
  isSelected,
  onDragEnd,
  onTransformEnd,
  children,
}) => {
  const groupRef = useRef();
  const imageGroupRef = useRef();
  const dispatch = useDispatch();
  const [image] = useImage(children?.src, "anonymous");
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const hasImage = children && image;

  const handleFrameClick = (e) => {
    e.cancelBubble = true;
    dispatch(setSelectedId(element.id));

    if (!hasImage && e.target.getClassName() !== "Image") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            dispatch(
              addImageToFrame({
                frameId: element.id,
                imageData: { src: event.target.result },
              })
            );
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  const handleDragStart = (e) => {
    if (e.target === groupRef.current) {
      dispatch(setSelectedId(element.id));
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (isSelected && children) {
      setShowHint(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setShowHint(false);
  };

  const imageOffset = children?.imageOffset || { x: 0, y: 0 };
  const imageScale = children?.imageScale || 1;

  const getImageProps = () => {
    if (!image || !children) return null;

    const imgWidth = image.width;
    const imgHeight = image.height;
    const frameAspect = element.width / element.height;
    const imgAspect = imgWidth / imgHeight;

    let baseScale;
    if (frameAspect > imgAspect) {
      baseScale = element.width / imgWidth;
    } else {
      baseScale = element.height / imgHeight;
    }

    const finalScale = baseScale * imageScale;

    return {
      x: imageOffset.x,
      y: imageOffset.y,
      width: imgWidth,
      height: imgHeight,
      scaleX: finalScale,
      scaleY: finalScale,
    };
  };

  const imageProps = getImageProps();

  const handleImageDragStart = (e) => {
    e.cancelBubble = true;
    setIsDraggingImage(true);
    setShowHint(false);
  };

  const handleImageDragEnd = (e) => {
    e.cancelBubble = true;
    if (children) {
      const newX = e.target.x();
      const newY = e.target.y();

      dispatch(
        updateElement({
          id: children.id,
          updates: {
            imageOffset: { x: newX, y: newY },
          },
        })
      );
    }
    setIsDraggingImage(false);
  };

  const handleWheel = (e) => {
    if (!isSelected || !children) return;

    e.evt.preventDefault();
    const scaleBy = 1.05;
    const oldScale = imageScale;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.5, Math.min(newScale, 3));

    dispatch(
      updateElement({
        id: children.id,
        updates: {
          imageScale: clampedScale,
        },
      })
    );
  };

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

  const renderUploadOverlay = () => {
    if (hasImage || (!isHovering && !isSelected)) return null;

    const centerX = element.width / 2;
    const centerY = element.height / 2;

    return (
      <Group listening={false}>
        <Rect
          x={0}
          y={0}
          width={element.width}
          height={element.height}
          fill={isHovering ? "rgba(59, 130, 246, 0.2)" : "rgba(0, 0, 0, 0.1)"}
          cornerRadius={element.cornerRadius || 0}
        />
        {isHovering && (
          <>
            <Circle
              x={centerX}
              y={centerY}
              radius={50}
              fill="#3b82f6"
              shadowColor="black"
              shadowBlur={10}
              shadowOpacity={0.3}
              shadowOffsetY={4}
            />
            <Text
              x={centerX - 25}
              y={centerY - 15}
              width={50}
              text="📤"
              fontSize={30}
              align="center"
            />
            <Rect
              x={0}
              y={element.height - 45}
              width={element.width}
              height={45}
              fill="rgba(59, 130, 246, 0.95)"
              cornerRadius={[
                0,
                0,
                element.cornerRadius || 0,
                element.cornerRadius || 0,
              ]}
            />
            <Text
              x={0}
              y={element.height - 32}
              width={element.width}
              text="Click to Upload Photo"
              fontSize={18}
              fill="#ffffff"
              align="center"
              fontStyle="bold"
            />
          </>
        )}
      </Group>
    );
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
      opacity={element.opacity}
      draggable={hasImage || !isHovering}
      onClick={handleFrameClick}
      onTap={handleFrameClick}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onTransformEnd={() => onTransformEnd(groupRef.current)}
      onWheel={handleWheel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderBackgroundShape()}

      {children && image && imageProps ? (
        <Group clipFunc={clipFunc}>
          <Group
            ref={imageGroupRef}
            x={imageProps.x}
            y={imageProps.y}
            draggable={isSelected}
            onDragStart={handleImageDragStart}
            onDragEnd={handleImageDragEnd}
            onMouseDown={(e) => (e.cancelBubble = true)}
            onMouseUp={(e) => (e.cancelBubble = true)}
            onClick={(e) => (e.cancelBubble = true)}
          >
            <KonvaImage
              image={image}
              width={imageProps.width}
              height={imageProps.height}
              scaleX={imageProps.scaleX}
              scaleY={imageProps.scaleY}
            />
          </Group>
        </Group>
      ) : (
        renderUploadOverlay()
      )}

      {renderBorderShape()}

      {isSelected && showHint && children && !isDraggingImage && (
        <>
          <Rect
            x={0}
            y={-45}
            width={element.width}
            height={40}
            fill="rgba(0, 0, 0, 0.85)"
            cornerRadius={8}
            listening={false}
          />
          <Text
            x={0}
            y={-35}
            width={element.width}
            text="Drag to move • Scroll to zoom"
            fontSize={15}
            fill="#ffffff"
            align="center"
            fontFamily="sans-serif"
            listening={false}
          />
        </>
      )}
    </Group>
  );
};

export default FrameContainer;
