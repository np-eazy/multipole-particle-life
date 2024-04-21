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
    xvelocity: number;
    yvelocity: number;
    zvelocity: number;
    damping: number;
    acceleration: number;
    toggleRotate: boolean;
    rotateSensitivity: number;

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
            camy: 0,
            camz: 0,
            fov: Math.PI / 8,
            theta: -0.5 * Math.PI,
            phi: 0 * Math.PI,
            yaw: 0,
        } : undefined;
        this.xvelocity = 0;
        this.yvelocity = 0;
        this.zvelocity = 0;
        this.damping = 0.9;
        this.toggleRotate = false;
        this.acceleration = 1;
        this.rotateSensitivity = 0.02;
        this.initListeners();
        this.initMouseListeners();
    }
    loadRenderCoord(globalPosition: Vector, parent?: Particle): number[] {
        const projection: Vector = this.cameraTf != undefined ? cameraTransformation(globalPosition.x, this.cameraTf) : globalPosition;
        const affine: Vector = this.panningTf != undefined ? affineTransformation(projection, this.panningTf) : projection;

        if (parent) parent.cameraPosition = affine;
        return affine.x;
    }

    initListeners() {
        document.addEventListener('keydown', (event) => {
          switch (event.key) {
            case 'w':
            case 'W':
              this.moveForward();
              break;
            case 'a':
            case 'A':
              this.moveLeft();
              break;
            case 's':
            case 'S':
              this.moveBackward();
              break;
            case 'd':
            case 'D':
              this.moveRight();
              break;
            default:
              break;
          }
        });
      }
    
    initMouseListeners() {
        let lastX: number | null = null;
        let lastY: number | null = null;
    
        document.addEventListener('mousemove', (event) => {
            if (lastX !== null && lastY !== null) {
                const deltaX = event.clientX - lastX;
                const deltaY = event.clientY - lastY;
                if (this.cameraTf && this.toggleRotate) {
                    this.cameraTf.theta += deltaX * this.rotateSensitivity * this.cameraTf.fov; // Adjust sensitivity as needed
                    this.cameraTf.phi += deltaY * this.rotateSensitivity * this.cameraTf.fov; // Adjust sensitivity as needed
                }
            }
            lastX = event.clientX;
            lastY = event.clientY;
        });

        document.addEventListener('click', () => {
            this.toggleRotate = !this.toggleRotate; // Toggle the boolean value
            this.rotateSensitivity = this.toggleRotate ? 0.02 : 0; // Adjust rotateSensitivity based on toggleRotate
        });

    document.addEventListener('wheel', (event) => {
        if (this.cameraTf && this.toggleRotate) {
            const zoomIntensity = 0.1;
            this.cameraTf.fov -= event.deltaY * zoomIntensity * this.rotateSensitivity;
            this.cameraTf.fov = Math.max(0.1, Math.min(Math.PI / 2, this.cameraTf.fov));
        }
    });

    }

    moveUp(): void {
        const upVector = this.calculateUpVector();
        if (this.cameraTf) {
            this.xvelocity += upVector.x * this.acceleration;
            this.yvelocity += upVector.y * this.acceleration;
            this.zvelocity += upVector.z * this.acceleration;
        }
    }

    moveDown(): void {
        const upVector = this.calculateUpVector();
        if (this.cameraTf) {
            this.xvelocity -= upVector.x * this.acceleration;
            this.yvelocity -= upVector.y * this.acceleration;
            this.zvelocity -= upVector.z * this.acceleration;
        }
    }

    moveLeft(): void {
        const rightVector = this.calculateRightVector();
        if (this.cameraTf) {
            this.xvelocity -= rightVector.x * this.acceleration;
            this.yvelocity -= rightVector.y * this.acceleration;
            this.zvelocity -= rightVector.z * this.acceleration;
        }
    }

    moveRight(): void {
        const rightVector = this.calculateRightVector();
        if (this.cameraTf) {
            this.xvelocity += rightVector.x * this.acceleration;
            this.yvelocity += rightVector.y * this.acceleration;
            this.zvelocity += rightVector.z * this.acceleration;
        }
    }

    moveForward(): void {
        const forwardVector = this.calculateForwardVector();
        if (this.cameraTf) {
            this.xvelocity += forwardVector.x * this.acceleration;
            this.yvelocity += forwardVector.y * this.acceleration;
            this.zvelocity += forwardVector.z * this.acceleration;
        }
    }

    moveBackward(): void {
        const forwardVector = this.calculateForwardVector();
        if (this.cameraTf) {
            this.xvelocity -= forwardVector.x * this.acceleration;
            this.yvelocity -= forwardVector.y * this.acceleration;
            this.zvelocity -= forwardVector.z * this.acceleration;
        }
    }

    updateCameraPosition(): void {
        if (this.cameraTf) {
            this.cameraTf.camx += this.xvelocity;
            this.cameraTf.camy += this.yvelocity;
            this.cameraTf.camz += this.zvelocity;
            this.cameraTf.phi = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraTf.phi));
        }
        this.xvelocity *= this.damping;
        this.yvelocity *= this.damping;
        this.zvelocity *= this.damping;
    }

    private calculateUpVector(): { x: number, y: number, z: number } {
        // Assuming up is in the direction of the world's y-axis
        return { x: 0, y: 0, z: 1 };
    }

    private calculateRightVector(): { x: number, y: number, z: number } {
        // Calculate right vector based on theta
        if (this.cameraTf) {
            const theta = this.cameraTf.theta;
            return {
                x: Math.cos(theta + Math.PI / 2),
                y: Math.sin(theta + Math.PI / 2),
                z: 0 // Assuming movement in the x-y plane
            };
        }
        return { x: 0, y: 0, z: 0 };
    }

    private calculateForwardVector(): { x: number, y: number, z: number } {
        if (this.cameraTf) {
            const theta = this.cameraTf.theta;
            const phi = this.cameraTf.phi;
            return {
                x: -Math.cos(phi) * Math.cos(theta),
                y: Math.cos(phi) * Math.sin(theta),
                z: -Math.sin(phi)
            };
        }
        return { x: 0, y: 0, z: 0 };
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
