export class LoadGameWindow {
    constructor(game) {
        this.game = game;
        this.window = document.getElementById("load-game-window")
        this.backButton = document.getElementById("load-game-back-button")
        this.backButton.onclick = () => {
            this.hide()
            this.game.newGameWindow.show()
        }
        this.gameContainer = document.getElementById("load-game-container")
    }
    show() {
        this.window.style.display = ""
    }
    hide() {
        this.window.style.display = "none"
    }
    add(gameName, gameLevel) {
        let loadGameItem = document.createElement("button")
        loadGameItem.classList.add("button")
        loadGameItem.classList.add("load-game-item")
        let name = document.createElement("div")
        name.classList.add("load-game-item-name")
        name.innerText = gameName
        loadGameItem.append(name)
        let level = document.createElement("div")
        level.classList.add("load-game-item-level")
        level.innerText = "Level " + gameLevel
        loadGameItem.append(level)
        this.gameContainer.append(loadGameItem)
    }
}