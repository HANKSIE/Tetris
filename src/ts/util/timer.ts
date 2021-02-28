export default class Timer {

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

    private _handle : CallableFunction;

    constructor(handle : CallableFunction, ms : number) {
        this._ms = ms;
        this._handle = handle;
    }

    public start() {
        if(!this._timerID){
            this._timerID = setInterval(this._handle, this._ms);
        }
    }

    public stop() {
        if(this._timerID){
            clearInterval(this._timerID);
            this._timerID = null;
        }
    }

}