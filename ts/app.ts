class CanvasController {
    private canvas: HTMLCanvasElement;
    private canvasDiv: HTMLDivElement;
    private ctx?: CanvasRenderingContext2D | null;
    private ws: WebSocket;

    private isMouseDown: boolean = false;
    private x: number = 0;
    private y: number = 0;

    private paths: Coordinates[][] = [];
    private currentPath: Coordinates[] = [];

    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvasDiv = document.querySelector('#canvas') as HTMLDivElement;

        this.canvasDiv.appendChild(this.canvas);
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        if (!this.canvas.getContext) {
            alert('Canvas API unavailable, drawing will not work!');
        } else {
            this.ctx = this.canvas.getContext('2d');
        }

        // Events
        if (this.ctx) {
            this.canvas.addEventListener('mousedown', e => this.onMouseDown(e));
            this.canvas.addEventListener('mouseup', () => this.onMouseUp());
            this.canvas.addEventListener('mousemove', e => this.onMouseMove(e));

            this.canvas.addEventListener('touchstart', e => this.onMouseDown(e.touches[0]));
            this.canvas.addEventListener('touchend', () => this.onMouseUp());
            this.canvas.addEventListener('touchmove', e => this.onMouseMove(e.touches[0]));
        }

        this.ws = new WebSocket('ws://localhost:8081', 'json');
        this.ws.onopen = () => this.ws.send('SENDER');
    }

    onMouseDown(event: MouseEvent | Touch) {
        this.isMouseDown = true;
        this.x = event.clientX;
        this.y = event.clientY;
        this.currentPath = [new Coordinates(this.x, this.y)];
        this.startDrawing();
    }

    onMouseUp() {
        this.isMouseDown = false;
        this.paths.push(this.currentPath);
        // this.sendPath();
        this.stopDrawing()
    }

    onMouseMove(event: MouseEvent | Touch) {
        if (!this.isMouseDown) {
            return;
        }

        this.ctx!.beginPath();
        this.ctx!.moveTo(this.x, this.y);
        this.ctx!.lineTo(event.clientX, event.clientY);
        this.ctx!.lineWidth = 1;
        this.ctx!.stroke();

        const coordinates = new Coordinates(event.clientX, event.clientY);

        this.currentPath.push(coordinates);
        this.sendCoordindates(coordinates);

        this.x = event.clientX;
        this.y = event.clientY;
    }

    startDrawing() {
        this.ws.send('START');
        this.ws.send(JSON.stringify(new Coordinates(this.x, this.y)));
    }

    sendCoordindates(coordinates: Coordinates) {
        this.ws.send(JSON.stringify(coordinates));
    }

    stopDrawing() {
        this.ws.send('STOP');
    }

    sendPath() {
        this.ws.send(JSON.stringify(this.currentPath));
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
