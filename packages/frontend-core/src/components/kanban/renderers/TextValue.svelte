<script>
  export let value
</script>

<div class="text">{value || " "}</div>

<style>
  .text {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
