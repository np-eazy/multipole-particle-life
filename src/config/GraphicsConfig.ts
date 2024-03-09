import { drawCircle } from "../graphics/Shapes";
import { affineTf, cameraTf, getRenderCoord } from "../graphics/Transformations";
import { Particle } from "../simulation/Particle";

const windowSize = 800;
const globalRadius = 100; // TODO: This is a magic number; abstract it out when we get the chance

export const windowZoom = windowSize / (globalRadius * 2);
export const windowHeight = globalRadius * windowZoom * 2;
export const windowWidth = windowHeight;

export const testParticleRender = (ctx: any, particle: Particle, affineTf: affineTf, cameraTf?: cameraTf) => {
    const [x, y] = getRenderCoord(particle.position.x, affineTf, cameraTf);
    drawCircle(ctx, x, y, particle.graphics.size * affineTf.z, particle.graphics.color);
}

export const centerTf: affineTf = {
    cx: windowWidth / 2,
    cy: windowHeight / 2,
    z: windowZoom,
}
