<script setup lang="ts">
import metaMap from 'virtual:vue-meta'

import TableProps from './story/TableProps.vue'
</script>

<template>
  <TableProps :props="metaMap.MyComponent.props" />
  <TableProps :props="metaMap.MyOtherComponent.props" />
</template>

<style>
html, body {
  margin: 0;
  color: rgb(202 211 245);
  background-color: rgb(36 39 58);
}
</style>