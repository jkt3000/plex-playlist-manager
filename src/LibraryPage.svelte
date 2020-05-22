<script>
  import { onMount } from 'svelte';
  import InfiniteScroll from "/partials/InfiniteScroll.svelte";

  import {plexToken, plexUser, plexLibraries, currLibId} from '/lib/stores.js';
  import Movie from '/partials/Movie.svelte';
  import Playlist from '/partials/Playlist.svelte';
  const Plex = document.plex; // only for console access

  export let library = null;
  let movies    = [];
  let newBatch  = [];
  let page      = 1;
  let page_size = 200;
  let showSpinner = false;

  async function loadMovies() {
    showSpinner = true;
    if (library != null) {
      let key = library.key;
      let resp = await Plex.Movie.all(key, {page: page, page_size: page_size});
      console.log("resp for page", page, resp.size)
      newBatch = resp.Metadata;
      showSpinner = false;
    }
  };

  let promise;

  $: movies = [ ...movies, ...newBatch];
  $: {
    let el;
    if (library) {     
      movies = [];
      page = 1;
      console.log("library changed");
      el = document.getElementById('workpanel');
      if (el) {
        el.scrollTop = 0;
      }
      promise = loadMovies();
    }
  }

</script>

  {#if library}
  <nav class="navbar navbar-expand fixed-top panelnav">
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
    <ul class="navbar-nav">
      {#if showSpinner}
        <li>
          <i class='fas fa-spinner fa-spin'></i>
        </li>
      {/if}
    </ul>
  </nav>
  {/if}

  <div class='workarea'>
    {#await promise}
    {:then results }
      {#each movies as movie}
        <Movie movie={movie} />
      {/each}
    {:catch error}
      <p class='alert alert-danger'>{error.message}</p>
    {/await}
  </div>
  <InfiniteScroll
    hasMore={newBatch.length == page_size}
    threshold={500}
    scrollpos={library ? 0 : 1}
    on:loadMore={() => {page++; loadMovies()}} />

<style lang='scss'>

.panelnav {
  top:  55px;
  background: black;
  height: 50px;
  max-height:50px;
  width: inherit;
}

.workarea {
  xborder:  1px solid green;
  padding:  1.5em 2em;

}

</style>