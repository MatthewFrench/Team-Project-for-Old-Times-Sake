export class AboutWindow {
    constructor(game) {
        this.game = game;
        this.viewName = "About Window";
        this.window = document.getElementById("about-window")
        this.backButton = document.getElementById("about-back-button")
        this.backButton.onclick = () => {
            this.hide()
            this.game.newGameWindow.show()
        }
    }
    show() {
        this.window.style.display = ""
        this.game.addView(this.viewName);
    }
    hide() {
        this.window.style.display = "none"
        this.game.removeView(this.viewName);
    }
}