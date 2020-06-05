<script context='module'>

</script>
<script>
  import {createEventDispatcher} from 'svelte';
  import InfiniteScroll from "/partials/InfiniteScroll.svelte";
  import {plexUser, sortBy, sortDesc, sortFilter} from '/lib/stores.js';
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
    if ($sortFilter) {
      loadMedia();
    }
  }

  async function loadMedia() {
    showSpinner = true;
    page = 1;
    let options = {page: page, page_size: page_size, sort: $sortFilter};
    let resp = await Plex.Movie.all(library.key, options);
    newBatch = resp.Metadata;
    medias = [...newBatch];
    showSpinner = false;
  };

  async function nextPage() {
    showSpinner = true;
    page++;
    let options = {page: page, page_size: page_size, sort: $sortFilter};
    let resp = await Plex.Movie.all(library.key, options);
    newBatch = resp.Metadata;
    medias = [...medias, ...newBatch];
    showSpinner = false;
  };

  function toggleSidePanel() {
    dispatch("toggleSidePanel");
  };

  function setSort(key) {
    switch (key) {
      case 'title':
        $sortDesc = ($sortBy === 'titleSort') ? !$sortDesc : false;
        $sortBy   = 'titleSort';
        break;
      case 'year':
        $sortDesc = ($sortBy === 'year') ? !$sortDesc : true;
        $sortBy   = 'year';
        break;
      case 'releasedAt':
        $sortDesc = ($sortBy === 'originallyAvailableAt') ? !$sortDesc : true;
        $sortBy   = 'originallyAvailableAt';
        break;
      case 'duration':
        $sortDesc = ($sortBy === 'duration') ? !$sortDesc : true;
        $sortBy   = 'duration';
        break;
      case 'rating':
        $sortDesc = ($sortBy === 'rating') ? !$sortDesc : true;
        $sortBy   = 'rating';
        break;
      case 'addedAt':
        $sortDesc = ($sortBy === 'addedAt') ? !$sortDesc : true;
        $sortBy   = 'addedAt';
        break;
      case 'viewedAt':
        $sortDesc = ($sortBy === 'lastViewedAt') ? !$sortDesc : true;
        $sortBy   = 'lastViewedAt';
        break;
      default:
        $sortDesc = ($sortBy === 'titleSort') ? !$sortDesc : false;
        $sortBy   = 'titleSort';
        break;
    }
  }

  function sortLabel(key) {
    const label = {
      'titleSort': "By Title",
      'year': "By Year",
      'originallyAvailableAt': "By Release Date",
      'duration': "By Duration",
      'rating': "By Rating",
      'addedAt': "By Date Added",
      'lastViewedAt': "By Last Viewed"
    };
    return label[key];
  };

</script>

<nav class="navbar navbar-expand fixed-top panel-header">
  <ul class="navbar-nav mr-auto">
    <li class="nav-item">
      <a class="nav-link" href="#"><span class='badge badge-pill badge-primary'>{library.totalSize}</span></a>
    </li>
    <li class="nav-item">
      <div class="btn-group">
        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          All
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#">Year</a>
          <a class="dropdown-item" href="#">Decade</a>
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
          {sortLabel($sortBy)} <i class="fas fa-angle-{$sortDesc ? 'down' : 'up'}"></i> &nbsp;
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#" on:click={() => setSort('title') }>Title</a>
          <a class="dropdown-item" href="#" on:click={() => setSort('year') }>Year</a>
          <a class="dropdown-item" href="#" on:click={() => setSort('releasedAt') }>Release Date</a>
          <a class="dropdown-item" href="#" on:click={() => setSort('rating') }>Rating</a>
          <a class="dropdown-item" href="#" on:click={() => setSort('duration') }>Duration</a>
          <a class="dropdown-item" href="#" on:click={() => setSort('addedAt') }>Date Added</a>
          <a class="dropdown-item" href="#" on:click={() => setSort('viewedAt') }>Date Viewed</a>
        </div>
      </div>
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
    scrollpos={`${library.key}${$sortFilter}`}/>
</div>


<style lang='scss'>
  .panel-header {
    position: fixed;
    top:  55px;
    background: black;
    height: 50px;
    max-height:50px !important;
    width: inherit;

    .btn-group {
      margin-top:  5px;
      margin-right:  5px;
    }
  }

  .panel-body {
    z-index: 2000;
    height: auto;
    padding: 1.5em;
    margin-right: 0;
    display: flex;
    flex-flow:  row wrap;
    justify-content: flex-start;
    align-content: flex-start;
    align-items: flex-start;
  }
</style>