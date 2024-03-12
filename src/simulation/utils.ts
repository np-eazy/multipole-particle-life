
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
    copy(): Vector {
        return new Vector(this.x.map(x_i => x_i), this.norm);
    }
    resetCache(): Vector {
        this.norm = undefined;
        return this;
    }
    setTo(v: Vector): Vector {
        this.x = v.x.map(xi => xi);
        return this;
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
    getNormal(): Vector {
        const norm = this.getNorm();
        return new Vector(this.x.map((x_i) => x_i / norm));
    }
    getDistance(other: Vector, squared?: boolean): number {
        const distSquared = this.x.reduce((prev, curr, index) => prev + (other.x[index] - curr) ** 2, 0);
        return squared ? distSquared : Math.sqrt(distSquared);
    }
    getDotX(other: Vector): number {
        return this.x.reduce((sum, component, index) => sum + component * other.x[index], 0);
    }
    getSum(other: Vector): Vector {
        return new Vector(this.x.map((x_i, i) => other.x[i] + x_i)); 
    }
    getScaledSum(c: number, other: Vector): Vector {
        return new Vector(this.x.map((x_i, i) => c * other.x[i] + x_i)); 
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
    clear(): Vector {
        this.x = this.x.map(xi => 0);
        return this;
    }
    addScaledV(c: number, dx: Vector, cacheDiff?: boolean): Vector {
        if (Array.isArray(dx)) {
            this.x = this.x.map((x_i, i) => x_i + c * dx[i]);
        } else {
            this.x = this.x.map((x_i, i) => x_i + c * dx.x[i]); 
        }
        this.resetCache();
        return this;
    }
    rotateV(angle: number | Vector): Vector {
        if (typeof angle == "number") {
            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);
            if (this.x.length !== 2) {
                throw new Error("rotate2D is only applicable to 2D vectors.");
            }
            const rotatedX = cosAngle * this.x[0] - sinAngle * this.x[1];
            const rotatedY = sinAngle * this.x[0] + cosAngle * this.x[1];
            this.x = [rotatedX, rotatedY];
            return this;
        } else {
            const omega = angle.getNorm();
            const normAxis = angle.getNormal();
            const sinAngle = Math.sin(omega);
            const cosAngle = Math.cos(omega);
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
    getRotatedV(angle: number | Vector) {
        const [temp1, temp2] = [this.copy(), this.rotateV(angle)];
        this.setTo(temp1);
        return temp2;
    }
}

export const zeroV = (dimension?: number): Vector => {
    return new Vector((new Array(dimension)).fill(0));
}

export const unitVector2D = (angle: number): Vector => {
    return new Vector([
        Math.cos(angle),
        Math.sin(angle),
    ]);
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

export const gaussianSample = (dimension: number, sigma: number): number[] => {
    let result = [];
    for (let i = 0; i < dimension; i += 2) {
        // Generate two uniform random numbers
        const u1 = Math.random();
        const u2 = Math.random();

        // Box-Muller transform
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

        // Scale by the desired standard deviation (sigma)
        result.push(z0 * sigma);
        if (i + 1 < dimension) {
            result.push(z1 * sigma);
        }
    }
    return result;
}
export const randomNormalV = (dimension: number, sigma: number): Vector => {
    return new Vector(gaussianSample(dimension, sigma));
}
export const randomDirectionV = (dimension: number): Vector => {
    return (new Vector(gaussianSample(dimension, 1)).normalize());
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
