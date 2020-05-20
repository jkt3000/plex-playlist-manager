<div class='playlist-drop text-light'>
  <img src={imgurl} class='thumbnail float-right' width=75/>
  <h6>
    {playlist.title} ({playlist.leafCount}) 
    {#if playlist.smart}
      <i class='fas fa-cog'></i>
    {/if}    
  </h6>

</div>


<script context='module'>
  import moment from 'moment';
</script>

<script>
  export let playlist;

  let width  = 100;
  let height = 100;
  let Plex   = document.plex;
  let imgurl = Plex.thumbUrl(playlist.composite, width, height)
</script>

<style lang='scss'>


:global(.playlist-drop) {
  border: 1px solid #ddd;
  background: rgba(0,0,0,0.5);
  width: 100%;
  height: 100px;
  text-align:left;
  margin-bottom: 1em;
  padding: 5px;
  &.active-drop {
    border: 1px solid red;
  }
  &.dropped {
    background: orange;
  }
}
</style>


