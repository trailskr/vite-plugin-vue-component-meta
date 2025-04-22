<script setup lang="ts">
import type { PropertyMeta } from 'vue-component-meta'
import { computed } from 'vue'

const props = defineProps<{
  props: PropertyMeta[]
}>()

const systemPropKeysSet = new Set(['ref', 'key', 'ref_for', 'ref_key', 'class', 'style'])

const userProps = computed(() => props.props.filter(({ name }) => !systemPropKeysSet.has(name)))
</script>

<template>
  <div class="container">
    <table class="table">
      <caption class="caption">
        Props
      </caption>
      <thead>
        <tr>
          <th class="th">
            Name
          </th>
          <th class="th">
            Type
          </th>
          <th class="th">
            Required
          </th>
          <th class="th">
            Default
          </th>
          <th class="th">
            Description
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="prop in userProps"
          :key="prop.name"
        >
          <td class="td">
            {{ prop.name }}
          </td>
          <td class="td">
            {{ prop.type }}
          </td>
          <td class="td">
            {{ prop.required }}
          </td>
          <td class="td">
            {{ prop.default }}
          </td>
          <td class="td">
            {{ prop.description }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  padding: 1rem;
}
.table {
  border-collapse: collapse;
}
.cation {
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.th {
  font-weight: 500;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-bottom: 1px solid rgb(91 96 120);
  top: 0;
  position: sticky;
}
.td {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-top: 1px solid rgb(73 77 100);
}
</style>
