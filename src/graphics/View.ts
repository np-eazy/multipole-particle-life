import { Simulation } from "../simulation/Simulation";
import { Vector } from "../simulation/Utils";

export type affineTf = {
    cx: number,
    cy: number,
    z: number,
    r?: number,
}

export type cameraTf = {
    camx: number,
    camy: number,
    camz: number,
    fov: number,
    theta: number,
    phi: number,
    yaw?: number,
}

export type ViewProps = {
    sim: Simulation, 
    windowHeight: number, 
    windowWidth: number,
}

export class View {
    parent: Simulation;
    dimension: number;
    panningTf: affineTf;
    cameraTf?: cameraTf;

    constructor(props: ViewProps) {
        this.parent = props.sim;
        const windowZoom = Math.min(...[props.windowHeight, props.windowWidth]) / Math.max(...props.sim.boundary.globalBounds.x);
        this.dimension = props.sim.dimension;
        this.panningTf = {
            cx: props.windowWidth / 2,
            cy: props.windowHeight / 2,
            z: windowZoom,
        }
        this.cameraTf = props.sim.dimension != 3 ? undefined : {
            camx: 0,
            camy: 0,
            camz: props.sim.boundary.globalBounds.x[2],
            fov: 30,
            theta: -0.5 * Math.PI,
            phi: -0.5 * Math.PI,
            yaw: 0,
        }
    }

    getRenderCoord(globalPosition: Vector): number[] {
        const projection: number[] = this.cameraTf != undefined ? cameraTransformation(globalPosition.x, this.cameraTf) : globalPosition.x.slice(0, 2);
        const affine: number[] = this.panningTf != undefined ? affineTransformation(projection, this.panningTf) : projection;
        return [...affine, this.cameraTf ? projection[2] : this.panningTf.z];
    }
}

const cameraTransformation = (globalPosition: number[], cameraTf: cameraTf, getDepth?: boolean): number[] => {
    const [x, y, z] = globalPosition;
    const dx = x - cameraTf.camx;
    const dy = y - cameraTf.camy;
    const dz = z - cameraTf.camz;

    const cosPhi = Math.cos(cameraTf.phi);
    const sinPhi = Math.sin(cameraTf.phi);
    const cosTheta = Math.cos(cameraTf.theta);
    const sinTheta = Math.sin(cameraTf.theta);

    const dxTheta = dx * cosTheta - dz * sinTheta;
    const dzTheta = dx * sinTheta + dz * cosTheta;
    const dyPhi = dy * cosPhi - dzTheta * sinPhi;
    const dzPhi = dy * sinPhi + dzTheta * cosPhi;

    const fovFactor = 1.0 / Math.tan(cameraTf.fov / 2);
    const sx = fovFactor * (dxTheta / dzPhi);
    const sy = fovFactor * (dyPhi / dzPhi);

    if (getDepth) {
        const sz = dzPhi;
        return [sx, sy, sz];

    } else {
        return [sx, sy];
    }
}

const affineTransformation = (globalPosition: number[], affineTf: affineTf): number[] => {
    const translatedX = globalPosition[0];
    const translatedY = globalPosition[1];

    const rotatedX = affineTf.r ? translatedX * Math.cos(affineTf.r) - translatedY * Math.sin(affineTf.r) : translatedX;
    const rotatedY = affineTf.r ? translatedX * Math.sin(affineTf.r) + translatedY * Math.cos(affineTf.r) : translatedY;

    return [
        affineTf.cx + rotatedX * affineTf.z, 
        affineTf.cy + rotatedY * affineTf.z, 
    ];
}
