import React, { useRef, useEffect, useState, Suspense, lazy } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedId,
  clearExportRequest,
} from "../../store/slices/canvasSlice";
import {
  updateElement,
  finishUpdateElement,
} from "../../store/slices/elementsSlice";

const ImageFrame = lazy(() => import("./CanvasObjects/ImageFrame"));
const VideoFrame = lazy(() => import("./CanvasObjects/VideoFrame"));
const FrameContainer = lazy(() => import("./CanvasObjects/FrameContainer"));
const TextFrame = lazy(() => import("./CanvasObjects/TextFrame"));
const CustomTransformer = lazy(() => import("./Transformer/CustomTransformer"));

const KonvaCanvas = () => {
  const stageRef = useRef(null);
  const dispatch = useDispatch();

  const {
    width,
    height,
    scale,
    selectedId,
    backgroundColor,
    exportRequestTimestamp,
  } = useSelector((state) => state.canvas);
  const elements = useSelector((state) => state.elements.items);

  const [editingText, setEditingText] = useState({
    id: null,
    value: "",
    node: null,
  });

  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth - 320,
    height: window.innerHeight - 64,
  });

  useEffect(() => {
    if (exportRequestTimestamp && stageRef.current) {
      const stage = stageRef.current;
      const previouslySelectedId = selectedId;
      dispatch(setSelectedId(null));
      stage.batchDraw();

      setTimeout(() => {
        const uri = stage.toDataURL({
          mimeType: "image/png",
          quality: 1,
          pixelRatio: 2,
        });
        const link = document.createElement("a");
        link.download = "design-export.png";
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (previouslySelectedId) dispatch(setSelectedId(previouslySelectedId));
        dispatch(clearExportRequest());
      }, 200);
    }
  }, [exportRequestTimestamp, dispatch, selectedId]);

  useEffect(() => {
    const handleResize = () =>
      setContainerSize({
        width: window.innerWidth - 320,
        height: window.innerHeight - 64,
      });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const canvasScale =
    Math.min(containerSize.width / width, containerSize.height / height, 1) *
    scale;
  const stageX = (containerSize.width - width * canvasScale) / 2;
  const stageY = (containerSize.height - height * canvasScale) / 2;

  const handleStageClick = (e) => {
    const isStageOrBg =
      e.target === e.target.getStage() ||
      (e.target.getClassName() === "Rect" &&
        e.target.parent.getClassName() === "Layer");
    if (isStageOrBg) dispatch(setSelectedId(null));
  };

  const handleDragEnd = (id, e) => {
    dispatch(
      updateElement({ id, updates: { x: e.target.x(), y: e.target.y() } })
    );
    dispatch(finishUpdateElement());
  };

  const handleTransformEnd = (id, node) => {
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
    dispatch(finishUpdateElement());
  };

  const handleTextDblClick = (e, element) => {
    const textNode = e.target;
    textNode.hide();
    const textPosition = textNode.getAbsolutePosition();
    const stageBox = stageRef.current.container().getBoundingClientRect();
    setEditingText({
      id: element.id,
      value: element.text,
      node: textNode,
      x: textPosition.x + stageBox.left,
      y: textPosition.y + stageBox.top,
      width: textNode.width() * textNode.scaleX() * canvasScale,
      height: textNode.height() * textNode.scaleY() * canvasScale + 10,
      fontSize: element.fontSize * canvasScale,
      fontFamily: element.fontFamily,
      fill: element.fill,
      align: element.align,
    });
  };

  const handleTextareaBlur = () => {
    if (editingText.id) {
      dispatch(
        updateElement({
          id: editingText.id,
          updates: { text: editingText.value },
        })
      );
      dispatch(finishUpdateElement());
      editingText.node.show();
      setEditingText({ id: null, value: "", node: null });
    }
  };

  const renderElement = (element) => {
    if (element.parentId) return null;

    const commonProps = {
      element,
      isSelected: element.id === selectedId,
      onSelect: () => dispatch(setSelectedId(element.id)),
      onDragEnd: (e) => handleDragEnd(element.id, e),
      onTransformEnd: (node) => handleTransformEnd(element.id, node),
    };

    if (element.type === "shape") {
      const childImage =
        element.children?.length > 0
          ? elements.find((el) => el.id === element.children[0])
          : null;
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
      case "text":
        return (
          <TextFrame
            key={element.id}
            {...commonProps}
            onDoubleClick={(e) => handleTextDblClick(e, element)}
          />
        );
      default:
        return null;
    }
  };

  const selectedElement = elements.find((el) => el.id === selectedId);
  const shouldShowTransformer =
    selectedId && selectedElement && !selectedElement.parentId;

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-200 overflow-hidden">
      <div
        className="relative"
        style={{ width: containerSize.width, height: containerSize.height }}
      >
        <Stage
          ref={stageRef}
          width={containerSize.width}
          height={containerSize.height}
          scaleX={canvasScale}
          scaleY={canvasScale}
          x={stageX}
          y={stageY}
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
              {shouldShowTransformer && (
                <CustomTransformer selectedId={selectedId} />
              )}
            </Suspense>
          </Layer>
        </Stage>
        {editingText.id && (
          <textarea
            value={editingText.value}
            onChange={(e) =>
              setEditingText({ ...editingText, value: e.target.value })
            }
            onBlur={handleTextareaBlur}
            autoFocus
            style={{
              position: "absolute",
              top: editingText.y,
              left: editingText.x,
              width: editingText.width,
              height: editingText.height,
              fontSize: editingText.fontSize,
              fontFamily: editingText.fontFamily,
              color: editingText.fill,
              textAlign: editingText.align,
              border: "1px solid #3b82f6",
              padding: 0,
              margin: 0,
              overflow: "hidden",
              background: "none",
              resize: "none",
              lineHeight: 1.2,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default KonvaCanvas;
