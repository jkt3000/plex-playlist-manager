<script>
  export let item;
  export let index;
</script>

<style>
  span{
    background-color: #ddd;
    border-radius: 4px;
    padding: 0 1em;
    font-size: .5em;
    border:  1px solid #333;
    margin-bottom: 10px;
  }
</style>

<h1>
  <span>{index}</span> {item.title}
</h1>