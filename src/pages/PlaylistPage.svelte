<script>
  import { onMount } from 'svelte';
  import {plexToken, plexUser, plexLibraries, currLibId} from './../stores.js';
  import Movie from './../Movie.svelte';
  import Playlist from './../Playlist.svelte';
  const Plex = document.plex; // only for console access

  export let library = null;
  $: promise = loadMovies(library);
  $: playlist_promise = loadPlaylists(library);

  async function loadMovies(lib) {
    if (lib == null) { return [] };
    let results = await Plex.Movie.all(lib.key);
    console.log("[PlaylistPage] loadMovies()", results);
    return results.Metadata || [];
  };

  async function loadPlaylists(library) {
    let results = await Plex.Playlist.all();
    console.log("[PlaylistPage] loadPlaylists", results);
    return results.Metadata || [];
  };
</script>


<div class='panel-right col-3 no-gutters'>
  <nav class="navbar navbar-expand sticky-top filterbar-right">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" href="#">Playlists</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Sort by</a>
      </li>
      <li class='nav-item '>
        <a class="nav-link" href="#"><i class='fas fa-plus-circle'></i></a>
      </li>
    </ul>
  </nav>
  <div class='workarea-right'>
    {#await playlist_promise}
      <div class='p-2 m-2 text-center'>
        <h2>Loading... <i class="fas fa-spinner fa-spin"></i></h2>
      </div>
    {:then playlists}
        {#each playlists as playlist}
          <Playlist playlist={playlist}/>
        {/each}
    {:catch error}
      <div class='alert alert-warning p-2 m-2'>
        <p><i class='fas fa-exclamation-triangle'></i> Error: {error}</p>
      </div>
    {/await}

  </div>
</div>

<div class='panel-left col-9 no-gutters'>
  {#if library}
  <nav class="navbar navbar-expand sticky-top" id='filter-bar'>
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" href="#"><span class='badge badge-pill badge-primary'>{library.totalSize}</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Filters</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Sort Order</a>
      </li>
    </ul>
  </nav>
  {/if}

  <div class='workarea'>
    {#await promise}
      <div class='p-2 m-2 text-center'>
        <h2>Loading... <i class="fas fa-spinner fa-spin"></i></h2>
      </div>
    {:then movies}
      {#each movies as movie}
        <Movie movie={movie}/>
      {/each}
    {:catch error}
      <div class='alert alert-warning p-2 m-2'>
        <p><i class='fas fa-exclamation-triangle'></i> Error: {error}</p>
      </div>
    {/await}
  </div>
</div>



