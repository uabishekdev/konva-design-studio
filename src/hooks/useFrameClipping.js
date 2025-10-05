import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { updateElement } from "../store/slices/elementsSlice";

export const useFrameClipping = () => {
  const dispatch = useDispatch();

  const applyClipping = useCallback(
    (elementId, clippingConfig) => {
      const { shape, cornerRadius, customPath } = clippingConfig;

      dispatch(
        updateElement({
          id: elementId,
          updates: {
            clipShape: shape,
            cornerRadius: cornerRadius || 0,
            customClipPath: customPath,
          },
        })
      );
    },
    [dispatch]
  );

  const removeClipping = useCallback(
    (elementId) => {
      dispatch(
        updateElement({
          id: elementId,
          updates: {
            clipShape: null,
            cornerRadius: 0,
            customClipPath: null,
          },
        })
      );
    },
    [dispatch]
  );

  return {
    applyClipping,
    removeClipping,
  };
};
