<script>
  import { onMount } from 'svelte';
  import {plexToken, plexUser, plexLibraries, currentPage, currentLibrary} from './../stores.js';
  import Movie from './../Movie.svelte';
  const Plex = document.plex; // only for console access

  export let library_id = null;

  let movies = [];
  let totalSize = null;


  async function loadMovies() {
    let results = await Plex.Movie.all(library_id);
    console.log(results)
    totalSize = results.size;
    return results.Metadata;
  }

  onMount(async () => {
    movies = [... await loadMovies()];
  })
</script>


<div class='row'>
  <p>{totalSize}</p>
  <div class='col-12 movie-page'>
    {#each movies as movie}
      <Movie movie={movie}/>
    {/each}
  </div>
</div>



<style type="text/css">
  .movie-page {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
  }
</style>