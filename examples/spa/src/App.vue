<script setup lang="ts">
import { watch } from 'vue'
import { meta as myOtherComponentMeta } from './components/my-other-component.vue-meta'
import myComponentMeta from './components/MyComponent.vue-meta'

import TableProps from './story/TableProps.vue'

// meta is shallow reactive object
watch(myOtherComponentMeta, () => {
  // eslint-disable-next-line no-console
  console.log('update')
})
</script>

<template>
  <TableProps :props="myComponentMeta.props" />
  <TableProps :props="myOtherComponentMeta.props" />
</template>

<style>
html,
body {
  margin: 0;
  color: rgb(202 211 245);
  background-color: rgb(36 39 58);
}
</style>
