import { Particle } from "../simulation/Particle";
import { Simulation } from "../simulation/Simulation";
import { Vector } from "../simulation/Utils";

export type affineTf = {
    center: Vector,
    z: number,
    r?: number | Vector,
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
    startingZoom?: number,
}

export class View {
    parent: Simulation;
    dimension: number;
    panningTf: affineTf;
    cameraTf?: cameraTf;

    constructor(props: ViewProps) {
        this.parent = props.sim;
        const windowZoom = Math.min(...[props.windowHeight / 2, props.windowWidth / 2]) / (2 * Math.max(...props.sim.boundary.globalBounds.x));
        this.dimension = props.sim.dimension;
        this.panningTf = {
            center: new Vector([props.windowWidth / 2, props.windowHeight / 2].concat((new Array(this.dimension - 2))?.fill(0) ?? [])),
            z: windowZoom * (props.startingZoom ?? 1),
        }
        this.cameraTf = props.sim.dimension == 3 ? {
            camx: 0,
            camy: - props.sim.boundary.globalBounds.x[2] * 2,
            camz: 0,
            fov: Math.PI / 8,
            theta: -0.5 * Math.PI,
            phi: -0.5 * Math.PI,
            yaw: 0,
        } : undefined;
    }
    loadRenderCoord(globalPosition: Vector, parent?: Particle): number[] {
        const projection: Vector = this.cameraTf != undefined ? cameraTransformation(globalPosition.x, this.cameraTf) : globalPosition;
        const affine: Vector = this.panningTf != undefined ? affineTransformation(projection, this.panningTf) : projection;
        // this.cameraTf!.phi += 0.00001;

        if (parent) parent.cameraPosition = affine;
        return affine.x;
    }
}

const cameraTransformation = (globalPosition: number[], cameraTf: cameraTf, parent?: Particle): Vector => {
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
    const sz = dzPhi / fovFactor;

    const output = new Vector([sx, sy, -1 / sz])
    if (parent && parent.dimension > 2) parent.cameraPosition = new Vector([sx, sy, -1 / sz]);
    return output;
}

const affineTransformation = (globalPosition: Vector, affineTf: affineTf): Vector => {
    return affineTf.center.getScaledSum(affineTf.z, affineTf.r ? 
        globalPosition.getRotatedV(affineTf.r) : 
        globalPosition);
}
