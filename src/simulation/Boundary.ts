import { Particle } from "./Particle";

export class Boundary {
    equation: Function;
    outOfBoundsCallback: Function;
    constructor({equation, outOfBoundsCallback}: {equation: Function, outOfBoundsCallback: Function}) {
        this.equation = equation;
        this.outOfBoundsCallback = outOfBoundsCallback;
    }

    checkBounds(particles: Particle[]) {
        particles.forEach((particle: Particle) => {
            if (this.equation(particle) == false) {
                this.outOfBoundsCallback(particle);
            }
        });
    }
}

const _X = 0;
const _Y = 1;

export const unitSquare = () => new Boundary({
    equation: (particle: Particle) => {
        const xSize = 1;
        const ySize = 1;
        const inBounds = Math.abs(particle.position.x[_X]) < xSize && Math.abs(particle.position.x[_Y]) < ySize;
        return inBounds;
    },
    outOfBoundsCallback: (particle: Particle) => {
        particle.markForDeletion();
    }
});
