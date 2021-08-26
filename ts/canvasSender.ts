import CanvasUtil from "./canvas-util/canvasUtil.js";
import Coordinates from "./canvas-util/coordinates.js";

class CanvasSenderController {
    private canvasUtil: CanvasUtil;
    private canvasDiv: HTMLDivElement;
    private ws: WebSocket;

    private isMouseDown: boolean = false;

    constructor() {
        this.canvasDiv = document.querySelector('#canvas') as HTMLDivElement;
        this.canvasUtil = new CanvasUtil(this.canvasDiv.offsetWidth, this.canvasDiv.offsetHeight);

        const canvas = this.canvasUtil.getCanvas();
        this.canvasDiv.appendChild(canvas);

        if (!this.canvasUtil.isCanvasApiSupported) {
            alert('Canvas API unavailable, drawing will not work!');
        } else {
            // Events
            canvas.addEventListener('mousedown', e => this.onMouseDown(e));
            canvas.addEventListener('mouseup', () => this.onMouseUp());
            canvas.addEventListener('mousemove', e => this.onMouseMove(e));

            canvas.addEventListener('touchstart', e => this.onMouseDown(e.touches[0]));
            canvas.addEventListener('touchend', () => this.onMouseUp());
            canvas.addEventListener('touchmove', e => this.onMouseMove(e.touches[0]));
        }

        this.ws = new WebSocket('ws://localhost:8081', 'json');
        this.ws.onopen = () => this.ws.send('SENDER');
    }

    onMouseDown(event: MouseEvent | Touch) {
        this.isMouseDown = true;

        const coordinates = new Coordinates(event.clientX, event.clientY);
        this.canvasUtil.startPath(coordinates);

        this.ws.send('START');
        this.ws.send(JSON.stringify(coordinates));
    }

    onMouseUp() {
        this.isMouseDown = false;
        this.canvasUtil.stopPath();
        this.ws.send('STOP');
    }

    onMouseMove(event: MouseEvent | Touch) {
        if (!this.isMouseDown) {
            return;
        }

        const coordinates = new Coordinates(event.clientX, event.clientY);
        this.canvasUtil.draw(coordinates);
        this.ws.send(JSON.stringify(coordinates));
    }
}


const app = new CanvasSenderController();

export { app };
