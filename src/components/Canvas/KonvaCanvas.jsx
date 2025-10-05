import React, { useRef, useEffect, useState, Suspense, lazy } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedId } from "../../store/slices/canvasSlice";
import { updateElement } from "../../store/slices/elementsSlice";

const ImageFrame = lazy(() => import("./CanvasObjects/ImageFrame"));
const VideoFrame = lazy(() => import("./CanvasObjects/VideoFrame"));
const FrameContainer = lazy(() => import("./CanvasObjects/FrameContainer"));
const CustomTransformer = lazy(() => import("./Transformer/CustomTransformer"));

const KonvaCanvas = () => {
  const stageRef = useRef(null);
  const dispatch = useDispatch();

  const { width, height, scale, selectedId, backgroundColor } = useSelector(
    (state) => state.canvas
  );
  const elements = useSelector((state) => state.elements.items);

  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth - 320,
    height: window.innerHeight - 64,
  });

  useEffect(() => {
    const handleResize = () => {
      setContainerSize({
        width: window.innerWidth - 320,
        height: window.innerHeight - 64,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const canvasScale =
    Math.min(containerSize.width / width, containerSize.height / height, 1) *
    scale;

  const handleStageClick = (e) => {
    console.log(" Stage clicked, target:", e.target.getClassName());
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
    if (element.parentId) {
      console.log("⏭️ Skipping child element:", element.id);
      return null;
    }

    console.log("Rendering element:", {
      id: element.id,
      type: element.type,
      clipShape: element.clipShape,
      hasChildren: element.children?.length > 0,
    });

    const commonProps = {
      element: element,
      isSelected: element.id === selectedId,
      onSelect: () => dispatch(setSelectedId(element.id)),
      onDragEnd: (e) => handleElementDragEnd(element.id, e),
      onTransformEnd: (node) => handleElementTransformEnd(element.id, node),
    };

    if (element.type === "shape") {
      const childImage =
        element.children?.length > 0
          ? elements.find((el) => el.id === element.children[0])
          : null;

      console.log(" Frame children lookup:", {
        frameId: element.id,
        childrenIds: element.children,
        foundChild: childImage,
      });

      return (
        <FrameContainer key={element.id} {...commonProps}>
          {childImage}
        </FrameContainer>
      );
    }

    switch (element.type) {
      case "image":
        return <ImageFrame key={element.id} {...commonProps} />;
      case "video":
        return <VideoFrame key={element.id} {...commonProps} />;
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
          <Layer>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={backgroundColor}
            />
          </Layer>

          <Layer>
            <Suspense fallback={null}>
              {elements.map((element) => renderElement(element))}
              {selectedId && <CustomTransformer selectedId={selectedId} />}
            </Suspense>
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default KonvaCanvas;
