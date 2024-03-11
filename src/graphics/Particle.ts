import { Particle } from "../simulation/Particle";
import { ParticleProperties } from "../simulation/ParticleProperties";
import { Color } from "./Color";
import { drawCircle, drawLine } from "./Shapes";
import { View } from "./View";

export type ParticleGraphicsProps = {
    parent?: ParticleProperties;
    color: Color;
    size: number;
    renderCallback: Function;
}

const black = new Color(0, 0, 0);
export function testParticleRender(ctx: any, graphics: ParticleGraphicsProps, x: number, y: number, zoom: number = 1, x1: number, y1: number) {
    drawCircle(ctx, x, y, graphics.size * zoom, graphics.color);
    drawCircle(ctx, x, y, graphics.size * zoom - 1, black);
    drawLine(ctx, x, y, x + x1 * (zoom ?? 1), y + y1 * (zoom ?? 1), graphics.color);
}

export const renderCallback = (ctx: any, particle: Particle, view: View) => {
    const [x, y, z] = view.getRenderCoord(particle.position);
    const [x1, y1, z1] = particle.dimension == 3 ? view.getRenderCoord(particle.orientation) : [...particle.orientation.x, 0];
    testParticleRender(ctx, particle.graphics, x, y, z, x1, y1);
}
