import { globalRadius } from "./SimulationConfig";

const windowSize = 800;

export const windowZoom = windowSize / (globalRadius * 2);
export const windowHeight = globalRadius * windowZoom * 2;
export const windowWidth = windowHeight;
