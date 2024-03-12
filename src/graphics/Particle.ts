import { Particle } from "../simulation/Particle";
import { ParticleProperties } from "../simulation/ParticleProperties";
import { Vector } from "../simulation/Utils";
import { Color } from "./Color";
import { drawCircle, drawLine } from "./Shapes";
import { View } from "./View";

export type ParticleGraphicsProps = {
    parent?: ParticleProperties;
    color: Color;
    size: number;
}

const fogDecayConstant = 10;
export const arrowLength = 1.2;
export function renderParticleAt(ctx: any, graphics: ParticleGraphicsProps, x: number, y: number, zoom: number = 1, x1?: number, y1?: number, fog?: boolean) {
    const fogColor = fog ? graphics.color.getScaled(Math.min(1, zoom / fogDecayConstant)) : graphics.color;
    drawCircle(ctx, x, y, graphics.size * zoom, fogColor.toHex());
    if (graphics.size * zoom > 1) {
        drawCircle(ctx, x, y, graphics.size * zoom - 1, "#00000060");
    }
    if (x1 != undefined && y1 != undefined) {
        drawLine(ctx, x, y, x1, y1, fogColor);
    }
}

export const renderParticles = (ctx: any, particles: Particle[], view: View) => {
    if (particles && particles[0].dimension == 2 && typeof particles[0].orientation === 'number') {
        particles.forEach((particle: Particle) => {
            view.loadRenderCoord(particle.position, particle);
            const z = view.panningTf.z;
            const [x1, y1] = view.loadRenderCoord(particle.position.getScaledSum(particle.graphics.size, new Vector([
                Math.cos(particle.orientation as number), 
                Math.sin(particle.orientation as number)
            ])));
            renderParticleAt(ctx, particle.graphics,  
                particle.cameraPosition!.x[0], 
                particle.cameraPosition!.x[1], 
                z,
                x1,
                y1,
                false,
            );
        })
    } else if (particles && particles[0].dimension == 3 && particles[0].orientation instanceof Vector) {
        particles.forEach((particle: Particle) => {
            view.loadRenderCoord(particle.position, particle);
        });
        particles
        .sort((p1: Particle, p2: Particle) => p1.cameraPosition!.x[2] - p2.cameraPosition!.x[2])
        .filter((particle: Particle) => particle.cameraPosition!.x[2] > 0 && particle.cameraPosition!.x[2] < 50)
        .forEach((particle: Particle) => {
            const z0: number = particle.cameraPosition!.x[2];
            const [x1, y1, z1] = view.loadRenderCoord(particle.position.getScaledSum(particle.graphics.size, particle.orientation as Vector));
            renderParticleAt(ctx, particle.graphics, 
                particle.cameraPosition!.x[0], 
                particle.cameraPosition!.x[1], 
                particle.cameraPosition!.x[2],
                z0 > z1 ? x1 : undefined,
                z0 > z1 ? y1 : undefined,
                true,
            );
        })
    }
}
