import React, { useRef, useEffect, useState, Suspense, lazy } from "react";
import { Stage, Layer, Rect, Group } from "react-konva";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedId } from "../../store/slices/canvasSlice";
import { updateElement } from "../../store/slices/elementsSlice";

// Lazy load components
const ImageFrame = lazy(() => import("./CanvasObjects/ImageFrame"));
const VideoFrame = lazy(() => import("./CanvasObjects/VideoFrame"));
const ShapeFrame = lazy(() => import("./CanvasObjects/ShapeFrame"));
const CustomTransformer = lazy(() => import("./Transformer/CustomTransformer"));

const KonvaCanvas = () => {
  const stageRef = useRef(null);
  const dispatch = useDispatch();

  const { width, height, scale, selectedId, backgroundColor } = useSelector(
    (state) => state.canvas
  );
  const elements = useSelector((state) => state.elements.items);

  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth - 300,
    height: window.innerHeight - 100,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setContainerSize({
        width: window.innerWidth - 300,
        height: window.innerHeight - 100,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate scale to fit canvas in viewport
  const canvasScale =
    Math.min(containerSize.width / width, containerSize.height / height, 1) *
    scale;

  const handleStageClick = (e) => {
    // Deselect when clicking on empty area
    if (e.target === e.target.getStage()) {
      dispatch(setSelectedId(null));
    }
  };

  const handleElementDragEnd = (id, e) => {
    dispatch(
      updateElement({
        id,
        updates: {
          x: e.target.x(),
          y: e.target.y(),
        },
      })
    );
  };

  const handleElementTransformEnd = (id, node) => {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale and apply to width/height
    node.scaleX(1);
    node.scaleY(1);

    dispatch(
      updateElement({
        id,
        updates: {
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
          rotation: node.rotation(),
        },
      })
    );
  };

  const renderElement = (element) => {
    const commonProps = {
      key: element.id,
      id: element.id,
      element: element,
      isSelected: element.id === selectedId,
      onSelect: () => dispatch(setSelectedId(element.id)),
      onDragEnd: (e) => handleElementDragEnd(element.id, e),
      onTransformEnd: (node) => handleElementTransformEnd(element.id, node),
    };

    switch (element.type) {
      case "image":
        return <ImageFrame {...commonProps} />;
      case "video":
        return <VideoFrame {...commonProps} />;
      case "shape":
        return <ShapeFrame {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-200 overflow-hidden">
      <div
        className="relative"
        style={{
          width: containerSize.width,
          height: containerSize.height,
        }}
      >
        <Stage
          ref={stageRef}
          width={containerSize.width}
          height={containerSize.height}
          scaleX={canvasScale}
          scaleY={canvasScale}
          x={(containerSize.width - width * canvasScale) / 2}
          y={(containerSize.height - height * canvasScale) / 2}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          {/* Background Layer */}
          <Layer>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={backgroundColor}
            />
          </Layer>

          {/* Elements Layer */}
          <Layer>
            <Suspense fallback={null}>
              {elements.map((element) => renderElement(element))}

              {/* Transformer for selected element */}
              {selectedId && <CustomTransformer selectedId={selectedId} />}
            </Suspense>
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default KonvaCanvas;
