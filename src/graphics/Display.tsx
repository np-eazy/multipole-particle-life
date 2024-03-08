import { useEffect, useRef, useState } from "react";
import { Simulation } from "../simulation/Simulation";
import { Particle } from "../simulation/Particle";
import { sim, stepSize } from "../config/SimulationConfig";
import { totalHeight, totalWidth, zoom } from "../config/GraphicsConfig";
import { Color, affineTf, getRenderCoord } from "./utils";

export const centerTf: affineTf = {
    cx: totalWidth / 2,
    cy: totalHeight / 2,
    z: zoom
}

export function drawParticle(ctx: any, particle: Particle) {
    const [x, y] = getRenderCoord(particle.position.x, centerTf, undefined);
    drawCircle(ctx, x, y, particle.graphics.size * centerTf.z, particle.graphics.color);
}

export function drawCircle(ctx: any, x: number, y: number, radius: number, color: Color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI); 
    ctx.fillStyle = color.toHex();
    console.log(ctx.fill()); 
}

export const Display = (props: any) => {
    const [simulation, setSimulation] = useState<Simulation | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null); 

    // Initialize
    useEffect(() => {
        setSimulation(sim);
    }, []);

    // Update
    useEffect(() => {
        let intervalId: any;
        if (simulation) {        
            intervalId = setInterval(() => {
                simulation.rk4Step(stepSize);
                renderSimulation(simulation.state.particles, undefined, canvasRef.current);
            }, 1000 * stepSize); 
        }
        return () => {
          if (intervalId) clearInterval(intervalId);
        };
    }, [simulation]); 

    // Render
    const renderSimulation = (particles: Particle[], wasmModule: any, canvas: HTMLCanvasElement | null) => {    
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(particle => {
                    drawParticle(ctx, particle);
                });
            }
        }
    };

    return (<div style={{
        margin: 10,
    }}>
        <canvas ref={canvasRef} width={totalWidth} height={totalHeight}></canvas>
    </div>);
}