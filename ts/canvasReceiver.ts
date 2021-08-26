import CanvasUtil from './canvas-util/canvasUtil.js';
import Coordinates from './canvas-util/coordinates.js';

class CanvasReceiverController {
    private canvas!: HTMLCanvasElement;
    private canvasDiv: HTMLDivElement;
    private canvasUtil: CanvasUtil;
    private ws: WebSocket;

    /**
     * Represents whether the app is waiting for the first coordinates of a draw path. If lineTo
     * is called with the first pair of coordinates, every path will be connected. Therefore this
     * variable is needed to prevent drawing a line to the first pair of coordinates.
     */
     private firstCoordinates: boolean = false;

    constructor() {
        this.canvasDiv = document.querySelector('#canvas') as HTMLDivElement;
        this.canvasUtil = new CanvasUtil(this.canvasDiv.offsetWidth, this.canvasDiv.offsetHeight);

        this.createCanvas();
        if (!this.canvasUtil.isCanvasApiSupported) {
            alert('Canvas API unavailable, drawing will not work!');
        }

        this.ws = new WebSocket('ws://localhost:8081', 'json');

        this.ws.onmessage = message => this.processMessage(message);
        this.ws.onopen = () => this.ws.send('RECEIVER');
    }

    createCanvas() {
        const canvas = this.canvasUtil.getCanvas();
        this.canvasDiv.appendChild(canvas);
    }

    processMessage(message: MessageEvent<any>) {
        switch (message.data) {
            case 'CLEAR':
                this.clear();
                break;
            case 'START':
                this.startDrawing();
                break;
            case 'STOP':
                this.stopDrawing();
                break;
            default:
                this.draw(JSON.parse(message.data));
                break;
        }
    }

    startDrawing() {
        console.log('Received START command');
        this.firstCoordinates = true;
    }

    stopDrawing() {
        console.log('Received STOP command');
        this.canvasUtil.stopPath();
    }

    clear() {
        console.log('Received CLEAR command');
        this.canvasDiv.removeChild(this.canvasDiv.firstChild!);
        this.canvasUtil.recreateCanvas();
        this.createCanvas();
    }

    draw(coordinates: Coordinates) {
        if (this.firstCoordinates) {
            this.firstCoordinates = false;
            this.canvasUtil.startPath(coordinates);
        }

        this.canvasUtil.draw(coordinates);
    }
}


const app = new CanvasReceiverController();

export { app };
