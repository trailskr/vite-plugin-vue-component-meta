<script setup lang="ts">
withDefaults(defineProps<{
  /** Some other prop description 123 */
  someOtherProp?: number
  gameOver: { some: string }
  hello?: boolean
}>(), {
  someOtherProp: 123,
})
</script>

<template>
  <div>MyOtherComponent</div>
</template>
