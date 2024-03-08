import { ParticleGraphicsProps } from "../graphics/ParticleGraphicsProps";
import { ParticlePhysicsProps, ParticleProperties } from "./ParticleProperties";
import { decayRate } from "./Physics";
import { Orientation } from "./utils";

export const particleTypes = ["RED", "GREEN", "BLUE", "MAGENTA", "GOLD"];

export class Particle {
    id: string;
    dimension: number;
    properties: ParticleProperties;
    physics: ParticlePhysicsProps;
    graphics: ParticleGraphicsProps;
    position: Orientation;
    velocity: Orientation;
    forceTorque: Orientation;
    deleted: boolean;

    constructor(params: {
        id?: string, 
        properties: ParticleProperties, 
        position: Orientation, 
        velocity?: Orientation, 
        forceTorque?: Orientation
    }) {
        this.id = params.id ?? (Date.now() + Math.random() * 100000).toString();
        this.dimension = params.position.x.length;

        // Redundant referencing for easier coding
        this.properties = params.properties;
        this.graphics = params.properties.graphics;
        this.physics = params.properties.physics;

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
        this.forceTorque.scaleX(h / this.physics.mass);
        // TODO: handle torque
        this.velocity.addX(this.forceTorque);
        this.position.addX(this.velocity);
        this.velocity.scaleX(1 - h * (1 - decayRate));

        this.forceTorque = new Orientation(this.dimension);
    }

    markForDeletion() {
        this.deleted = true;
    }
}
