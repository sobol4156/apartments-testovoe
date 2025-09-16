<script setup lang="ts">
import Table from '~/shared/ui/table/Table.vue'

const columns = [
    { key: 'plan', label: 'Планировка' },
    { key: 'apartment', label: 'Квартира' },
    { key: 'metre', label: 'S, м²', isSorted: true },
    { key: 'level', label: 'Этаж', isSorted: true },
    { key: 'price', label: 'Цена, ₽', isSorted: true },
]

const data = [
  { plan: '1-комн', apartment: '3-комнатная №104', metre: '63,1', level: 3, price: 4500000 },
  { plan: '2-комн', apartment: '3-комнатная №105', metre: '63,2', level: 5, price: 7500000 },
  { plan: '3-комн', apartment: '3-комнатная №106', metre: '63,2', level: 7, price: 9800000 },
  { plan: 'Студия', apartment: '3-комнатная №106', metre: '63,6', level: 2, price: 3200000 },
  { plan: '2-комн', apartment: '3-комнатная №108', metre: '63,1', level: 4, price: 7200000 },
]
</script>

<template>
    <div>
        <Table :columns="columns" :data="data" />
    </div>
</template>