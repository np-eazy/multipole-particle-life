export class Color {
    r: number;
    g: number;
    b: number;
    hex: string | undefined;

    constructor(r: number, b: number, g: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    set(r: number, b: number, g: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.hex = undefined;
    }

    add(r: number, b: number, g: number) {
        this.r += r;
        this.g += g;
        this.b += b;
        this.hex = undefined;
    }
    
    clamp() {
        this.r = Math.max(0, Math.min(255, this.r));
        this.g = Math.max(0, Math.min(255, this.g));
        this.b = Math.max(0, Math.min(255, this.b));
        return this;
    }


    toHex() {
        if (this.hex) {
            return this.hex;
        } else {
            this.hex = undefined;

        }
        const conv = (c: number) => c.toString(16).padStart(2, '0');
        return `#${conv(this.r)}${conv(this.g)}${conv(this.b)}`;
    }
}

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

export const cameraTransformation = (globalPosition: number[], cameraTf: cameraTf, getDepth?: boolean): number[] => {
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

export const affineTransformation = (globalPosition: number[], affineTf: affineTf): number[] => {
    const translatedX = globalPosition[0];
    const translatedY = globalPosition[1];

    const rotatedX = affineTf.r ? translatedX * Math.cos(affineTf.r) - translatedY * Math.sin(affineTf.r) : translatedX;
    const rotatedY = affineTf.r ? translatedX * Math.sin(affineTf.r) + translatedY * Math.cos(affineTf.r) : translatedY;

    return [
        affineTf.cx + rotatedX * affineTf.z, 
        affineTf.cy + rotatedY * affineTf.z, 
    ];
}

export const getRenderCoord = (globalPosition: number[], affineTf?: affineTf, cameraTf?: cameraTf): number[] => {
    const projection: number[] = cameraTf != undefined ? cameraTransformation(globalPosition, cameraTf) : globalPosition.slice(0, 2);
    const affine: number[] = affineTf != undefined ? affineTransformation(projection, affineTf) : projection;
    return affine;
}
