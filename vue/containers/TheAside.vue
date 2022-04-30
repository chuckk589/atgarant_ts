<template>
  <CSidebar
    aside
    :show="$store.state.asideShow"
    @update:show="(val) => $store.commit('set', ['asideShow', val])"
    colorScheme="light"
    overlaid
    size="lg"
  >
    <CSidebarClose @click.native="$store.commit('toggle', 'asideShow')"/>
  </CSidebar>
</template>

<script>
export default {
  name: 'TheAside'
}
</script>
