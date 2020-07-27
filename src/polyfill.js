CanvasRenderingContext2D.prototype.fillAndStroke = (() => {
    // Shared offscreen canvas
    const offscreenCanvas = new OffscreenCanvas(0, 0);
    const context = offscreenCanvas.getContext("2d");

    return function fillAndStroke (path) {
        offscreenCanvas.width = this.canvas.width;
        offscreenCanvas.height = this.canvas.height;

        // Copy non interferable properties
        // (This should include all CanvasRenderingContext2DSettings apart from globalAlpha and all shadow properties)
        ["fillStyle", "strokeStyle", "lineWidth"]
            .forEach((propName) => {
                context[propName] = this[propName];
            });

        // Copy transform
        context.setTransform(this.getTransform());

        // Do fill and stroke
        context.fill(path);
        context.stroke(path);

        // Save state and reset it
        this.save();
        this.resetTransform();

        // Draw result as bitmap
        this.drawImage(offscreenCanvas, 0, 0);

        // Restore state as it was
        this.restore();
    };
})();
