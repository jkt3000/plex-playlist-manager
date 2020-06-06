<script>
  import Playlist from './partials/Playlist.svelte';

  export let playlists = [];
  let listType = 'regular';  

</script>


<nav class='navbar navbar-expand navbar-dark m-0 p-0 panel-header'>
  <ul class='navbar-nav'>
    <li class='nav-item'>
      <a href='#' class='nav-link' class:active={listType === 'all'} on:click={ () => listType = 'all' }>All</a>
    </li>
    <li class='nav-item'>
      <a href='#' class='nav-link' class:active={listType === 'smart'} on:click={ () => listType = 'smart' }>Smart</a>
    </li>
    <li class='nav-item'>
      <a href='#' class='nav-link' class:active={listType === 'regular'} on:click={ () => listType = 'regular' }>Regular</a>    
    </li>
  </ul>  
  <ul class='navbar-nav'>
    <li class='nav-link'>
      <a href='#' class='nav-link'>
        <i class='fas fa-plus-circle fa-lg text-white'></i>
      </a>
    </li>
  </ul>  
</nav>

<div class='panel-body'>
  {#each playlists as playlist}
    <Playlist playlist={playlist} listType={listType}/>
  {/each}
</div>


<style lang="scss">

.panel-header {
  position: fixed;
  top:  55px;
  z-index: 1000;
  background: #111;
  height: 50px;
  max-height:50px !important;
  width: inherit;
}

.panel-body {
  margin-top: 55px;
  height: 100%;
  padding: 1em;
}
  
</style>