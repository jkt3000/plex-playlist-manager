<script context='module'>
  import moment from 'moment';
</script>

<script>
  export let playlist;
  export let listType = 'all';

  let width  = 100;
  let height = 100;
  let Plex   = document.plex;
  let imgurl = Plex.thumbUrl(playlist.composite, width, height);
  $: expanded = false;

  $: klass = 'show-'+listType+"-"+ (playlist.smart ? 'smart' : 'regular');
  $: {
    if (listType) {

    }
  }

  function showList() {
    if (listType === 'all') return true;
    if (listType === 'smart') return playlist.smart;
    if (listType === 'regular') return !playlist.smart;
    return true;
  };
</script>


<div class='playlist-drop text-muted {klass}' class:droppable={!playlist.smart}>
  <div class='playlist-header'>
    {#if playlist.smart}
      <i class='fas fa-cog text-success fa-lg'></i>
    {/if}
    <img src={imgurl} class='playlist-thumb'/>
    <div class='header-content'>
      <h5 on:click={ () => expanded = !expanded }>{playlist.title} 
        <span class='text-muted'>({playlist.leafCount})</span>
      </h5>
      <span>Duration: {moment.utc(playlist.duration).format('H[hrs] m[m]')}</span>
    </div>
  </div>
  <div class='playlist-body' class:expanded>
    <!-- regular list of movies here -->
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </div>
</div>


<style lang='scss'>

:global(.playlist-drop) {
  border: 1px solid #ddd;
  display: block;
  position: relative;
  xbackground: rgba(0,0,0,0.5);
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
    xborder:  1px solid red;
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


