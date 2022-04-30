<template>
  <CModal :show.sync = "vis" :title ="mData.header">
    <slot name = "content"></slot>
    <template v-for="(field,index) in mData.fields">
      <template v-if="$scopedSlots[field.label]">
        <slot :name="field.label" :item="field" />
      </template>
      <CSelect v-else-if="field.select" :label="field.label" :value.sync="field.value" :options="field.select" :key="index"/>
      <CInput v-else :label="field.label" v-model="field.value" :key="index"/>
    </template>
    <template #footer>
      <p v-if="disableFooter"></p>
      <CButton v-else color="primary" @click="closeModal()">{{mData.footer}}</CButton>
    </template>
  </CModal>
</template>

<script>
export default {
  name: 'ExtendedModal',
  
  data () {
    return {
    }
  },
  props: {
    vis: Boolean,
    disableFooter:Boolean,
    mData: Object
    // {
    //   fields:[{label:'22',value:22}],
    //   footer:'test',
    //   header:'testHeader'
    // }
  },
  methods:{
    closeModal(){
      this.$emit('modal-closed')
      this.vis = false
    }
  },
}
</script>
