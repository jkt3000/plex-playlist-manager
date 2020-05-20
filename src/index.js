import "core-js/stable";
import "regenerator-runtime/runtime";
import 'bootstrap';
import App from "./App.svelte";
import {Plex} from './plex-api.js';

document.plex = Plex;
document.plex.init();
console.log("[index.js] Attaching Plex library to document");


const app = new App({
  target: document.body
});

export default app;