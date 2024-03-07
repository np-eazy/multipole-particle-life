import { useEffect, useRef, useState } from "react";
import { Simulation } from "../simulation/Simulation";
import { circularClosedBounds } from "../simulation/Boundary";
import { Particle, particleTypes } from "../simulation/Particle";
import { Orientation, sample2DGaussian } from "../simulation/utils";
import { Rule } from "../simulation/Interactions";

export const Display = (props: any) => {
    const [simulation, setSimulation] = useState<Simulation | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null); 

    const radius = 1;
    const density = 50;
    const interactionRule = [
        [4, 0, 0, 0, 0],
        [0.5, 4,  -0.5, 0, 0],
        [-0.5, 0.5, 2, -5, 0],
        [-0.5, 0.5, 0, 2, 5],
        [-0.5, 0.5, 5, 0, 2],
    ];
    const snek = [
        [4, 0, 0, 0, 0],
        [-1, 4, 0, 0, 0],
        [-1, -1, 4, 0, 0],
        [-1, -1, -1, 4, 0],
        [-1, -1, -1, -1, 4],
    ];
    const size = 100;


    useEffect(() => {
        const particles = [];
        for (let i = 0; i < particleTypes.length; i++) {
            for (let j = 0; j < density; j++) {
                particles.push(new Particle({
                    particleType: particleTypes[i],
                    mass: 1,
                    radius: radius,
                    momentCoefficient: 2/5,
                    position: (new Orientation(sample2DGaussian(50))).addX(new Orientation([0, 0])),
                }))
            }
        }
        const newSimulation = new Simulation({
            dimensions: 2,
            stepSize: 0.004,
            boundary: circularClosedBounds(size),
            rule: new Rule({ monopoleTensor: snek }),
            particles: particles,
        });
        setSimulation(newSimulation);
    }, []);

    useEffect(() => {
        let intervalId: any;
        if (simulation) {        
            intervalId = setInterval(() => {
                simulation.rk4Step(0.01);
                renderParticles(simulation.state.particles, undefined, canvasRef.current);
            }, 10); 
        }
      
        return () => {
          if (intervalId) clearInterval(intervalId);
        };
      }, [simulation]); 


    const zoomAndShift = (x: number, y: number, cx: number, cy: number, z: number) => {
        return [cx + x * z, cy + y * z];
    }

    function rgbToHex(r: number, g: number, b: number): string {
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));
    
        const toHex = (c: number) => c.toString(16).padStart(2, '0');
    
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    const zoom = 4;
    const totalHeight = size * zoom * 2;
    const totalWidth = totalHeight;
    const renderParticles = (particles: Particle[], wasmModule: any, canvas: HTMLCanvasElement | null) => {
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(particle => {
                    const position = particle.position; 
                    const x = position.x;
                    const [rx, ry] = zoomAndShift(x[0], x[1], totalHeight / 2, totalWidth / 2, zoom); 
                    const radius = particle.radius * zoom; 
    
                    ctx.beginPath();
                    ctx.arc(rx, ry, radius, 0, 2 * Math.PI); 
                    if (particle.particleType == particleTypes[0]) {
                        ctx.fillStyle = rgbToHex(255, 0, 0); 
                    } else if (particle.particleType == particleTypes[1]) {
                        ctx.fillStyle = rgbToHex(0, 180, 0); 
                    } else if (particle.particleType == particleTypes[2]) {
                        ctx.fillStyle = rgbToHex(0, 0, 255); 
                    } else if (particle.particleType == particleTypes[3]) {
                        ctx.fillStyle = rgbToHex(255, 0, 255); 
                    } else if (particle.particleType == particleTypes[4]) {
                        ctx.fillStyle = rgbToHex(255, 120, 0); 
                    } 
                    ctx.fill(); 
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