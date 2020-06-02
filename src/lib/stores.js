import { writable, derived } from 'svelte/store';

export const plexUser       = writable(null);
export const plexToken      = writable(null);
export const plexLibraries  = writable([]);
export const currLibrary    = writable(null);

export const sortBy     = writable('titleSort');
export const sortDesc   = writable(false);
export const sortFilter = derived(
  [sortBy, sortDesc],
  ([$sortBy, $sortDesc]) => {
    return ($sortDesc === true) ? `${$sortBy}:desc` : $sortBy;
  }
);
