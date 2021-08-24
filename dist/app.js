class CanvasController {
    constructor() {
        this.isMouseDown = false;
        this.x = 0;
        this.y = 0;
        this.canvas = document.createElement("canvas");
        this.canvasDiv = document.querySelector("#canvas");
        this.canvasDiv.appendChild(this.canvas);
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.ctx = this.canvas.getContext("2d");
        // Events
        this.canvasDiv.addEventListener("mousedown", e => this.onMouseDown(e));
        this.canvasDiv.addEventListener("mouseup", () => this.onMouseUp());
        this.canvasDiv.addEventListener("mousemove", e => this.onMouseMove(e));
    }
    onMouseDown(event) {
        this.isMouseDown = true;
        this.x = event.clientX;
        this.y = event.clientY;
    }
    onMouseUp() {
        this.isMouseDown = false;
    }
    onMouseMove(event) {
        if (!this.isMouseDown || !this.ctx) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(event.clientX, event.clientY);
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.x = event.clientX;
        this.y = event.clientY;
    }
}
const app = new CanvasController();
export { app };
