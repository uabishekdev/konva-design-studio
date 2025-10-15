import React, { useRef, useEffect, useState, Suspense, lazy } from "react";
import { Stage, Layer, Rect, Line } from "react-konva";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedId,
  clearExportRequest,
} from "../../store/slices/canvasSlice";
import {
  updateElement,
  finishUpdateElement,
  deleteElement,
  duplicateElement,
  copyElement,
  pasteElement,
  setMultiSelect,
} from "../../store/slices/elementsSlice";

const ImageFrame = lazy(() => import("./CanvasObjects/ImageFrame"));
const VideoFrame = lazy(() => import("./CanvasObjects/VideoFrame"));
const FrameContainer = lazy(() => import("./CanvasObjects/FrameContainer"));
const TextFrame = lazy(() => import("./CanvasObjects/TextFrame"));
const ShapeFrame = lazy(() => import("./CanvasObjects/ShapeFrame"));
const CustomTransformer = lazy(() => import("./Transformer/CustomTransformer"));
const AlignmentGuides = lazy(() => import("./Helpers/AlignmentGuides"));
const ContextMenu = lazy(() => import("./Helpers/ContextMenu"));

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
    showGrid,
    snapToGrid,
    gridSize,
  } = useSelector((state) => state.canvas);
  const elements = useSelector((state) => state.elements.items);
  const multiSelect = useSelector((state) => state.elements.multiSelect);

  const [editingText, setEditingText] = useState({
    id: null,
    value: "",
    node: null,
  });

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    elementId: null,
  });

  const [guides, setGuides] = useState({
    vertical: [],
    horizontal: [],
  });

  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth - 320,
    height: window.innerHeight - 64,
  });

  // Export functionality
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
        link.download = `invitation-${Date.now()}.png`;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (previouslySelectedId) dispatch(setSelectedId(previouslySelectedId));
        dispatch(clearExportRequest());
      }, 200);
    }
  }, [exportRequestTimestamp, dispatch, selectedId]);

  // Resize handler
  useEffect(() => {
    const handleResize = () =>
      setContainerSize({
        width: window.innerWidth - 320,
        height: window.innerHeight - 64,
      });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editingText.id) return;

      // Delete
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        dispatch(deleteElement(selectedId));
      }

      // Copy (Ctrl/Cmd + C)
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && selectedId) {
        e.preventDefault();
        dispatch(copyElement(selectedId));
      }

      // Paste (Ctrl/Cmd + V)
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        e.preventDefault();
        dispatch(pasteElement());
      }

      // Duplicate (Ctrl/Cmd + D)
      if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedId) {
        e.preventDefault();
        dispatch(duplicateElement(selectedId));
      }

      // Select All (Ctrl/Cmd + A)
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        const allIds = elements.filter((el) => !el.parentId).map((el) => el.id);
        dispatch(setMultiSelect(allIds));
      }

      // Escape - Deselect
      if (e.key === "Escape") {
        dispatch(setSelectedId(null));
        dispatch(setMultiSelect([]));
      }

      if (
        selectedId &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
        const element = elements.find((el) => el.id === selectedId);
        if (element && !element.locked) {
          const moveAmount = e.shiftKey ? 10 : 1;
          const updates = {};

          if (e.key === "ArrowUp") updates.y = element.y - moveAmount;
          if (e.key === "ArrowDown") updates.y = element.y + moveAmount;
          if (e.key === "ArrowLeft") updates.x = element.x - moveAmount;
          if (e.key === "ArrowRight") updates.x = element.x + moveAmount;

          dispatch(updateElement({ id: selectedId, updates }));
          dispatch(finishUpdateElement());
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, elements, dispatch, editingText.id]);

  const canvasScale =
    Math.min(containerSize.width / width, containerSize.height / height, 1) *
    scale;
  const stageX = (containerSize.width - width * canvasScale) / 2;
  const stageY = (containerSize.height - height * canvasScale) / 2;

  const handleStageClick = (e) => {
    const clickedOnEmpty =
      e.target === e.target.getStage() ||
      (e.target.getClassName() === "Rect" &&
        e.target.parent.getClassName() === "Layer");

    if (clickedOnEmpty) {
      dispatch(setSelectedId(null));
      dispatch(setMultiSelect([]));
      setContextMenu({ visible: false, x: 0, y: 0, elementId: null });
    }
  };

  const handleDragEnd = (id, e) => {
    let x = e.target.x();
    let y = e.target.y();

    // Snap to grid
    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }

    dispatch(updateElement({ id, updates: { x, y } }));
    dispatch(finishUpdateElement());
    setGuides({ vertical: [], horizontal: [] });
  };

  const handleDragMove = (id, e) => {
    if (!snapToGrid) {
      const node = e.target;
      const nodeRect = node.getClientRect();
      const newGuides = { vertical: [], horizontal: [] };
      const snapThreshold = 5;

      elements.forEach((element) => {
        if (element.id === id || element.parentId) return;

        const elementRect = {
          x: element.x,
          y: element.y,
          width: element.width || 0,
          height: element.height || 0,
        };

        // Left edges align
        if (Math.abs(nodeRect.x - elementRect.x) < snapThreshold) {
          newGuides.vertical.push(elementRect.x);
          node.x(elementRect.x);
        }

        // Right edges align
        if (
          Math.abs(
            nodeRect.x + nodeRect.width - (elementRect.x + elementRect.width)
          ) < snapThreshold
        ) {
          newGuides.vertical.push(elementRect.x + elementRect.width);
        }

        const nodeCenterX = nodeRect.x + nodeRect.width / 2;
        const elementCenterX = elementRect.x + elementRect.width / 2;
        if (Math.abs(nodeCenterX - elementCenterX) < snapThreshold) {
          newGuides.vertical.push(elementCenterX);
        }

        if (Math.abs(nodeRect.y - elementRect.y) < snapThreshold) {
          newGuides.horizontal.push(elementRect.y);
          node.y(elementRect.y);
        }

        if (
          Math.abs(
            nodeRect.y + nodeRect.height - (elementRect.y + elementRect.height)
          ) < snapThreshold
        ) {
          newGuides.horizontal.push(elementRect.y + elementRect.height);
        }

        // Center horizontal align
        const nodeCenterY = nodeRect.y + nodeRect.height / 2;
        const elementCenterY = elementRect.y + elementRect.height / 2;
        if (Math.abs(nodeCenterY - elementCenterY) < snapThreshold) {
          newGuides.horizontal.push(elementCenterY);
        }
      });

      setGuides(newGuides);
    }
  };
  const handleTransformEnd = (id, node) => {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    let x = node.x();
    let y = node.y();

    // Snap to grid
    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }

    dispatch(
      updateElement({
        id,
        updates: {
          x,
          y,
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

    const textWidth = Math.max(
      200,
      textNode.width() * textNode.scaleX() * canvasScale
    );
    const textHeight = Math.max(
      50,
      textNode.height() * textNode.scaleY() * canvasScale
    );

    setEditingText({
      id: element.id,
      value: element.text,
      node: textNode,
      x: textPosition.x + stageBox.left,
      y: textPosition.y + stageBox.top,
      width: textWidth,
      height: textHeight,
      fontSize: element.fontSize * canvasScale,
      fontFamily: element.fontFamily,
      fill: element.fill,
      align: element.align,
      fontWeight: element.fontWeight || "normal",
      fontStyle: element.fontStyle || "normal",
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

  const handleContextMenu = (e, elementId) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const stageBox = stage.container().getBoundingClientRect();

    setContextMenu({
      visible: true,
      x: stageBox.left + pointerPosition.x / canvasScale,
      y: stageBox.top + pointerPosition.y / canvasScale,
      elementId,
    });
  };

  const renderGrid = () => {
    if (!showGrid) return null;

    const lines = [];
    const gridColor = "#e0e0e0";

    // Vertical lines
    for (let i = 0; i <= width / gridSize; i++) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i * gridSize, 0, i * gridSize, height]}
          stroke={gridColor}
          strokeWidth={1}
          listening={false}
        />
      );
    }

    // Horizontal lines
    for (let i = 0; i <= height / gridSize; i++) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i * gridSize, width, i * gridSize]}
          stroke={gridColor}
          strokeWidth={1}
          listening={false}
        />
      );
    }

    return lines;
  };

  const renderElement = (element) => {
    if (element.parentId || element.visible === false) return null;

    const commonProps = {
      element,
      isSelected: element.id === selectedId || multiSelect.includes(element.id),
      onSelect: () => {
        if (!element.locked) {
          dispatch(setSelectedId(element.id));
          dispatch(setMultiSelect([]));
        }
      },
      onDragEnd: (e) => handleDragEnd(element.id, e),
      onDragMove: (e) => handleDragMove(element.id, e),
      onTransformEnd: (node) => handleTransformEnd(element.id, node),
      onContextMenu: (e) => handleContextMenu(e, element.id),
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
        return <ShapeFrame key={element.id} {...commonProps} />;
    }
  };

  const selectedElement = elements.find((el) => el.id === selectedId);
  const shouldShowTransformer =
    (selectedId &&
      selectedElement &&
      !selectedElement.parentId &&
      !selectedElement.locked) ||
    multiSelect.length > 0;

  const sortedElements = [...elements].sort(
    (a, b) => (a.zIndex || 0) - (b.zIndex || 0)
  );

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-200 overflow-hidden relative">
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
            {renderGrid()}
          </Layer>
          <Layer>
            <Suspense fallback={null}>
              {sortedElements.map((element) => renderElement(element))}
              {shouldShowTransformer && (
                <CustomTransformer
                  selectedId={selectedId}
                  multiSelect={multiSelect}
                />
              )}
              <AlignmentGuides guides={guides} width={width} height={height} />
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
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                handleTextareaBlur();
              }
            }}
            autoFocus
            style={{
              position: "absolute",
              top: editingText.y,
              left: editingText.x,
              width: editingText.width,
              height: editingText.height,
              fontSize: editingText.fontSize,
              fontFamily: editingText.fontFamily,
              fontWeight: editingText.fontWeight,
              fontStyle: editingText.fontStyle,
              color: editingText.fill,
              textAlign: editingText.align,
              border: "2px solid #3b82f6",
              padding: "4px",
              margin: 0,
              overflow: "auto",
              background: "rgba(255, 255, 255, 0.95)",
              resize: "none",
              lineHeight: 1.2,
              borderRadius: "4px",
              outline: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          />
        )}

        {contextMenu.visible && (
          <Suspense fallback={null}>
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              elementId={contextMenu.elementId}
              onClose={() =>
                setContextMenu({ visible: false, x: 0, y: 0, elementId: null })
              }
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default KonvaCanvas;
