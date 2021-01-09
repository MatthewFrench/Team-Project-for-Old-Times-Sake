export class EventTracker {
    constructor() {
        this.down = false;
        this.up = false;
        this.right = false;
        this.left = false;
        window.addEventListener("keydown", (event) => this.handleKeydown(event), true);
        window.addEventListener("keyup", (event) => this.handleKeyup(event), true);
    }

    handleKeydown(event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        switch (event.key) {
            case "Down": // IE/Edge specific value
            case "ArrowDown":
                // Do something for "down arrow" key press.
                this.down = true;
                break;
            case "Up": // IE/Edge specific value
            case "ArrowUp":
                // Do something for "up arrow" key press.
                this.up = true;
                break;
            case "Left": // IE/Edge specific value
            case "ArrowLeft":
                // Do something for "left arrow" key press.
                this.left = true;
                break;
            case "Right": // IE/Edge specific value
            case "ArrowRight":
                // Do something for "right arrow" key press.
                this.right = true;
                break;
            case "Enter":
                // Do something for "enter" or "return" key press.
                break;
            case "Esc": // IE/Edge specific value
            case "Escape":
                // Do something for "esc" key press.
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }

    handleKeyup(event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        switch (event.key) {
            case "Down": // IE/Edge specific value
            case "ArrowDown":
                // Do something for "down arrow" key press.
                this.down = false;
                break;
            case "Up": // IE/Edge specific value
            case "ArrowUp":
                // Do something for "up arrow" key press.
                this.up = false;
                break;
            case "Left": // IE/Edge specific value
            case "ArrowLeft":
                // Do something for "left arrow" key press.
                this.left = false;
                break;
            case "Right": // IE/Edge specific value
            case "ArrowRight":
                // Do something for "right arrow" key press.
                this.right = false;
                break;
            case "Enter":
                // Do something for "enter" or "return" key press.
                break;
            case "Esc": // IE/Edge specific value
            case "Escape":
                // Do something for "esc" key press.
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }
}