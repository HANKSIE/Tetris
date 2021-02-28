
export default class ArrayHelper {

    static create2D<T>(row: number, col?: number, fill? :T) : T[][] {
        const arr: T[][] = [];

        for(let r = 0; r < row; r++){
            arr.push([]);

            if(col){
                if(fill){
                    arr[r] = new Array(col).fill(fill);
                }
            }
        }

        return arr;
    }

}