<script>
  import {currLibrary} from './../lib/stores.js';

  export let libraries;
  export let playlists;
</script>

<nav class='sidebar text-muted'>
  <div class='sidebar-sticky'>

    <h6>Libraries</h6>

    {#if (libraries != null)}
    <ul class='nav flex-column'>
      {#each libraries as library}
        <li class="nav-item">
          <a class="nav-link" 
             href="#" 
             class:active={ $currLibrary == library }
             on:click={ () => $currLibrary = library }>
            {library.title} <small class='text-muted'>({library.totalSize})</small>
          </a>
        </li>
      {/each}
    </ul>
    {/if}

    <h6>
      Playlists  
      <a href='#' class='float-right text-success'><i class='fas fa-plus-circle'></i></a>
    </h6>

    {#if (playlists != null)}
    <ul class='nav flex-column'>
      {#each playlists as playlist}
      <li class='nav-item'>
        <a href="#" class='nav-link droppable'>
          {#if playlist.smart}<i class='fas fa-cog text-muted'></i>{/if}
          {playlist.title}
          <small class='text-muted'>({playlist.leafCount})</small>
        </a>
      </li>
      {/each}
    </ul>
    {/if}
  </div>        
</nav>

<style lang='scss'>
:global(.sidebar) {
  width: 15vw;
  height:100%;
  position:fixed;
  top:55px;
  left:0;
  background: #111;
  bottom:0;
  .nav-link { 
    color: #ccc; 
    margin-left: -8px;
  }
  .sidebar-sticky {
    padding: 1em .5em;
    h6 { text-transform: uppercase; font-size: .9em; }
    ul { margin-bottom: 1em; }
  }
  .active-drop {
    background: #999 !important;
    border: 1px dashed red !important;
  }
}  


</style>