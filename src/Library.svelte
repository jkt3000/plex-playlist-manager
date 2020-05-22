
<div class='library border m-1 p-1'>
  <h3> 
    {library.title} <span style='font-size:0.5em'>[id: {library.key}]</span> <small>({library.totalSize})</small>
  </h3>
  <p><em>Last updated: {moment(library.updatedAt * 1000).format("MMMM Do YYYY, hh:mm")}</em></p>
</div>

<script context='module'>
  import moment from 'moment';
</script>

