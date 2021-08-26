import Coordinates from "./coordinates.js";

export default class CanvasUtil {
    private canvas?: HTMLCanvasElement;
    private ctx?: CanvasRenderingContext2D | null;

    private canvasWidth: number;
    private canvasHeight: number;

    private currentCoordinates: Coordinates;

    public paths: Coordinates[][] = [];
    public currentPath: Coordinates[] = [];

    constructor(canvasWidth: number, canvasHeight: number) {
        this.currentCoordinates = new Coordinates(0, 0);
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.createCanvas();
    }

    public getCanvas(): HTMLCanvasElement {
        if (!this.canvas) {
            this.createCanvas();
        }
        return this.canvas!;
    }

    public recreateCanvas() {
        this.createCanvas();
        return this.canvas;
    }

    public startPath(coordinates: Coordinates) {
        this.currentPath.push(coordinates);
        this.currentCoordinates = coordinates;
    }

    public stopPath() {
        if (this.currentPath.length) {
            this.paths.push(this.currentPath);
        }
        this.currentPath = [];
    }

    public draw(coordinates: Coordinates) {
        if (!this.ctx) {
            throw new Error('No canvas context available!');
        }

        this.ctx.beginPath();
        this.ctx.moveTo(this.currentCoordinates.x, this.currentCoordinates.y);
        this.ctx.lineTo(coordinates.x, coordinates.y);
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.currentPath.push(coordinates);
        this.currentCoordinates = coordinates;
    }

    /**
     * States whether the canvas API is supported by the browser and whether
     * drawing will work
     */
    public get isCanvasApiSupported(): boolean {
        return !!this.ctx;
    }

    private createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
        }
    }
}
