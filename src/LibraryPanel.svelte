<script context='module'>

</script>
<script>
  import {createEventDispatcher} from 'svelte';
  import {plexUser} from '/lib/stores.js';
  import InfiniteScroll from "/partials/InfiniteScroll.svelte";
  import Movie from '/partials/Movie.svelte';

  export let library;
  export let showSide;

  const Plex      = document.plex; // only for console access
  const dispatch  = createEventDispatcher();
  let newBatch    = [];
  let showSpinner = false;
  let page        = 1;
  let page_size   = 100;
  $: medias       = [];
  $: mediaInfo    = null;

  $: if (library != null) {
    loadMedia();
  }

  async function loadMedia() {
    showSpinner = true;
    page = 1;
    let resp = await Plex.Movie.all(library.key, {page: page, page_size: page_size});
    newBatch = resp.Metadata;
    medias = [...newBatch];
    showSpinner = false;
  };

  async function nextPage(){
    showSpinner = true;
    page++;
    let resp = await Plex.Movie.all(library.key, {page: page, page_size: page_size});
    newBatch = resp.Metadata;
    medias = [...medias, ...newBatch];
    showSpinner = false;
  };

  function toggleSidePanel() {
    dispatch("toggleSidePanel");
  };
</script>

<nav class="navbar navbar-expand fixed-top panel-header">
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
        <a class='nav-link'>
          <i class='fas fa-spinner fa-spin'></i>
        </a>
      </li>
    {/if}
    <li class='nav-item'>
      <a class='nav-link' href='#'  on:click={toggleSidePanel}>
        <i class="fas fa-chevron-double-{showSide ? 'right' : 'left'}"></i>
      </a>
    </li>
  </ul>
</nav>

<div class='panel-body' id='medias-list'>
  {#each medias as media}
    <Movie movie={media} />
  {/each}
  <InfiniteScroll 
    threshold={1000} 
    hasMore={newBatch.length == page_size} 
    on:loadMore={nextPage} 
    scrollpos={library.key}/>
</div>


<style lang='scss'>
  .panel-header {
    position: fixed;
    top:  55px;
    background: black;
    height: 50px;
    max-height:50px !important;
    width: inherit;
  }

  .panel-body {
    z-index:  100;
    xborder:  1px solid orange;
    width: 100%;
    height: 100%;
    padding: 1.5em 2em;
    transition: all 0.4s;
    margin-right: 0;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>