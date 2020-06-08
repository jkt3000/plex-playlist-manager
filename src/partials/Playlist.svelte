<script>
  import moment from 'moment';
  let Plex   = document.plex;

  export let playlist;

  $: entries = [];  
  $: {
    if (playlist != null) {
      loadItems();
    }
  }

  async function loadItems() {
    let data = await Plex.Playlist.getItems(playlist.ratingKey);
    entries = data.Metadata;
  };

  async function removeItem(id) {
    let data = await Plex.Playlist.removeItem(playlist.ratingKey, id);
    playlist = data.Metadata[0];
    await loadItems();
  };

  async function moveAboveItem(itemId, targetId) {
    console.log("moveAboveItem")
    let id = playlist.ratingKey;
    let data = await Plex.Playlist.moveItem(id, itemId, targetId, 'before');
    playlist = data.Metadata[0];
  };

  async function moveBelowItem(itemId, targetId) {
    let id = playlist.ratingKey;
    let data = await Plex.Playlist.moveItem(id, itemId, targetId, 'after');
    playlist = data.Metadata[0];
  };

  async function moveToTop(itemId) {
    let top = entries[0];
    await moveAboveItem(itemId, top.playlistItemID);
  };

  async function moveToBottom(itemId) {
    let bottom = entries[entries.length-1];
    await moveBelowItem(itemId, bottom.playlistItemID);
  };
  
  async function updateList() {}

</script>

<img src={Plex.thumbUrl(playlist.composite, 100, 100)} class='pointer playlist-thumb'/>

<h3 class='text-light'>{playlist.title} </h3>
    {#if playlist.smart}
      <i class='fas fa-cog text-success fa-lg'></i>
    {/if}

<h6 class='text-light'>{playlist.leafCount} Videos</h6>

<table class='table table-striped table-sm table-dark droppable' id='playlist-table'>
{#each entries as movie, i}
  <tr data-id={movie.playlistItemID}>
    <td class='handle text-muted'>
      <i class='fas fa-bars'></i>
    </td>
    <td class='position text-muted'>{ i + 1 }</td>
    <td class='movie-thumb'>
      <img src="{Plex.thumbUrl(movie.thumb, 30)}"/>
    </td>
    <td class='movie-details'>
      <h6>{movie.title}</h6>
      <span class='text-muted'>
        {parseInt(movie.duration/60/1000,10)}m  &middot; 
        <small class='text-warning'><i class='fas fa-star'></i></small> {movie.rating} &middot; {movie.librarySectionTitle} 
      </span>
      <div class='actions'>
        <a href='#' class='text-muted' on:click={() => moveToTop(movie.playlistItemID)}>
          <i class="fas fa-arrow-to-top"></i>
        </a>
        <a href='#' class='text-muted' on:click={() => moveToBottom(movie.playlistItemID)}>
          <i class="fas fa-arrow-to-bottom"></i>
        </a>
        <a href='#' class='text-danger' on:click={() => removeItem(movie.playlistItemID)}>
          <i class='far fa-trash-alt'></i>
        </a>
      </div>
    </td> 
  </tr>
{/each}     
</table>

<style lang='scss'>

#playlist-table {
  td {
    vertical-align: middle;
  }
  &.active-drop {
    border: 1px dashed red !important;
    background: rgba(0,0,0,0.9);
  }
  .handle { text-align:left; width: 16px; }
  .position { text-align:left;  width: 16px; }
  .movie-thumb {
    width: 30px; 
    img {
      width:  30px;
    }
  }
  .movie-details {
    h6 { margin: 0;  }
    width:  100%;
    .actions {
      position: relative; bottom:  0; right:  0; text-align: right;
      float: right;
    }
  }
}

</style>


