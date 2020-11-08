export class NewGameWindow {
    constructor(game) {
        this.game = game;
        this.window = document.getElementById("new-game-window")
        this.newGameButton = document.getElementById("new-game-button")
        this.newGameButton.onclick = () => {
            this.hide()

            this.game.eventPopover.set("Intro",
                "The town of Oof has been mysteriously overgrown with plant life. The plant life is blocking all routes out of the town.",
                "Next",
                () => {
                    this.game.eventPopover.set("Intro Continued",
                        "The town tried to clear the plants but they would only regrow the next day.",
                        "Next",
                        () => {
                            this.game.eventPopover.set("Intro Final",
                                "The town is sick of yard work so they are sending you on the adventure of freeing the town. They have cleared and used weed killer on one area to the East.\n\nBe careful, the overgrowth appears to be affecting the wildlife as well!",
                                "Let's Go!",
                                () => {
                                    this.game.eventPopover.hide()
                                })
                        })
                })
            this.game.characterCreatorWindow.show()
            this.game.eventPopover.show()
        }
        this.loadGameButton = document.getElementById("load-game-button")
        this.loadGameButton.onclick = () => {
            this.hide()
            this.game.loadWindow.add("Eek", 1)
            this.game.loadWindow.add("Bob", 5)
            this.game.loadWindow.add("Ash Ketchum", 10)
            this.game.loadWindow.add("Gary", 3)
            this.game.loadWindow.add("I am awesome", 11)
            this.game.loadWindow.add("He who shall not be named", 8)
            this.game.loadWindow.show()
        }
        this.aboutButton = document.getElementById("about-game-button")
        this.aboutButton.onclick = () => {
            this.hide()
            this.game.aboutWindow.show()
        }
    }
    show() {
        this.window.style.display = ""
    }
    hide() {
        this.window.style.display = "none"
    }
}