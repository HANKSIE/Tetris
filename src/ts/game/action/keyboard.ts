import GameContext from "../context";

export default interface KeyboardAction {
    (event: KeyboardEvent, context: GameContext): void;
}