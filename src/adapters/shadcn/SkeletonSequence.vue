<script setup lang="ts">
import { computed } from "vue";
import Skeleton from "./ui/Skeleton.vue";
import { useWakebContext } from "../../core/runtime";
/*
 * Renders a normalized Wakeb skeleton sequence (SPEC R16), the output of useSkeleton, with shadcn-vue
 * Skeleton bones. It mirrors the Vuetify loader's semantics: one polite alert region named
 * "Loading..." whose bones are decorative. Internal to shadcn-vue renderers; not a public component.
 */
defineOptions({ name: "WakebScSkeletonSequence" });
const props = defineProps<{ type: string; width?: string | number }>();
const context = useWakebContext("WBaseSidebar");
type Bone = { width?: string; height?: string; radius?: string };
type Layout = { avatar?: string; lines?: Bone[]; block?: Bone; cells?: number; rows?: number; head?: boolean };
const line = (width: string, height = "0.75rem"): Bone => ({ width, height });
const LAYOUTS: Record<string, Layout> = {
  text: { lines: [line("100%")] },
  heading: { lines: [line("50%", "1.5rem")] },
  paragraph: { lines: [line("100%"), line("100%"), line("60%")] },
  avatar: { block: { width: "3rem", height: "3rem", radius: "50%" } },
  image: { block: { width: "100%", height: "12.5rem", radius: "0" } },
  button: { block: { width: "4rem", height: "2.25rem", radius: "4px" } },
  chip: { block: { width: "6rem", height: "2rem", radius: "1rem" } },
  "list-item": { lines: [line("100%")] },
  "list-item-avatar": { avatar: "2.5rem", lines: [line("100%")] },
  "list-item-two-line": { lines: [line("100%"), line("60%")] },
  "list-item-three-line": { lines: [line("100%"), line("100%"), line("60%")] },
  "list-item-avatar-two-line": { avatar: "2.5rem", lines: [line("100%"), line("60%")] },
  "list-item-avatar-three-line": { avatar: "2.5rem", lines: [line("100%"), line("100%"), line("60%")] },
  "table-row": { cells: 4 },
  table: { head: true, cells: 4, rows: 3 },
  card: { block: { width: "100%", height: "9.5rem", radius: "0" }, lines: [line("50%", "1.5rem")] },
};
/* `list-item@2, text` → ["list-item", "list-item", "text"]; unknown names were already dropped. */
const items = computed(() =>
  props.type.split(",").flatMap((part) => {
    const [name, count] = part.trim().split("@");
    return LAYOUTS[name] ? Array.from({ length: count ? Number(count) : 1 }, () => ({ name, layout: LAYOUTS[name] })) : [];
  }),
);
const size = (value: string | number | undefined) => (typeof value === "number" ? `${value}px` : value);
const bone = (value: Bone) => ({ width: value.width, height: value.height, borderRadius: value.radius });
const label = computed(() => (context.locale === "ar" ? "جارٍ التحميل..." : "Loading..."));
</script>
<template>
  <div class="wakeb-sc-skeleton-sequence" role="alert" aria-live="polite" :aria-label="label" :style="{ width: size(width) }">
    <div v-for="(item, index) in items" :key="index" class="wakeb-sc-skeleton-sequence__item" :data-skeleton="item.name">
      <Skeleton v-if="item.layout.avatar" :style="{ width: item.layout.avatar, height: item.layout.avatar, borderRadius: '50%', flexShrink: 0 }" />
      <Skeleton v-if="item.layout.block" :style="bone(item.layout.block)" />
      <div v-if="item.layout.lines" class="wakeb-sc-skeleton-sequence__lines">
        <Skeleton v-for="(value, boneIndex) in item.layout.lines" :key="boneIndex" :style="bone(value)" />
      </div>
      <div v-if="item.layout.cells" class="wakeb-sc-skeleton-sequence__table">
        <Skeleton v-if="item.layout.head" :style="{ width: '40%', height: '1.25rem' }" />
        <div v-for="row in item.layout.rows ?? 1" :key="row" class="wakeb-sc-skeleton-sequence__row">
          <Skeleton v-for="cell in item.layout.cells" :key="cell" :style="{ flex: 1, height: '0.75rem' }" />
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.wakeb-sc-skeleton-sequence {
  max-width: 100%;
}
.wakeb-sc-skeleton-sequence__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
}
.wakeb-sc-skeleton-sequence__item[data-skeleton="card"] {
  flex-direction: column;
  align-items: stretch;
}
.wakeb-sc-skeleton-sequence__lines,
.wakeb-sc-skeleton-sequence__table {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}
.wakeb-sc-skeleton-sequence__row {
  display: flex;
  gap: 1rem;
}
</style>
