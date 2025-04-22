<script setup lang="ts">
withDefaults(defineProps<{
  /** Some other prop description */
  someOtherProp?: number
  gameOver: { some: string }
  hello?: boolean
}>(), {
  someOtherProp: 4,
})
</script>

<template>
  <div>MyOtherComponent</div>
</template>
