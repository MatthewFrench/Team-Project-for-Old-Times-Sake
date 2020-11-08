export class AboutWindow {
    constructor(game) {
        this.game = game;
        this.window = document.getElementById("about-window")
        this.backButton = document.getElementById("about-back-button")
        this.backButton.onclick = () => {
            this.hide()
            this.game.newGameWindow.show()
        }
    }
    show() {
        this.window.style.display = ""
    }
    hide() {
        this.window.style.display = "none"
    }
}