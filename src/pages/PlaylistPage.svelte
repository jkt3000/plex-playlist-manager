<script>
  import { onMount } from 'svelte';
  import {plexToken, plexUser, plexLibraries, currLibId} from './../stores.js';
  import Movie from './../Movie.svelte';
  const Plex = document.plex; // only for console access

  export let library = null;
  $: promise = loadMovies(library);
  
  async function loadMovies(lib) {
    let id = lib.key;
    if (id != null) {
      let results = await Plex.Movie.all(id);

    console.log("[loadMovies] for", id, results.size);
      return results.Metadata;      
    } else {
      return [];
    }
  }
</script>


<h3>Playlists {library ? library.title : ''}</h3>

  {#await promise}
    <p>Loading movies...</p>
  {:then movies}
    <p>got movies...</p>
    {#if movies != null}

      {#each movies as movie}
        <p>movie</p>
        <Movie movie={movie}/>
      {/each}
    {/if}
    <p>Error loading...</p>
  {:catch error}
    <p>ERROR!</p>
  {/await}
