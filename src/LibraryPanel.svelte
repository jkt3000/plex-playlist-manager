<script context='module'>

</script>
<script>
  import {createEventDispatcher} from 'svelte';
  import InfiniteScroll from "/partials/InfiniteScroll.svelte";
  import {plexUser, sortBy, sortDesc, sortFilter, showSpinner} from '/lib/stores.js';
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

  $: if (library != null) {
    if ($sortFilter) {
      loadMedia();
    }
  }

  async function loadMedia() {
    $showSpinner = true;
    page = 1;
    let options = {page: page, page_size: page_size, sort: $sortFilter};
    let resp = await Plex.Movie.all(library.key, options);
    newBatch = resp.Metadata;
    totalSize = resp.totalSize;
    medias = [...newBatch];
    $showSpinner = false;
  };

  async function nextPage() {
    $showSpinner = true;
    page++;
    let options = {page: page, page_size: page_size, sort: $sortFilter};
    let resp = await Plex.Movie.all(library.key, options);
    newBatch = resp.Metadata;
    medias = [...medias, ...newBatch];
    $showSpinner = false;
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

<nav class="navbar navbar-expand sticky-top panel-header">
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
          <a class="dropdown-item" href="#" on:click={() => setSort('title') }>
            Title 
            {#if $sortBy === 'titleSort'}
              <i class='fas fa-caret-{$sortDesc ? 'down' : 'up'}'></i>
            {/if}
          </a>
          <a class="dropdown-item" href="#" on:click={() => setSort('year') }>
            Year
            {#if $sortBy === 'year'}
              <i class='fas fa-caret-{$sortDesc ? 'down' : 'up'}'></i>
            {/if}
          </a>
          <a class="dropdown-item" href="#" on:click={() => setSort('releasedAt') }>
            Release Date
            {#if $sortBy === 'originallyAvailableAt'}
              <i class='fas fa-caret-{$sortDesc ? 'down' : 'up'}'></i>
            {/if}
          </a>
          <a class="dropdown-item" href="#" on:click={() => setSort('rating') }>
            Rating
            {#if $sortBy === 'rating'}
              <i class='fas fa-caret-{$sortDesc ? 'down' : 'up'}'></i>
            {/if}
          </a>
          <a class="dropdown-item" href="#" on:click={() => setSort('duration') }>
            Duration
            {#if $sortBy === 'duration'}
              <i class='fas fa-caret-{$sortDesc ? 'down' : 'up'}'></i>
            {/if}
          </a>
          <a class="dropdown-item" href="#" on:click={() => setSort('addedAt') }>
            Date Added
            {#if $sortBy === 'addedAt'}
              <i class='fas fa-caret-{$sortDesc ? 'down' : 'up'}'></i>
            {/if}
          </a>
          <a class="dropdown-item" href="#" on:click={() => setSort('viewedAt') }>
            Date Viewed
            {#if $sortBy === 'lastViewedAt'}
              <i class='fas fa-caret-{$sortDesc ? 'down' : 'up'}'></i>
            {/if}
          </a>
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
    scrollTop={`${library.key}${$sortFilter}`}/>
</div>


<style lang='scss'>
  .panel-header {
    background: #111;
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
    width: 100%;
    padding: 1.5em;
    margin-right: 0;
  }
</style>