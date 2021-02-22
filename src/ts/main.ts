import Scene from "./widgets/scene";
import { ITetris, JTetris, LTetris, OTetris, STetris, TTetris, ZTetris } from "./widgets/tetrises/index";

const canvas = document.querySelector("#scene") as HTMLCanvasElement;
const scene : Scene = new Scene(canvas, "2d", {row: 25, column: 15, unit: 20});
scene.initialize();

const I = new ITetris("purple");
console.log(I.shape);
const J = new JTetris("purple");
console.log(J.shape);
const L = new LTetris("purple");
console.log(L.shape);
const O = new OTetris("purple");
console.log(O.shape);
const S = new STetris("purple");
console.log(S.shape);
const T = new TTetris("purple");
console.log(T.shape);
const Z = new ZTetris("purple");
console.log(Z.shape);
