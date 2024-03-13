import { ParticleGraphicsProps } from "../graphics/Particle";
import { ParticlePhysicsProps, ParticleProperties } from "./ParticleProperties";
import { Vector, randomDirectionV, randomNormalV, zeroV } from "./Utils";

export class Particle {
    id: string;
    dimension: number;
    properties: ParticleProperties;
    physics: ParticlePhysicsProps;

    position: Vector;
    velocity: Vector;
    force: Vector;
    orientation: number | Vector;
    angularVelocity: number | Vector;
    torque: number | Vector;

    graphics: ParticleGraphicsProps;
    cameraPosition?: Vector;

    deleted: boolean;

    constructor(params: {
        id?: string, 
        properties: ParticleProperties, 
        position: Vector, 
        velocity?: Vector, 
        force?: Vector,
        orientation?: number | Vector,
        angularVelocity?: number | Vector,
        torque?: number | Vector,
    }) {
        this.id = params.id ?? (Date.now() + Math.random() * 100000).toString();
        this.dimension = params.position.x.length;

        this.properties = params.properties;
        this.graphics = params.properties.graphics;
        this.physics = params.properties.physics;
        this.physics.charge = 0.1;

        this.position = params.position;
        this.velocity = params.velocity ?? new Vector(this.dimension);
        this.force = params.force ?? new Vector(this.dimension);

        if (this.dimension == 2) {
            this.orientation = params.orientation ?? Math.random() * Math.PI * 2; // TODO: randomize direction
            this.angularVelocity = params.angularVelocity ?? randomNormalV(1, 1).x[0] * 0; 
            this.torque = params.torque ?? 0;
        } else if (this.dimension == 3) {
            this.orientation = params.orientation ?? randomDirectionV(this.dimension); // TODO: randomize direction
            this.angularVelocity = params.angularVelocity ?? randomNormalV(3, 1).scaleV(0);
            this.torque = params.torque ?? zeroV(3);
        } else {
            throw new Error("Only dimensions 2 and 3 are supported");
        }
        this.deleted = false;
    }

    copy() {
        if (this.dimension == 2) {
            return new Particle({
                id: this.id,
                properties: this.properties,
                position: this.position.copy(), 
                velocity: this.velocity.copy(), 
                force: this.force.copy(),
                orientation: this.orientation as number,
                angularVelocity: this.angularVelocity as number,
                torque: this.torque as number,
            })
        } else {
            return new Particle({
                id: this.id,
                properties: this.properties,
                position: this.position.copy(), 
                velocity: this.velocity.copy(), 
                force: this.force.copy(),
                orientation: (this.orientation as Vector).copy(),
                angularVelocity: (this.angularVelocity as Vector).copy(),
                torque: (this.torque as Vector).copy(),
            })
        }
    }

    loadForce(force: Vector) {
        this.force.addV(force);
    }

    loadTorque(torque: Vector | number) {
        if (typeof torque === 'number' && typeof this.torque === 'number') {
            this.torque += torque;
        } else if (torque instanceof Vector && this.torque instanceof Vector) {
            this.torque.addV(torque);
        }
    }

    move(h: number) {
        this.position.addV(this.velocity.addScaledV(h / this.physics.mass, this.force));
        this.force.clear();

        if (this.dimension == 2) {
            this.angularVelocity = (this.angularVelocity as number) + (this.torque as number) * h / this.physics.momentOfInertia;
            this.orientation = (this.orientation as number) + this.angularVelocity;
            this.torque = 0;
        } else if (this.dimension == 3) {
            console.log("4", this.angularVelocity);
            (this.angularVelocity as Vector).addScaledV(h / this.physics.momentOfInertia, this.torque as Vector);
            (this.orientation as Vector)
                .rotateV(this.angularVelocity)
                .normalize();
            (this.torque as Vector).clear();
        }
    }

    markForDeletion() {
        this.deleted = true;
    }
}
