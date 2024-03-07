import { decayRate } from "./Physics";
import { Orientation } from "./utils";

export const particleTypes = ["RED", "GREEN", "BLUE", "MAGENTA", "GOLD"];

export class Particle {
    id: string;
    dimension: number;
    mass: number;
    radius: number;
    momentCoefficient: number;
    particleType: string;
    position: Orientation;
    velocity: Orientation;
    forceTorque: Orientation;
    deleted: boolean;

    constructor(params: {id?: string, particleType: string, mass: number, radius: number, momentCoefficient: number, position: Orientation, velocity?: Orientation, forceTorque?: Orientation}) {
        this.id = params.id ?? (Date.now() + Math.random() * 100000).toString();
        this.dimension = params.position.x.length;
        this.mass = params.mass;
        this.radius = params.radius;
        this.momentCoefficient = params.momentCoefficient;
        this.particleType = params.particleType;
        this.position = params.position;
        this.velocity = params.velocity ?? new Orientation(this.dimension);
        this.forceTorque = params.forceTorque ?? new Orientation(this.dimension);
        this.deleted = false;
    }

    loadForce(force: Orientation) {
        this.forceTorque.addX(force);
        // TODO: handle torque
    }

    move(h: number) {
        this.forceTorque.scaleX(h / this.mass);
        // TODO: handle torque
        this.velocity.addX(this.forceTorque);
        this.position.addX(this.velocity);
        this.velocity.scaleX(1 - h * decayRate);

        this.forceTorque = new Orientation(this.dimension);
    }

    markForDeletion() {
        this.deleted = true;
    }
}
