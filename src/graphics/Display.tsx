import { useEffect, useRef, useState } from "react";
import { Simulation } from "../simulation/Simulation";
import { Particle } from "../simulation/Particle";
import { sim } from "../config/SimulationConfig";
import { centerTf, windowHeight, windowWidth } from "../config/GraphicsConfig";

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
                simulation.rk4Step();
                renderSimulation(simulation.state.particles, undefined, canvasRef.current);
            }, 1000 * simulation.h); 
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [simulation]); 

    // Render
    const renderSimulation = (particles: Particle[], wasmModule: any, canvas: HTMLCanvasElement | null) => {    
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx && particles) {
                const affineTf = centerTf;
                const cameraTf = particles[0].dimension == 3 ? { } : undefined;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(particle => {
                    particle.graphics.renderCallback(ctx, particle, {
                        affineTf: affineTf,
                        cameraTf: cameraTf,
                    });
                });
            }
        }
    };

    return (<div>
        <canvas ref={canvasRef} width={windowWidth} height={windowHeight}></canvas>
    </div>);
}
