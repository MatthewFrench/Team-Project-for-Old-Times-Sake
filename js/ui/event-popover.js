export class EventPopover {
    constructor(game) {
        this.game = game
        this.viewName = "Event Popover";
        this.popover = document.getElementById("event-popover-background-cover")
        this.closeButton = document.getElementById("event-close-button")
        this.closeButton.onclick = () => {
            this.hide()
        }
        this.titleDiv = document.getElementById("event-title")
        this.textDiv = document.getElementById("event-text")
    }
    set(title, text, buttonText, onClick) {
        this.titleDiv.innerText = title;
        this.textDiv.innerText = text;
        this.closeButton.innerText = buttonText;
        this.closeButton.onclick = onClick;
    }
    show() {
        this.popover.style.display = "";
        this.closeButton.focus();
        this.game.addView(this.viewName);
    }
    hide() {
        this.popover.style.display = "none"
        this.game.removeView(this.viewName);
    }
}