<script>  

  import {libraryFilters} from './../lib/stores.js';
  
  export let size;

  const Plex     = document.plex; // only for console access
  let sortFilter = { sort: 'titleSort', desc: false};
  const sortMap  = {
    'titleSort': "Title",
    'year': "Year",
    'originallyAvailableAt': "Release Date",
    'duration': "Duration",
    'rating': "Rating",
    'addedAt': "Date Added",
    'lastViewedAt': "Last Viewed"
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
        <span class='btn btn-sm btn-success'>{size}</span>
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
</style>