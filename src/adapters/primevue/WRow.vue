<script setup lang="ts">
import { useGridRow } from "../../core/grid";
import type { RowProps } from "../../types";
import "../../styles/grid.css";
/* Wakeb-owned 12-column grid, identical on every provider; attrs reach the row element. */
defineOptions({ name: "WRow" });
const props = defineProps<RowProps>();
defineSlots<{ default?(): unknown }>();
const rowClasses = useGridRow("WRow");
</script>
<template>
  <div :class="rowClasses(props)"><slot /></div>
</template>
