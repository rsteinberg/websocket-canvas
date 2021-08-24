class CanvasController {
    private canvas: HTMLCanvasElement;
    private canvasDiv: HTMLDivElement;
    private ctx: CanvasRenderingContext2D | null;

    private isMouseDown: boolean = false;
    private x: number = 0;
    private y: number = 0;

    private paths: Coordinates[][] = [];
    private currentPath: Coordinates[] = [];

    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvasDiv = document.querySelector("#canvas") as HTMLDivElement;

        this.canvasDiv.appendChild(this.canvas);
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.ctx = this.canvas.getContext("2d");

        // Events
        this.canvasDiv.addEventListener("mousedown", e => this.onMouseDown(e));
        this.canvasDiv.addEventListener("mouseup", () => this.onMouseUp());
        this.canvasDiv.addEventListener("mousemove", e => this.onMouseMove(e));
    }

    onMouseDown(event: MouseEvent) {
        this.isMouseDown = true;
        this.x = event.clientX;
        this.y = event.clientY;
        this.currentPath = [new Coordinates(this.x, this.y)];
    }

    onMouseUp() {
        this.isMouseDown = false;
        this.ctx?.closePath();
        this.paths.push(this.currentPath);
    }

    onMouseMove(event: MouseEvent) {
        if (!this.isMouseDown || !this.ctx) {
            return;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(event.clientX, event.clientY);
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.currentPath.push(new Coordinates(event.clientX, event.clientY));

        this.x = event.clientX;
        this.y = event.clientY;
    }
}


class Coordinates {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

const app = new CanvasController();

export { app };
