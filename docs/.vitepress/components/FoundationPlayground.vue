<script setup lang="ts">
import { computed, defineComponent, h, ref, watch } from "vue";
import { useData } from "vitepress";
import { VLocaleProvider } from "vuetify/components/VLocaleProvider";
import { WButton, WBadge, WAccordion } from "../../../src";
const props=withDefaults(defineProps<{initial?:string}>(),{initial:'all'});
const {lang}=useData();const ar=computed(()=>lang.value.startsWith('ar'));
const title=ref(''),type=ref('primary'),badgeType=ref('success'),size=ref('lg'),disabled=ref(false),loading=ref(false),tooltip=ref(false),position=ref('start'),dot=ref(true),open=ref(true),direction=ref('ltr'),accent=ref('#087f8c'),draft=ref(''),clicks=ref(0),submits=ref(0),actions=ref(0);
function reset(){title.value=ar.value?'حفظ التغييرات':'Save changes';draft.value=ar.value?'مسودة محفوظة أثناء الفتح والإغلاق':'Draft survives closing and reopening';type.value='primary';badgeType.value='success';size.value='lg';disabled.value=false;loading.value=false;tooltip.value=false;position.value='start';dot.value=true;open.value=true;direction.value=ar.value?'rtl':'ltr';accent.value='#087f8c';clicks.value=0;submits.value=0;actions.value=0;}
watch([ar,()=>props.initial],reset,{immediate:true});
const showButton=computed(()=>props.initial==='all'||props.initial==='button'),showBadge=computed(()=>props.initial==='all'||props.initial==='badge'),showAccordion=computed(()=>props.initial==='all'||props.initial==='accordion');
const DemoIcon=defineComponent({props:{size:{type:[String,Number],default:20},color:{type:String,default:'currentColor'},chevron:Boolean},setup(p){return()=>{const size=(({xs:16,sm:20,md:24,lg:32,xl:40} as Record<string,number>)[String(p.size)]??Number(p.size))||20;return h('span',{class:'foundation-icon',style:{width:`${size}px`,height:`${size}px`,color:p.color},'aria-hidden':'true'},[h('svg',{xmlns:'http://www.w3.org/2000/svg',viewBox:'0 0 24 24'},[h('path',{d:p.chevron?'m6 9 6 6 6-6':'m5 12 4 4L19 6',fill:'none',stroke:'currentColor','stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'})])]);};}});
</script>
<template>
  <section class="foundation-demo" :aria-label="ar?'تجربة الأزرار والشارات واللوحات':'Foundation component playground'">
    <div class="foundation-controls">
      <label v-if="showButton">{{ar?'عنوان الزر':'Button title'}}<input v-model="title" /></label>
      <label v-if="showButton">{{ar?'نوع الزر':'Button variant'}}<select v-model="type"><option v-for="v in ['primary','secondary','outline','danger','tertiary','link','icon','table-icon','text']" :key="v">{{v}}</option></select></label>
      <label v-if="showButton">{{ar?'المقاس':'Size'}}<select v-model="size"><option v-for="v in ['xl','lg','md','sm']" :key="v">{{v}}</option></select></label>
      <label v-if="showBadge">{{ar?'نوع الشارة':'Badge variant'}}<select v-model="badgeType"><option v-for="v in ['primary','success','danger','warning','info','outline','outline-secondary','transparent','dark','tertiary','success-transparent','danger-transparent']" :key="v">{{v}}</option></select></label>
      <label v-if="showButton||showBadge">{{ar?'موضع الأيقونة':'Icon position'}}<select v-model="position"><option value="start">{{ar?'البداية':'Start'}}</option><option value="end">{{ar?'النهاية':'End'}}</option></select></label>
      <label>{{ar?'الاتجاه':'Direction'}}<select v-model="direction"><option value="ltr">LTR</option><option value="rtl">RTL</option></select></label>
      <label>{{ar?'اللون الأساسي':'Accent color'}}<input v-model="accent" type="color" /></label>
      <label v-if="showButton" class="foundation-check"><input v-model="disabled" type="checkbox" />{{ar?'تعطيل':'Disabled'}}</label>
      <label v-if="showButton" class="foundation-check"><input v-model="loading" type="checkbox" />{{ar?'تحميل':'Loading'}}</label>
      <label v-if="showButton" class="foundation-check"><input v-model="tooltip" type="checkbox" />Tooltip</label>
      <label v-if="showBadge" class="foundation-check"><input v-model="dot" type="checkbox" />{{ar?'النقطة':'Dot'}}</label>
      <label v-if="showAccordion" class="foundation-check"><input v-model="open" type="checkbox" />{{ar?'اللوحة مفتوحة':'Panel open'}}</label>
    </div>
    <VLocaleProvider :rtl="direction==='rtl'">
      <div class="foundation-stage" :dir="direction" :style="{'--wakeb-button-primary-background':accent,'--wakeb-badge-success-dot':accent,'--wakeb-accordion-focus':accent}">
        <form v-if="showButton" @submit.prevent="submits++">
          <WButton :title="title" icon="$complete" :type="type" :size="size" :icon-position="position==='end'?'end':'start'" :is-tooltip="tooltip" :disabled="disabled" :is-loading="loading" action="submit" @click="clicks++">
            <template #icon="{size:iconSize,color}"><DemoIcon :size="iconSize" :color="color" /></template>
          </WButton>
          <output>{{ar?'نقرات':'Clicks'}}: {{clicks}} · {{ar?'إرسال الفورم':'Form submissions'}}: {{submits}}</output>
        </form>
        <WBadge v-if="showBadge" :label="ar?'جاهز للمراجعة':'Ready for review'" :type="badgeType" :is-dot="dot" :icon-position="position==='end'?'after':'before'"><template #icon="{size:iconSize}"><DemoIcon :size="iconSize" /></template></WBadge>
        <WAccordion v-if="showAccordion" v-model="open" :title="ar?'تفاصيل الطلب':'Request details'" :toggle-label="ar?'تبديل تفاصيل الطلب':'Toggle request details'" after-icon>
          <template #toggleIcon="{size:iconSize,color}"><DemoIcon :size="iconSize" :color="color" chevron /></template>
          <template #actions><button type="button" class="foundation-action" @click="actions++">{{ar?'تعديل':'Edit'}}</button></template>
          <label>{{ar?'محتوى محفوظ':'Persistent content'}}<input v-model="draft" /></label>
          <p>{{ar?'ضغطات actions لا تفتح أو تغلق اللوحة':'Action clicks do not toggle the panel'}}: {{actions}}</p>
        </WAccordion>
      </div>
    </VLocaleProvider>
    <button class="foundation-reset" type="button" @click="reset">{{ar?'استعادة المثال':'Reset example'}}</button>
    <code>import { WButton, WBadge, WAccordion } from 'wakeb-components'</code>
  </section>
</template>
<style scoped>
.foundation-demo{margin:24px 0;padding:22px;border:1px solid var(--vp-c-divider);border-radius:16px;background:var(--vp-c-bg-soft);}
.foundation-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}
.foundation-demo label{display:grid;gap:6px;font-size:13px;}
.foundation-demo input:not([type=checkbox]),.foundation-demo select{width:100%;min-width:0;height:38px;padding:5px 9px;border:1px solid var(--vp-c-divider);border-radius:7px;color:var(--vp-c-text-1);background:var(--vp-c-bg);}
.foundation-demo input[type=color]{padding:3px;}
.foundation-demo .foundation-check{display:flex;align-items:center;gap:8px;}
.foundation-stage{display:grid;gap:24px;margin-top:24px;padding:24px;border:1px dashed var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg);color:var(--vp-c-text-1);--wakeb-accordion-background:var(--vp-c-bg);--wakeb-accordion-body-background:var(--vp-c-bg-soft);--wakeb-accordion-title:var(--vp-c-text-1);--wakeb-accordion-border:var(--vp-c-divider);}
.foundation-stage output{display:block;margin-top:14px;font-size:13px;color:var(--vp-c-text-2);}
.foundation-icon{display:inline-flex;flex:none;align-items:center;justify-content:center;}
.foundation-icon svg{display:block;width:100%;height:100%;}
.foundation-action{padding:4px 8px;border:1px solid var(--vp-c-divider);border-radius:6px;font-size:13px;}
.foundation-stage p{margin-bottom:0;font-size:13px;}
.foundation-reset{margin-top:18px;color:var(--vp-c-brand-1);font-size:13px;font-weight:600;}
.foundation-demo code{display:block;margin-top:16px;white-space:normal;}
@media(max-width:600px){.foundation-controls{grid-template-columns:1fr;}.foundation-demo,.foundation-stage{padding:14px;}}
</style>
