const STORAGE_KEY = "konva_designs";
const AUTOSAVE_KEY = "konva_autosave";

export const saveDesign = (name, canvasState, elementsState) => {
  try {
    const designs = getDesigns();
    const design = {
      id: Date.now().toString(),
      name,
      canvasState,
      elementsState,
      thumbnail: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    designs.push(design);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
    return design;
  } catch (error) {
    console.error("Error saving design:", error);
    return null;
  }
};

export const getDesigns = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading designs:", error);
    return [];
  }
};

export const deleteDesign = (id) => {
  try {
    const designs = getDesigns();
    const filtered = designs.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting design:", error);
    return false;
  }
};

export const updateDesign = (id, canvasState, elementsState) => {
  try {
    const designs = getDesigns();
    const index = designs.findIndex((d) => d.id === id);
    if (index !== -1) {
      designs[index] = {
        ...designs[index],
        canvasState,
        elementsState,
        updatedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
      return designs[index];
    }
    return null;
  } catch (error) {
    console.error("Error updating design:", error);
    return null;
  }
};

export const autoSave = (canvasState, elementsState) => {
  try {
    const data = {
      canvasState,
      elementsState,
      timestamp: Date.now(),
    };
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error auto-saving:", error);
  }
};

export const getAutoSave = () => {
  try {
    const data = localStorage.getItem(AUTOSAVE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading auto-save:", error);
    return null;
  }
};

export const clearAutoSave = () => {
  try {
    localStorage.removeItem(AUTOSAVE_KEY);
  } catch (error) {
    console.error("Error clearing auto-save:", error);
  }
};
