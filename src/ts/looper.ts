export default class Looper {

    private _timerID : number | null = null;
    private _ms : number;

    public get ms() {
        return this._ms;
    }

    public set ms(val : number) {
        this._ms = val;
        this.stop();
        this.start();
    }

    private updateHandle : Function;

    constructor(updateHandle : Function, ms : number) {
        this._ms = ms;
        this.updateHandle = updateHandle;
    }

    public start() {
        if(!this._timerID){
            this._timerID = setInterval(this.updateHandle, this._ms);
        }
    }

    public stop() {
        if(this._timerID){
            clearInterval(this._timerID);
            this._timerID = null;
        }
    }

}