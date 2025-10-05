import React, { useRef, useEffect, useState } from "react";
import { Group, Image as KonvaImage, Rect } from "react-konva";
import useImage from "use-image";

const ImageFrame = ({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}) => {
  const groupRef = useRef();
  const [image] = useImage(element.src, "anonymous");
  const [imageDimensions, setImageDimensions] = useState(null);

  useEffect(() => {
    if (image) {
      setImageDimensions({
        width: image.width,
        height: image.height,
      });
    }
  }, [image]);

  const getImageScale = () => {
    if (!imageDimensions) return { scaleX: 1, scaleY: 1 };

    const frameAspect = element.width / element.height;
    const imageAspect = imageDimensions.width / imageDimensions.height;

    let scaleX, scaleY;

    if (element.fit === "cover") {
      if (frameAspect > imageAspect) {
        scaleX = element.width / imageDimensions.width;
        scaleY = scaleX;
      } else {
        scaleY = element.height / imageDimensions.height;
        scaleX = scaleY;
      }
    } else {
      if (frameAspect > imageAspect) {
        scaleY = element.height / imageDimensions.height;
        scaleX = scaleY;
      } else {
        scaleX = element.width / imageDimensions.width;
        scaleY = scaleX;
      }
    }

    return { scaleX, scaleY };
  };

  const scale = imageDimensions ? getImageScale() : { scaleX: 1, scaleY: 1 };
  const imageX =
    (element.width - (imageDimensions?.width || 0) * scale.scaleX) / 2;
  const imageY =
    (element.height - (imageDimensions?.height || 0) * scale.scaleY) / 2;

  const clipFunc = (ctx) => {
    const { clipShape, cornerRadius = 0 } = element;

    if (clipShape === "circle") {
      const radius = Math.min(element.width, element.height) / 2;
      ctx.arc(element.width / 2, element.height / 2, radius, 0, Math.PI * 2);
    } else if (cornerRadius > 0) {
      const w = element.width;
      const h = element.height;
      const r = Math.min(cornerRadius, w / 2, h / 2);

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
  };

  return (
    <Group
      ref={groupRef}
      id={element.id}
      x={element.x}
      y={element.y}
      rotation={element.rotation || 0}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      onTransformEnd={() => onTransformEnd(groupRef.current)}
    >
      <Group clipFunc={clipFunc}>
        {image && imageDimensions && (
          <KonvaImage
            image={image}
            x={imageX}
            y={imageY}
            width={imageDimensions.width}
            height={imageDimensions.height}
            scaleX={scale.scaleX}
            scaleY={scale.scaleY}
          />
        )}
      </Group>

      {element.showBorder && (
        <Rect
          width={element.width}
          height={element.height}
          stroke={element.borderColor || "#000"}
          strokeWidth={element.borderWidth || 2}
          cornerRadius={element.cornerRadius || 0}
        />
      )}
    </Group>
  );
};

export default ImageFrame;
