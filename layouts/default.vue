<script setup lang="ts">
import ScrollToTop from '~/features/scroll-to-top/ui/ScrollToTop.vue';
</script>

<template>
  <div class="app-layout">
    <slot />
    <ScrollToTop />
  </div>
</template>