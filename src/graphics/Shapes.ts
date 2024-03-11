import { Color } from "./Color";

export function drawCircle(ctx: any, x: number, y: number, radius: number, color: Color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI); 
    ctx.fillStyle = color.toHex();
    ctx.fill();
}

export function drawLine(ctx: any, startX: number, startY: number, endX: number, endY: number, color: Color, lineWidth: number = 2) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color.toHex();
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}
