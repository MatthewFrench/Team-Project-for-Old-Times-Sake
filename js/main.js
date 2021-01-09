import {Game} from "./Game.js";
import {LoadWorld} from "./utility/WorldLoader.js";

let game;
function main() {
    LoadWorld().then((world) => {
        game = new Game(world);
        game.newGameWindow.show();
    });
}

window.addEventListener("load", main);