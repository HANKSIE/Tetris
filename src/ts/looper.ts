export default class Looper {

    private _timerID : number = 0;
    private _ms : number;

    public get ms() {
        return this._ms;
    }

    public set ms(val : number) {
        this._ms = val;
        this.destroy();
        this.start();
    }

    private updateHandle : Function;

    constructor(updateHandle : Function, ms : number) {
        this._ms = ms;
        this.updateHandle = updateHandle;
    }

    public start() {
        this._timerID = setInterval(this.updateHandle, this._ms);
    }

    public stop() {
        this.destroy();
    }

    private destroy() {
        clearInterval(this._timerID);
    }

}