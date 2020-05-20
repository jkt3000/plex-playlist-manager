import { writable } from 'svelte/store';

export const plexUser       = writable(null);
export const plexToken      = writable(null);
export const plexLibraries  = writable([]);
export const currentPage    = writable('index');
export const currentLibrary = writable(1);
export const current        = writable({page: 'index', library: null});