<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";

  export let threshold = 0;
  export let horizontal = false;
  export let elementScroll;
  export let hasMore = true;
  export let scrollTop;

  const dispatch = createEventDispatcher();
  let isLoadMore = false;
  let component;
  let currScrollTop;

  $: {
    if (component || elementScroll) {
      const element = elementScroll ? elementScroll : component.parentNode;

      console.log(element)
      element.addEventListener("scroll", onScroll);
      element.addEventListener("resize", onScroll);
      if (scrollTop != currScrollTop) {
        currScrollTop = scrollTop;
        element.scrollTop = 0;
      }
    }
  }

  const onScroll = e => {
    const element = e.target;
    console.log("[scroll] ",e)

    const offset = horizontal
      ? e.target.scrollWidth - e.target.clientWidth - e.target.scrollLeft
      : e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop;

    if (offset <= threshold) {
      if (!isLoadMore && hasMore) {
        dispatch("loadMore");
      }
      isLoadMore = true;
    } else {
      isLoadMore = false;
    }
  };

  onDestroy(() => {
    if (component || elementScroll) {
      const element = elementScroll ? elementScroll : component.parentNode;

      element.removeEventListener("scroll", null);
      element.removeEventListener("resize", null);
    }
  });
</script>

<div bind:this={component} style="width:0px" />