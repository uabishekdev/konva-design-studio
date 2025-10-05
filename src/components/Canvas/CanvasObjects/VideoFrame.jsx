import React, { useRef, useEffect, useState } from "react";
import { Group, Image as KonvaImage, Rect } from "react-konva";

const VideoFrame = ({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}) => {
  const groupRef = useRef();
  const videoRef = useRef();
  const [videoImage, setVideoImage] = useState(null);
  const animationRef = useRef();

  useEffect(() => {
    const video = document.createElement("video");
    video.src = element.src;
    video.crossOrigin = "anonymous";
    video.loop = element.loop || false;
    video.muted = true;

    video.addEventListener("loadedmetadata", () => {
      video.currentTime = element.startTime || 0;
    });

    video.addEventListener("canplay", () => {
      if (element.autoPlay) {
        video.play();
      }
    });

    videoRef.current = video;

    const animate = () => {
      if (videoRef.current && !videoRef.current.paused) {
        setVideoImage({ ...videoRef.current });
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      video.pause();
      video.src = "";
    };
  }, [element.src, element.startTime, element.autoPlay, element.loop]);

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
        {videoImage && (
          <KonvaImage
            image={videoImage}
            width={element.width}
            height={element.height}
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

export default VideoFrame;
