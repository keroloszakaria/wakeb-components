<script setup lang="ts">
import { useGridColumn } from "../../core/grid";
import type { ColProps } from "../../types";
import "../../styles/grid.css";
/* Wakeb-owned grid column, identical on every provider; attrs reach the column element. */
defineOptions({ name: "WCol" });
const props = defineProps<ColProps>();
defineSlots<{ default?(): unknown }>();
const colClasses = useGridColumn("WCol");
</script>
<template>
  <div :class="colClasses(props)"><slot /></div>
</template>
