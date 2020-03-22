<template>
  <div id="app">
    <List id="list" class="mt-2"/>
    <Reproductor id="reproductor"/>
  </div>
</template>


<script>
  import Reproductor from "./components/Reproductor";
  import List from "./components/List";
  export default {
    components:{
      Reproductor,List
    }
  }
</script>
<style>
  body{
    background: #1c1d1f;
  }
 
  #reproductor{
    position: fixed;
    bottom: 0;
    width: 100%;
    margin-left: 1px;
    color:white;
    background: #2c2d2f;
  }
</style>
