import { writable, derived } from 'svelte/store';

export const showSpinner    = writable(false);
export const plexUser       = writable(null);
export const plexToken      = writable(null);
export const plexLibraries  = writable([]);
export const plexPlaylists  = writable([]);
export const currLibrary    = writable(null);
export const currPlaylist   = writable(null);
export const libraryFilters = writable({});
