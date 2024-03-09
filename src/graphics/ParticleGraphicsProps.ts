import { ParticleProperties } from "../simulation/ParticleProperties";
import { Color } from "./Color";

export type ParticleGraphicsProps = {
    parent?: ParticleProperties;
    color: Color;
    size: number;
    renderCallback: Function;
}
