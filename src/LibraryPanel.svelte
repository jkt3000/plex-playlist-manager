<script context='module'>

</script>
<script>
  import {createEventDispatcher} from 'svelte';
  import InfiniteScroll from "/partials/InfiniteScroll.svelte";
  import {plexUser, libraryFilters, showSpinner} from '/lib/stores.js';
  import Movie from '/partials/Movie.svelte';

  export let library;

  const Plex     = document.plex; // only for console access
  const dispatch = createEventDispatcher();
  let newBatch   = [];
  let page       = 1;
  let page_size  = 100;
  $: totalSize   = 0;
  $: medias      = [];
  $: mediaInfo   = null;
  let sortFilter = { sort: 'titleSort', desc: false};

  const sortMap = {
    'titleSort': "Title",
    'year': "Year",
    'originallyAvailableAt': "Release Date",
    'duration': "Duration",
    'rating': "Rating",
    'addedAt': "Date Added",
    'lastViewedAt': "Last Viewed"
  };



  $: if (library != null) {
    $libraryFilters = { sort: 'titleSort' };
  }
  $: if ($libraryFilters) {
    console.log("Librayr filters changed", $libraryFilters);
    loadMedia();
  }

  async function loadMedia() {
    $showSpinner = true;
    page = 1;
    let options = {page: page, page_size: page_size, sort: $libraryFilters.sort};
    let resp = await Plex.Movie.all(library.key, options);
    newBatch = resp.Metadata;
    totalSize = resp.totalSize;
    medias = [...newBatch];
    $showSpinner = false;
  };

  async function nextPage() {
    $showSpinner = true;
    page++;
    let options = {page: page, page_size: page_size, sort: $libraryFilters.sort};
    let resp = await Plex.Movie.all(library.key, options);
    newBatch = resp.Metadata;
    medias = [...medias, ...newBatch];
    $showSpinner = false;
  };

  function toggleSidePanel() {
    dispatch("toggleSidePanel");
  };

  async function filterValues(type) {
    let resp = await Plex.Library.filterValues(library.key, type);
    // resp.title2 => 'by Decade'
    // resp.Directory => [{fastKey:, key:, title: }]
    console.log(resp);
  };

  function setSort(key) {
    if (sortKey($libraryFilters.sort) == key) {
      $libraryFilters.sort = (sortDesc($libraryFilters.sort)) ? key : `${key}:desc`;
    } else {
      $libraryFilters.sort = (key == 'titleSort') ? key : `${key}:desc`;
    }
    $libraryFilters = {...$libraryFilters};
  }

  function sortLabel(sort) {
    let [key,desc]= sort.split(":");
    return sortMap[key];
  };

  function sortKey(sort) {
    return sort.split(":")[0];
  }
  function sortDesc(sort) {
    return (sort.split(":")[1] == 'desc');
  }

</script>

<nav class="navbar navbar-expand panel-header">
  <ul class="navbar-nav mr-auto">
    <li>
      <div class='btn-group'>
        <span class='btn btn-sm btn-success'>{totalSize}</span>
      </div>
    </li>
    <li class="nav-item">
      <div class="btn-group">
        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          All
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#">Year</a>
          <a class="dropdown-item" href="#" on:click={() => filterValues('decade')}>Decade</a>
          <a class="dropdown-item" href="#">Genre</a>
          <a class="dropdown-item" href="#">Actor</a>
          <a class="dropdown-item" href="#">Director</a>
          <a class="dropdown-item" href="#">Content Rating</a>
        </div>
      </div>
    </li>
    <li class="nav-item">
      <div class="btn-group">
        <button class="btn btn-secondary btn-sm" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          By {sortLabel($libraryFilters.sort)}
          {#if sortDesc($libraryFilters.sort)}
            <i class="fas fa-angle-down"></i>
          {:else}
            <i class="fas fa-angle-up"></i>
          {/if}
        </button>
        <div class="dropdown-menu">
          {#each Object.keys(sortMap) as key}
            <a class="dropdown-item" href="#" on:click={() => setSort(key) }>
              {sortMap[key]}
            </a>
          {/each}
        </div>
      </div>
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
    scrollTop={`${library.key}${$libraryFilters.sort}`}/>
</div>


<style lang='scss'>
  .panel-header {
    background: #111;
    height: 50px;
    max-height:50px !important;
    .btn-group {
      margin-top:  5px;
      margin-right:  5px;
    }
  }

  .panel-body {
    z-index: 2000;
    width: 100%;
    height: 100%;
    padding: 1.5em;
    margin-right: 0;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>