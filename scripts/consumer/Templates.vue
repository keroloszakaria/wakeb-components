<!-- Template-level contract (SPEC R14): vue-tsc infers slot payloads and handler types from the packed facades. -->
<script setup lang="ts">
import { ref } from 'vue'
import { WAccordion, WButton, WModal, WTree, WDropdown, type DropdownItem, type TreeNode } from 'wakeb-components'
const open = ref(false)
const key = ref<string | number>(0)
const upper = (value: string) => value.toUpperCase()
const half = (value: number) => value / 2
const onNode = (node: TreeNode) => node.id
const onItem = (item: DropdownItem) => item.label
const onText = (text: string) => text
</script>
<template>
  <WModal v-model="open" title="Dialog">
    <template #close-button="{ close, label }"><button type="button" @click="close">{{ upper(label) }}</button></template>
    <template #loading="{ label }">{{ upper(label) }}</template>
  </WModal>
  <WModal v-model="open">
    <template #close-button="{ label }">
      <!-- @vue-expect-error the close-button label is a string -->
      {{ half(label) }}
    </template>
  </WModal>
  <WAccordion v-model="open">
    <template #header="{ triggerProps, open: expanded }"><button v-bind="triggerProps">{{ expanded }}</button></template>
  </WAccordion>
  <!-- @vue-expect-error the accordion model is a boolean -->
  <WAccordion :model-value="key" />
  <WTree :nodes="[{ id: 1, name: 'Root' }]" @node-click="onNode" @toggle="onNode">
    <template #node="{ node, level }">{{ node.name }} {{ half(level) }}</template>
  </WTree>
  <WTree :nodes="[]">
    <template #node="{ level }">
      <!-- @vue-expect-error tree levels are numbers -->
      {{ upper(level) }}
    </template>
  </WTree>
  <!-- @vue-expect-error node-click receives the node -->
  <WTree :nodes="[]" @node-click="onText" />
  <WDropdown v-model="key" :menu-items="[{ label: 'Ready', value: 0 }]" @selected-item="onItem">
    <template #item-label="{ item, text }">{{ item.label }} {{ upper(text) }}</template>
  </WDropdown>
  <!-- @vue-expect-error selectedItem receives the whole item -->
  <WDropdown :menu-items="[]" @selected-item="onText" />
  <WButton title="Save" @click="(event: MouseEvent) => event.preventDefault()">
    <template #icon="{ size }">{{ size }}</template>
  </WButton>
</template>
