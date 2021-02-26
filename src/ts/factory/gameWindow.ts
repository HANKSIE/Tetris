import GameWindow from "../game/gameWindow";
import { Types } from "../game/concrete/gameWindow";

export default class GameWindowFactory {

    public static create(type : string, ...args: any) : GameWindow{
        //輸入的類別名稱為store紀錄的屬性時生成對應的Tetris
        const gameWindow = new (<any>Types)[type](...args);
        return gameWindow;
    }

}