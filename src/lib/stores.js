import { writable } from 'svelte/store';

export const plexUser       = writable(null);
export const plexToken      = writable(null);
export const plexLibraries  = writable([]);
export const currLibrary    = writable(null);