export class Vector {
    x: number[];
    norm: number | undefined;

    constructor(x: number[] | number, norm?: number) {
        if (Array.isArray(x)) {
            this.x = x;
        } else {
            this.x = new Array(x).fill(0); 
        }
    }
    copy() {
        return new Vector(this.x.map(x_i => x_i), this.norm);
    }
    resetCache() {
        this.norm = undefined;
    }

    // Constructive operations
    getNorm(squared?: boolean): number {
        const normSquared = this.x.reduce((prev, curr) => prev + curr * curr, 0);
        if (squared) {
            return normSquared;
        } else {
            return Math.sqrt(normSquared);
        }
    }
    getDistance(other: Vector, squared?: boolean): number {
        const distSquared = this.x.reduce((prev, curr, index) => prev + (other.x[index] - curr) ** 2, 0);
        return squared ? distSquared : Math.sqrt(distSquared);
    }
    getDotX(other: Vector): number {
        return this.x.reduce((sum, component, index) => sum + component * other.x[index], 0);
    }
    getDelta(other: Vector): Vector {
        return new Vector(this.x.map((x_i, i) => other.x[i] - x_i)); 
    }
    getDirection(other: Vector): Vector {
        const delta = this.getDelta(other);
        delta.scaleV(1 / delta.getNorm());
        return delta;
    }
    getCrossProduct(dx: Vector): Vector | number {
        if (dx.x.length == 3) {
            return new Vector([
                this.x[1] * dx.x[2] - this.x[2] * dx.x[1],
                this.x[2] * dx.x[0] - this.x[0] * dx.x[2],
                this.x[0] * dx.x[1] - this.x[1] * dx.x[0]
            ]);
        } else {
            return this.x[0] * dx.x[1] - this.x[1] * dx.x[0];
        }
        
    }
    getTheta(): Vector {
        return new Vector([
            Math.cos(Math.atan2(this.x[2], this.x[1])) * Math.sin(Math.acos(this.x[0] / this.getNorm())),
            Math.sin(Math.atan2(this.x[2], this.x[1])) * Math.sin(Math.acos(this.x[0] / this.getNorm())),
            Math.cos(Math.acos(this.x[0] / this.getNorm()))
        ]); // Unit vector in the direction of theta
    }
    getSphericalBasis(): Vector[] {
        const rho = this.normalize(); // Unit vector in the direction of rho
        const theta = new Vector([
            Math.cos(Math.atan2(this.x[2], this.x[1])) * Math.sin(Math.acos(this.x[0] / this.getNorm())),
            Math.sin(Math.atan2(this.x[2], this.x[1])) * Math.sin(Math.acos(this.x[0] / this.getNorm())),
            Math.cos(Math.acos(this.x[0] / this.getNorm()))
        ]); // Unit vector in the direction of theta
        const phi = new Vector([
            -Math.sin(Math.atan2(this.x[2], this.x[1])),
            Math.cos(Math.atan2(this.x[2], this.x[1])),
            0
        ]); // Unit vector in the direction of phi
        return [rho, theta, phi];
    }

    // In-place operations
    scaleV(c: number): Vector {
        this.x = this.x.map((x_i) => x_i * c);
        if (this.norm) this.norm *= c;
        return this;
    }
    normalize(cache?: boolean): Vector {
        const norm = this.getNorm();
        this.x = this.x.map((x_i) => x_i / norm);
        if (cache) this.norm = 1;
        return this;
    }
    addV(dx: number[] | Vector): Vector {
        if (Array.isArray(dx)) {
            this.x = this.x.map((x_i, i) => dx[i] + x_i);
        } else {
            this.x = this.x.map((x_i, i) => dx.x[i] + x_i); 
        }
        this.resetCache();
        return this;
    }
    subV(dx: number[] | Vector): Vector {
        if (Array.isArray(dx)) {
            this.x = this.x.map((x_i, i) => dx[i] - x_i);
        } else {
            this.x = this.x.map((x_i, i) => dx.x[i] - x_i); 
        }
        this.resetCache();
        return this;
    }
    // If we know that c is very small, cacheDiff allows us to correct the norm using a differential approximation
    addScaledV(c: number, dx: Vector, cacheDiff?: boolean): Vector {
        if (Array.isArray(dx)) {
            this.x = this.x.map((x_i, i) => x_i + c * dx[i]);
        } else {
            this.x = this.x.map((x_i, i) => x_i + c * dx.x[i]); 
        }
        this.resetCache();
        return this;
    }
    rotateV(axis: Vector, angle: number): Vector {
        const normAxis = axis.normalize(true);
        const sinAngle = Math.sin(angle);
        const cosAngle = Math.cos(angle);
        const oneMinusCosAngle = 1 - cosAngle;

        const x = normAxis.x[0], y = normAxis.x[1], z = normAxis.x[2];
        const xy = x * y, yz = y * z, zx = z * x;
        const xs = x * sinAngle, ys = y * sinAngle, zs = z * sinAngle;

        const rotationMatrix = [
            [cosAngle + oneMinusCosAngle * x * x, oneMinusCosAngle * xy - zs, oneMinusCosAngle * zx + ys],
            [oneMinusCosAngle * xy + zs, cosAngle + oneMinusCosAngle * y * y, oneMinusCosAngle * yz - xs],
            [oneMinusCosAngle * zx - ys, oneMinusCosAngle * yz + xs, cosAngle + oneMinusCosAngle * z * z]
        ];

        const rotatedVector = this.x.map((_, i) => 
            this.x.reduce((sum, coord, j) => sum + rotationMatrix[i][j] * coord, 0)
        );

        this.x = rotatedVector;
        return this;
    }
}

export class Orientation extends Vector {
    dxn: number[];
    constructor(x: number[] | number, dxn: number[]) {
        super(x);
        this.dxn = dxn;
    }
    copy() {
        return new Orientation(this.x.map(x_i => x_i), this.dxn);
    }
}

export const normalize = (x: number[]): number[] => {
    const norm = Math.sqrt(x.reduce((prev, curr) => prev + curr * curr, 0));
    return x.map(x_i => x_i / norm);
}

export const randomUnitVector = (n: number): number[] => {
    let vector = Array.from({length: n}, () => gaussianRandom());
    const magnitude = Math.sqrt(vector.reduce((sum, component) => sum + component * component, 0));
    return vector.map(component => component / magnitude);
}

export const gaussianRandom = (): number => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export const angleBetweenUnitVectors = (v1: number[], v2: number[]): number => {
    const dotProduct = v1.reduce((sum, component, index) => sum + component * v2[index], 0);
    const angle = Math.acos(dotProduct);
    return angle;
}

export const getDistance = (v1: number[], v2: number[], square?: boolean): number => {
    const distSquared = v1.reduce((sum, component, index) => sum + (v2[index] - component) ** 2, 0);
    return square ? distSquared : Math.sqrt(distSquared);
}

export const randomNormal2D = (x: number, y: number, sigma: number = 1/3): number => {
    const factor = 1 / (2 * Math.PI * sigma * sigma);
    const exponent = -(x*x + y*y) / (2 * sigma * sigma);
    return factor * Math.exp(exponent);
}

export const sample2DGaussian = (sigma: number): number[] => {
    // Generate two uniform random numbers
    const u1 = Math.random();
    const u2 = Math.random();

    // Box-Muller transform
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

    // Scale by the desired standard deviation (sigma)
    const x = z0 * sigma;
    const y = z1 * sigma;

    return [x, y];
}

export const secantApprox = (fn: Function, x: number, positiveOnly=false, h=1e-9, zeroLim = 1e-12) => {
    if (positiveOnly) {
        if (x > h/2) {
            return (fn(x + h/2) - fn(x - h/2)) / h;
        } else {
            return (fn(h + zeroLim) - fn(zeroLim)) / h; 
        }
    } else {
        return (fn(x + h/2) / fn(x - h/2)) / h;
    }
}
