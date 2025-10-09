import React, { useRef, useEffect, useState } from "react";
import { Group, Image as KonvaImage, Rect } from "react-konva";
import { useDispatch } from "react-redux";
import Konva from "konva";
import { toggleVideoPlay } from "../../../store/slices/elementsSlice";

const VideoFrame = ({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}) => {
  const dispatch = useDispatch();
  const groupRef = useRef();
  const videoRef = useRef(document.createElement("video"));
  const imageRef = useRef();

  useEffect(() => {
    const video = videoRef.current;
    if (element.isPlaying) {
      video.play();
    } else {
      video.pause();
    }
  }, [element.isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    video.src = element.src;
    video.crossOrigin = "anonymous";
    video.loop = element.loop || false;
    video.muted = true;

    const onCanPlay = () => {
      if (element.isPlaying) {
        video.play();
      }
      imageRef.current?.getLayer()?.batchDraw();
    };

    video.addEventListener("loadedmetadata", () => {
      video.currentTime = element.startTime || 0;
    });

    video.addEventListener("canplay", onCanPlay);

    const anim = new Konva.Animation(() => {}, imageRef.current?.getLayer());
    anim.start();

    return () => {
      anim.stop();
      video.removeEventListener("canplay", onCanPlay);
      video.pause();
    };
  }, [element.src, element.startTime, element.loop, element.isPlaying]);

  const handleTogglePlay = (e) => {
    e.cancelBubble = true;
    dispatch(toggleVideoPlay({ id: element.id }));
  };

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
      width={element.width}
      height={element.height}
      rotation={element.rotation || 0}
      opacity={element.opacity}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDblClick={handleTogglePlay}
      onDblTap={handleTogglePlay}
      onDragEnd={onDragEnd}
      onTransformEnd={() => onTransformEnd(groupRef.current)}
    >
      <Group clipFunc={clipFunc}>
        <KonvaImage
          ref={imageRef}
          image={videoRef.current}
          width={element.width}
          height={element.height}
        />
      </Group>

      {!element.isPlaying && (
        <Rect
          width={element.width}
          height={element.height}
          fill="rgba(0, 0, 0, 0.3)"
          listening={false}
        />
      )}
    </Group>
  );
};

export default VideoFrame;
