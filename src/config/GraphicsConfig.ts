import { simulationRadius } from "./SimulationConfig";

const windowSize = 800;

export const windowZoom = windowSize / (simulationRadius * 2);
export const windowHeight = simulationRadius * windowZoom * 2;
export const windowWidth = windowHeight;
