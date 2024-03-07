import { normalize, randomUnitVector } from "./utils";

export class Orientation {
    dimension: number;
    x: number[];
    dxn: number[];

    constructor(x: number[] | number, dxn?: number[]) {
        if (Array.isArray(x)) {
            this.dimension = x.length;
            this.x = x;
            this.dxn = dxn ? normalize(dxn) : randomUnitVector(this.dimension);
        } else {
            this.dimension = x;
            this.x = new Array(x).fill(0); 
            this.dxn = dxn ? normalize(dxn) : randomUnitVector(this.dimension);
        }
    }

    getNormX(squared = false): number {
        const normSquared = this.x.reduce((prev, curr) => prev + curr * curr, 0);
        return squared ? normSquared : Math.sqrt(normSquared);
    }

    addX(dx: number[] | Orientation): void {
        if (Array.isArray(dx)) {
            this.x = this.x.map((x_i, i) => x_i + dx[i]);
        } else {
            this.x = this.x.map((x_i, i) => x_i + dx.x[i]); 
        }
    }

    subX(dx: number[] | Orientation): void {
        if (Array.isArray(dx)) {
            this.x = this.x.map((x_i, i) => x_i - dx[i]);
        } else {
            this.x = this.x.map((x_i, i) => x_i - dx.x[i]); 
        }    
    }

    scaleX(c: number): void {
        this.x = this.x.map((x_i) => x_i * c);
    }

    // This makes it easier to create linear combinations on the fly
    scaleAddX(c: number, dx: number[] | Orientation): void {
        if (Array.isArray(dx)) {
            this.x = this.x.map((x_i, i) => x_i + c * dx[i]);
        } else {
            this.x = this.x.map((x_i, i) => x_i + c * dx.x[i]); 
        }
    }

    deltaX(dx: Orientation): Orientation {
        return new Orientation(this.x.map((x_i, i) => x_i - dx.x[i])); 
    }

    unitDeltaX(dx: Orientation): Orientation {
        const delta = this.deltaX(dx);
        delta.scaleX(1 / delta.getNormX());
        return delta;
    }
}
