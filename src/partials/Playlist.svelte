<script context='module'>
  import moment from 'moment';
</script>

<script>
  export let playlist;
  export let listType = 'all';

  let width  = 100;
  let height = 100;
  let Plex   = document.plex;
  $: imgurl = Plex.thumbUrl(playlist.composite, width, height);
  let expanded = false;
  $: klass = 'show-'+listType+"-"+ (playlist.smart ? 'smart' : 'regular');
  $: entries = [];
  $: {
    if (listType) {}
  };


  function showList() {
    if (listType === 'all') return true;
    if (listType === 'smart') return playlist.smart;
    if (listType === 'regular') return !playlist.smart;
    return true;
  };

  async function togglePlaylist() {
    expanded = !expanded;
    if (expanded) {
      console.log("Run loadItems...")
      await loadItems();
    }
  }

  async function loadItems() {
    let data = await Plex.Playlist.getItems(playlist.ratingKey);
    entries = data.Metadata;
  }

  async function removeItem(id) {
    let data = await Plex.Playlist.removeItem(playlist.ratingKey, id);
    playlist = data.Metadata[0];
    await loadItems();
  }

</script>


<div class='playlist-drop text-muted {klass}' class:droppable={!playlist.smart} data-id={playlist.ratingKey}>
  <div class='playlist-header'>
    {#if playlist.smart}
      <i class='fas fa-cog text-success fa-lg'></i>
    {/if}
    <img src={imgurl} on:click={togglePlaylist} class='pointer playlist-thumb'/>
    <div class='header-content'>
      <h5>
        <a href='#' class='text-light' on:click={togglePlaylist}>{playlist.title} {playlist.ratingKey}</a>
        <span class='text-muted'>({playlist.leafCount})</span>
      </h5>
      <span>Duration: {moment.utc(playlist.duration).format('H[hrs] m[m]')}</span>
    </div>
  </div>
  <div class='playlist-body' class:expanded>

    {#each entries as entry}

      <p>{entry.title} ({entry.year}) {entry.playlistItemID}
        <a href="#" class='text-danger' on:click={() => removeItem(entry.playlistItemID) }><i class='fas fa-trash-alt'></i></a>
      </p>
    {/each}
  </div>
</div>


<style lang='scss'>

:global(.playlist-drop) {
  border: 1px solid #ddd;
  display: block;
  position: relative;
  width: 100%;
  margin-bottom: 1em;
  padding: 0;
  &.show-smart-regular {
    display: none;
  }
  &.show-regular-smart {
    display: none;
  }
  
  &.active-drop {
    border: 1px solid red !important;
  }
  &.available {
    border:  1px dashed orange;
  }
  &.dropped {
    background: orange;
  }
  .playlist-header {
    height:  77px; 
    display: flex;
    flex-flow:  row nowrap;
    .header-content {
      width:  100%;
      height:  75px;
      padding:  5px;
    }
    .playlist-thumb {
      width:  75px;
      height:  75px;
    }
    .fa-cog {
      position: absolute; top:  10px; right:  5px;
    }
    h5 { color:  #ccc; 
      font-size:  1.0em;}
  }
  .playlist-body {
    padding:  10px;
    border:  1px solid blue;
    display: none;
    &.expanded { display: block; }
  }
}
</style>


