<script>
  import InfiniteScroll from "/partials/InfiniteScroll.svelte";
  import {plexUser, libraryFilters, showSpinner} from '/lib/stores.js';
  import Movie from '/partials/Movie.svelte';
  import LibraryFilterBar from '/partials/LibraryFilterBar.svelte';

  export let library;

  const Plex     = document.plex; // only for console access
  let newBatch   = [];
  let page       = 1;
  let page_size  = 100;
  $: totalSize   = 0;
  $: medias      = [];
  $: mediaInfo   = null;

  $: if (library != null) {
    $libraryFilters = { sort: 'titleSort' };
  }
  $: if ($libraryFilters) {
    loadMedia();
  }

  async function loadMedia() {
    $showSpinner = true;
    page = 1;
    let options = {
      page: page, 
      page_size: page_size, 
      sort: $libraryFilters.sort, 
      filters: $libraryFilters.filters
    };
    let resp = await Plex.Movie.all(library.key, options);
    newBatch = resp.Metadata;
    totalSize = resp.totalSize;
    medias = [...newBatch];
    $showSpinner = false;
  };

  async function nextPage() {
    $showSpinner = true;
    page++;
    let options = {
      page: page, 
      page_size: page_size, 
      sort: $libraryFilters.sort, 
      filters: $libraryFilters.filters
    };
    let resp = await Plex.Movie.all(library.key, options);
    newBatch = resp.Metadata;
    medias = [...medias, ...newBatch];
    $showSpinner = false;
  };
</script>

<LibraryFilterBar size={totalSize}/>
<div class='panel-body' id='medias-list'>
  {#each medias as media}
    <Movie movie={media} />
  {/each}
  <InfiniteScroll 
    threshold={1000}
    hasMore={newBatch.length == page_size} 
    on:loadMore={nextPage} 
    scrollTop={`${library.key}${$libraryFilters.sort}`}/>
</div>


<style lang='scss'>
  .panel-body {
    z-index: 2000;
    width: 100%;
    height: calc(100vh - 105px);
    padding: 1.5em;
    margin-right: 0;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>