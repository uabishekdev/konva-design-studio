import {
  updateElement,
  finishUpdateElement,
} from "../../store/slices/elementsSlice";

export const alignElements = ({ alignment, canvasWidth, canvasHeight }) => {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedId } = state.canvas;
    const { multiSelect, items } = state.elements;

    let elementsToAlign = [];

    if (multiSelect.length > 0) {
      elementsToAlign = items.filter((el) => multiSelect.includes(el.id));
    } else if (selectedId) {
      elementsToAlign = items.filter((el) => el.id === selectedId);
    }

    if (elementsToAlign.length === 0) return;

    elementsToAlign.forEach((element) => {
      let updates = {};

      switch (alignment) {
        case "left":
          updates.x = 0;
          break;
        case "center":
          updates.x = (canvasWidth - element.width) / 2;
          break;
        case "right":
          updates.x = canvasWidth - element.width;
          break;
        case "top":
          updates.y = 0;
          break;
        case "middle":
          updates.y = (canvasHeight - element.height) / 2;
          break;
        case "bottom":
          updates.y = canvasHeight - element.height;
          break;
        default:
          break;
      }

      if (Object.keys(updates).length > 0) {
        dispatch(updateElement({ id: element.id, updates }));
      }
    });

    dispatch(finishUpdateElement());
  };
};

export const distributeElements = ({ direction }) => {
  return (dispatch, getState) => {
    const state = getState();
    const { multiSelect, items } = state.elements;

    if (multiSelect.length < 3) return;

    const elementsToDistribute = items
      .filter((el) => multiSelect.includes(el.id))
      .sort((a, b) => {
        if (direction === "horizontal") {
          return a.x - b.x;
        } else {
          return a.y - b.y;
        }
      });

    const first = elementsToDistribute[0];
    const last = elementsToDistribute[elementsToDistribute.length - 1];

    let totalSpace;
    if (direction === "horizontal") {
      totalSpace = last.x + last.width - first.x;
    } else {
      totalSpace = last.y + last.height - first.y;
    }

    const totalElementSize = elementsToDistribute.reduce((sum, el) => {
      return sum + (direction === "horizontal" ? el.width : el.height);
    }, 0);

    const gap =
      (totalSpace - totalElementSize) / (elementsToDistribute.length - 1);

    let currentPosition = direction === "horizontal" ? first.x : first.y;

    elementsToDistribute.forEach((element, index) => {
      if (index === 0 || index === elementsToDistribute.length - 1) {
        return;
      }

      const size = direction === "horizontal" ? element.width : element.height;
      currentPosition +=
        (index === 0
          ? 0
          : elementsToDistribute[index - 1][
              direction === "horizontal" ? "width" : "height"
            ]) + gap;

      const updates =
        direction === "horizontal"
          ? { x: currentPosition }
          : { y: currentPosition };

      dispatch(updateElement({ id: element.id, updates }));
    });

    dispatch(finishUpdateElement());
  };
};
