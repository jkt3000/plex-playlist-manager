<script>  
  import {libraryFilters, currLibrary} from './../lib/stores.js';
  
  export let size;

  const Plex      = document.plex; // only for console access
  let sortFilter  = {sort: 'titleSort', desc: false};
  let filterKey   = null;
  let filterTitle = null;
  $: filterValues = [];
  const sortMap   = {
    'titleSort': "Title",
    'year': "Year",
    'originallyAvailableAt': "Release Date",
    'duration': "Duration",
    'rating': "Rating",
    'addedAt': "Date Added",
    'lastViewedAt': "Last Viewed"
  };

  function filterLabel(filters) {
    if (filters != null) {
      let filter = filters[0];
      return `${filter.key}: ${filter.labels.join(", ")}`      
    } else {
      return 'All';
    }
  };

  async function filters(type) {
    let resp     = await Plex.Library.filterValues($currLibrary.key, type);
    filterValues = resp.Directory;
    filterTitle  = resp.title2;
    filterKey    = type; 
  };

  // filters
  // actors
    // key:
    // thumb: "http://image.tmdb.org/t/p/original/u5JjnRMr9zKEVvOP7k3F6gdcwT6.jpg"
    // title: "Aaron Eckhart"
  // genres
    // key, title
  // decades, years
    // key, title
  // rating
    // 


  function resetFilters() {
    delete $libraryFilters.filters;    
    $libraryFilters = {...$libraryFilters};
  };

  async function selectFilter() {
    let select = document.getElementById('filter-by');
    let filter = select.dataset.key; 
    let values = Array.from(select.selectedOptions).map(e => e.value);
    let labels = Array.from(select.selectedOptions).map(e => e.dataset.label);

    $libraryFilters.filters = [{key: filter, values: values, labels: labels}];
    filterKey = null;
    filterValues = [];
  };

  function setSort(key) {
    if (sortKey($libraryFilters.sort) == key) {
      $libraryFilters.sort = (sortDesc($libraryFilters.sort)) ? key : `${key}:desc`;
    } else {
      $libraryFilters.sort = (key == 'titleSort') ? key : `${key}:desc`;
    }
    $libraryFilters = {...$libraryFilters};
  };

  function sortLabel(sort) {
    let [key,desc] = sort.split(":");
    return sortMap[key];
  };

  function sortKey(sort) {
    return sort.split(":")[0];
  };

  function sortDesc(sort) {
    return (sort.split(":")[1] == 'desc');
  };
</script>


<nav class="navbar navbar-expand panel-header">
  <ul class="navbar-nav nav mr-auto">
    <li class="nav-item">
      <a href="#" class='btn btn-outline-secondary' data-toggle='dropdown' id="filterDropdown">  
        {filterLabel($libraryFilters.filters)}
      </a>
      <div class="dropdown-menu" aria-labelledby="filterDropdown">
        <a class="dropdown-item" href="#" on:click={resetFilters}>All</a>
        <a class="dropdown-item" href="#" on:click={() => filters('year')}>Year</a>
        <a class="dropdown-item" href="#" on:click={() => filters('decade')}>Decade</a>
        <a class="dropdown-item" href="#" on:click={() => filters('genre')}>Genre</a>
        <a class="dropdown-item" href="#" on:click={() => filters('actor')}>Actor</a>
        <a class="dropdown-item" href="#" on:click={() => filters('director')}>Director</a>
        <a class="dropdown-item" href="#" on:click={() => filters('rating')}>Content Rating</a>
      </div>
    </li>
    <li class="nav-item">
      <a href="#" class='btn btn-outline-secondary' data-toggle='dropdown' id="sortDropdown">
        By {sortLabel($libraryFilters.sort)}
        {#if sortDesc($libraryFilters.sort)}
          <i class="fas fa-angle-down"></i>
        {:else}
          <i class="fas fa-angle-up"></i>
        {/if}
      </a>
      <div class="dropdown-menu" aria-labelledby="sortDropdown">
        {#each Object.keys(sortMap) as key}
          <a class="dropdown-item text-muted" href="#" on:click={() => setSort(key) }>
            {sortMap[key]}
          </a>
        {/each}
      </div>
    </li>
    <li class='nav-item'>
      <span class='nav-link text-muted'>({size})</span>
    </li>
  </ul>
</nav>
<div class='filter-options' class:d-none={filterValues.length == 0}>
  <div class='form form-inline'>
    <div class='input-group col-1'>
      <label>{(filterTitle || "").split('By ')[1]}:</label>
    </div>
    <div class='input-group col-3'>
      
      <select class='custom-select' name="filter-key" id='filter-by' data-key={filterKey} multiple size=4>
        {#each filterValues as entry}
          <option value={entry.key} data-label={entry.title}>{entry.title}</option>
        {/each}
      </select>
    </div>
    <div class='input-group col-1'>
      <button class='btn btn-primary' on:click={selectFilter}>Filter</button>
    </div>
  </div>
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
    .nav-item {
      margin-right:  5px;
    }
  }

  .filter-options {
    background: #111;
    padding:  1em;
  }
</style>