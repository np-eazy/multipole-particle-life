import { useEffect, useRef, useState } from "react";
import { Simulation } from "../simulation/Simulation";
import { Particle } from "../simulation/Particle";
import { View } from "./View";
import { renderParticles } from "./Particle";

export type DisplayProps = {
    simulation: Simulation;
    width: number;
    height: number;
}

export const Display = (props: any) => {
    const [simulation, setSimulation] = useState<Simulation | null>(null);
    const [view, setView] = useState<View | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initialize
    useEffect(() => {
        const simulation = props.simulation;
        setSimulation(simulation);
        const view = new View({
            sim: simulation,
            windowWidth: props.width,
            windowHeight: props.height,
            startingZoom: props.simulation.dimension == 3 ? 5 : 1,
        });
        setView(view);
    }, []);

    // Update
    useEffect(() => {
        let intervalId: any;
        if (simulation) {        
            intervalId = setInterval(() => {
                simulation.rk4Step();
                renderSimulation(simulation.state.particles, undefined, canvasRef.current);
            }, props.turbo ? 0 : 1000 * simulation.h); 
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [simulation]); 

    // Render
    const renderSimulation = (particles: Particle[], wasmModule: any, canvas: HTMLCanvasElement | null) => {    
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx && particles && view) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                renderParticles(ctx, particles, view);
            }
        }
    };

    return (<div>
        <canvas ref={canvasRef} width={props.width} height={props.height}></canvas>
    </div>);
}
