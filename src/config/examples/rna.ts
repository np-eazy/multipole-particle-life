import { Color, hueToRgb } from "../../graphics/Color";
import { closedCircularBounds } from "../../simulation/Boundary";
import { InteractionTable } from "../../simulation/Interactions";
import { Particle } from "../../simulation/Particle";
import { ParticlePhysicsProps, ParticleProperties } from "../../simulation/ParticleProperties";
import { Simulation } from "../../simulation/Simulation";
import { Vector, gaussianSample } from "../../simulation/Utils";
import { SimulationDimensions } from "../ParticleInit";

const BACKGROUND_REPULSION = -1;
const BASE_SELF_ATTRACTION = 5;
const DECOUPLING_STRENGTH = -5;
const BINDER_SELF_ATTRACTION = 1;
const BINDER_STRENGTH = 10;
const SHELL_SELF_REPULSION = 4;

export type rnaSimulationProps = {
    interactionCutoff: number,
    collisionCutoff: number,

    pairCt: number;
    pairPhysics: ParticlePhysicsProps;
    pairBinderCt: number;
    pairBinderPhysics: ParticlePhysicsProps;
    chainBinderCt: number;
    chainBinderPhysics: ParticlePhysicsProps;
    shellCt: number;
    shellPhysics: ParticlePhysicsProps;

    universalRepulsion?: number,
    basePairSelfAttraction?: number,
    basePairRepulsion?: number,
    chainBinderStrength?: number,
    chainBinderSelfAttraction?: number,
    pairBinderStrength?: number;
    pairBinderSelfAttraction?: number,
    shellSelfRepulsion?: number,
    shellStrength?: number,

    initialSpread: number,
}

export const rnaInteractionTensor = (system: rnaSimulationProps) => {
    const _____ = system.universalRepulsion ?? BACKGROUND_REPULSION;

    const A____ = system.basePairSelfAttraction ?? BASE_SELF_ATTRACTION; 
    const U____ = system.basePairSelfAttraction ?? BASE_SELF_ATTRACTION; 
    const G____ = system.basePairSelfAttraction ?? BASE_SELF_ATTRACTION; 
    const C____ = system.basePairSelfAttraction ?? BASE_SELF_ATTRACTION;
    const xxxxx = system.basePairRepulsion ?? DECOUPLING_STRENGTH;

    const PAIR_ = system.pairBinderSelfAttraction ?? BINDER_SELF_ATTRACTION;
    const AU___ = system.pairBinderStrength ?? BINDER_STRENGTH;
    const GC___ = system.pairBinderStrength ?? BINDER_STRENGTH;
    
    const CHAIN = system.chainBinderSelfAttraction ?? BINDER_SELF_ATTRACTION;
    const B___B = system.chainBinderStrength ?? BINDER_STRENGTH;

    const shell = system.shellSelfRepulsion ?? SHELL_SELF_REPULSION; 
    const S___S = system.shellStrength ?? BINDER_STRENGTH; 

    return [
        [A____, xxxxx, xxxxx, xxxxx, B___B, AU___, xxxxx, S___S], // A
        [xxxxx, U____, xxxxx, xxxxx, B___B, AU___, xxxxx, S___S], // U
        [xxxxx, xxxxx, G____, xxxxx, B___B, xxxxx, GC___, S___S], // G
        [xxxxx, xxxxx, xxxxx, C____, B___B, xxxxx, GC___, S___S], // C
        [B___B, B___B, B___B, B___B, CHAIN, _____, _____, S___S], // Full Chain binder
        [AU___, AU___, xxxxx, xxxxx, _____, PAIR_, xxxxx, _____], // U-A Pair binder
        [xxxxx, xxxxx, GC___, GC___, _____, xxxxx, PAIR_, _____], // G-C Pair binder
        [S___S, S___S, S___S, S___S, S___S, _____, _____, shell], // Protective Shell
    ];
}

const hueOffset = 45;
export const rnaParticleProperties = (params: rnaSimulationProps): ParticleProperties[] => {
    // Nucleotides
    const properties: ParticleProperties[] = [];
    for (let i = 0; i < 4; i++) {
        properties.push(new ParticleProperties(i, "h" + i.toString(), 
            params.pairPhysics, 
            { 
                color: hueToRgb(i * 90 + hueOffset), 
                size: params.pairPhysics.radius, 
            })
        );
    }
    // Chain binder: Hold the otherwise-repulsive base pairs together
    properties.push(new ParticleProperties(4, "h" + (4).toString(), 
        params.chainBinderPhysics, 
        { 
            color: new Color(50, 50, 50), 
            size: params.chainBinderPhysics.radius, 
        })
    );
    // Pair binder: Hold the otherwise-repulsive base pairs together
    for (let i = 0; i < 2; i++) {
        properties.push(new ParticleProperties(i + 5, "h" + (i + 5).toString(), 
        params.pairBinderPhysics, 
            { 
                color: hueToRgb(i * 180 + 45 + hueOffset), 
                size: params.pairBinderPhysics.radius, 
            })
        );
    }
    // Shell binder: Hold the otherwise-repulsive base pairs together
    properties.push(new ParticleProperties(7, "h" + (7).toString(), 
        params.pairBinderPhysics, 
            { 
                color: new Color(50, 50, 50), 
                size: params.pairBinderPhysics.radius, 
            })
        );
    return properties;
}

export const particles = (system: rnaSimulationProps, particleProperties: ParticleProperties[]) => {
    
    return particles;
};

export const rnaSimulation = (props: SimulationDimensions, specialProps: rnaSimulationProps) => {
    const particleProperties = rnaParticleProperties(specialProps);
    const particles: Particle[] = [];
    [
        specialProps.pairCt, specialProps.pairCt, specialProps.pairCt, specialProps.pairCt, 
        specialProps.chainBinderCt,
        specialProps.pairBinderCt, specialProps.pairBinderCt, specialProps.shellCt,
    ].forEach((ct: number, index: number) => {
        for (let _ = 0; _ < ct; _++) {
            particles.push(new Particle({
                properties: particleProperties[index],
                position: (new Vector(gaussianSample(props.dimension, specialProps.initialSpread))),
            }))
        }
    })

    return new Simulation({
        dimension: props.dimension,
        stepSize: props.h,
        boundary: closedCircularBounds(props.dimension, props.globalSize),
        particleProperties: particleProperties,
        rule: new InteractionTable({ particleProperties: particleProperties, monopoleTensor: rnaInteractionTensor(specialProps) }),
        particles: particles,

        interactionBound: specialProps.interactionCutoff,
        collisionBound: specialProps.collisionCutoff,
    });
}
