import { ParticleGraphicsProps } from "../graphics/Particle";
import { ParticlePhysicsProps, ParticleProperties } from "./ParticleProperties";
import { Vector, randomDirectionV } from "./Utils";

export class Particle {
    id: string;
    dimension: number;
    properties: ParticleProperties;
    physics: ParticlePhysicsProps;
    graphics: ParticleGraphicsProps;

    position: Vector;
    orientation: Vector;
    velocity: Vector;
    angularVelocity: Vector;
    force: Vector;
    torque: Vector;
    deleted: boolean;

    constructor(params: {
        id?: string, 
        properties: ParticleProperties, 
        position: Vector, 
        orientation?: Vector,
        velocity?: Vector, 
        angularVelocity?: Vector,
        force?: Vector,
        torque?: Vector,
    }) {
        this.id = params.id ?? (Date.now() + Math.random() * 100000).toString();
        this.dimension = params.position.x.length;

        this.properties = params.properties;
        this.graphics = params.properties.graphics;
        this.physics = params.properties.physics;
        this.physics.charge = 1;

        this.position = params.position;
        this.orientation = params.velocity ?? randomDirectionV(this.dimension); // TODO: randomize direction
        this.velocity = params.velocity ?? new Vector(this.dimension);
        this.angularVelocity = params.angularVelocity ?? new Vector(this.dimension);

        this.force = params.force ?? new Vector(this.dimension);
        this.torque = params.torque ?? new Vector(this.dimension);

        this.deleted = false;
    }

    loadForce(force: Vector) {
        this.force.addV(force);
    }

    loadTorque(torque: Vector) {
        this.torque.addV(torque);
    }

    move(h: number) {
        this.force.scaleV(h / this.physics.mass);
        this.torque.scaleV(h / this.physics.momentCoefficient);

        this.velocity.addV(this.force);
        this.angularVelocity.addV(this.torque);

        this.position.addV(this.velocity);
        this.orientation.rotateV(this.angularVelocity, this.angularVelocity.getNorm());

        this.force = new Vector(this.dimension);
    }

    markForDeletion() {
        this.deleted = true;
    }
}
