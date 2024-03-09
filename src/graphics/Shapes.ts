import { Color } from "./Color";

export function drawCircle(ctx: any, x: number, y: number, radius: number, color: Color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI); 
    ctx.fillStyle = color.toHex();
    ctx.fill();
}
