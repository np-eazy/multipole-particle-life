import { ParticleProperties } from "../simulation/ParticleProperties";
import { Color } from "./utils";

export type ParticleGraphicsProps = {
    parent?: ParticleProperties;
    color: Color;
    size: number;
}
