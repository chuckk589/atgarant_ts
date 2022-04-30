<template>
  <div>
    <!-- <CModal title="Вынести вердикт" @update:show ="closeModal" :show.sync = "ModalVisState">
      <CInput v-model="currentItem.comment" label="Комментарий"/>
      <template #footer>
        <CButton color="primary" @click="closeModal(0,0,true);configModalVisState=false">Вынести решение</CButton>
      </template>
    </CModal> -->
    <CExtendedModal @modal-closed = "closeModalHandler()" :vis="modalConfig.show" :mData="modalConfig.data">
      <template #slider>
        <CInputCheckbox @click="handleSidesWallets" :checked.sync = "modalConfig.custom.customPayout" label="Распределить выплату"/>
        <CCollapse :show="modalConfig.custom.customPayout">
          <CInput class="range" :label="'Покупатель ' + modalConfig.custom.sliderValBuyer+'%'" type="range" min="0" max="100" :value.sync="modalConfig.custom.sliderValBuyer" @input="rangeI($event,0)"></CInput>
          <CInput class="range" :label="'Продавец ' + modalConfig.custom.sliderValSeller+'%'" type="range" min="0" max="100" :value.sync="modalConfig.custom.sliderValSeller" @input="rangeI($event,1)"></CInput>
        </CCollapse>
      </template>
    </CExtendedModal>
    <CDataTable
    :items="arbs"
    :fields="fields"
    sorter
    columnFilter>
    <template #arbiter="{item}"><td data-label="Арбитр">{{item.arbiter.username || item.arbiter.chat_id}}</td></template>
    <template #initiator="{item}"><td data-label="Инициатор арбитража">{{item.initiator.username || item.initiator.chat_id}}</td></template>
    <template #status="{item}"><td data-label="Статус арбитража">{{getStatus(item.status)}}</td></template>
    <template #createdAt="{item}"><td data-label = "Дата создания">{{new Date(item.createdAt).toLocaleString()}}</td></template>
    <!-- <template #initiator="{item}"><td>{{item.initiator.chat_id}}</td></template>
    <template #offerStatus="{item}"><td>{{item.offerStatus.name}}</td></template>
    <template #partner="{item}"><td>{{item.partner.chat_id}}</td></template>
    <template #paymentMethod="{item}"><td>{{item.paymentMethod.name}}</td></template>
    <template #createdAt="{item}"><td>{{new Date(item.createdAt).toLocaleString()}}</td></template> -->
    <template #action="{item}">
      <td>
        <CDropdown toggler-text="Действия" class="m-2" color="secondary">
          <CDropdownItem @click="closeArb(item)" v-show="isArb" :disabled = "isActive(item)">Вынести решение</CDropdownItem>
          <CDropdownItem @click="openDispute(item)" v-show="!isArb" :disabled = "isDisputed(item)">Обжаловать</CDropdownItem>
          <CDropdownItem @click="getChatHistory(item)">История чата</CDropdownItem>
        </CDropdown>
      </td>
    </template>
    </CDataTable>
  </div>
</template>

<script>
import CExtendedModal from '../containers/CExtendedModal.vue'
var FileSaver = require('file-saver');
import mixin from '../mixins/userData'

export default {
  name: 'Arbitrary',
  components: {
    CExtendedModal
  },
  mixins: [mixin],
  data () {
    return {
      modalConfig:{
        show:false,
        custom:{
          customPayout:false,
          sliderValBuyer:0,
          sliderValSeller:100
        },
        data:{}
      },
      arbs:[],
      fields:[
        {key:'status', label:"Статус арбитража"},
        {key:'offerId', label:"ID сделки"},
        {key:'chat_id', label:"ID чата арбитража"},
        {key:'reason', label:"Причина обращения"},
        {key:'buyerPayout', label:"Выплата продавцу %"},
        {key:'sellerPayout', label:"Выплата покупателю %"},
        {key:'arbiter', label:"Арбитр"},
        {key:'initiator', label:"Инициатор арбитража"},
        {key:'createdAt', label:"Дата создания"},
        {key:'comment', label:"Решение арбитра"},     
        {key:'action', label: '', filter: false,sorter: false}
      ]
    }
  },
  mounted:function() {
    this.$http({method: 'GET', url: `/v1/arbitrary${this.userData.role === 1 || this.userData.role === 2? '/' : `?userId=${this.userData.id}`}`}).then(e => {
      this.arbs = e.data
    })
  },
  methods:{
    getStatus(status){
      if(status == 'closed'){
        return 'Предварительное решение'
      }else if(status == 'active'){
        return 'В процессе'
      }else if(status == 'disputed'){
        return 'Оспаривается'
      }else if(status == 'closedF'){
        return 'Окончательное решение'
      }
    },
    rangeI(val, type){
      if(type === 0){
        this.modalConfig.custom.sliderValSeller = 100 - +val
      }else{
        this.modalConfig.custom.sliderValBuyer = 100 - +val
      }
    },
    isActive(item){
      return !(item.status == 'active' || item.status == 'disputed')
    },
    isDisputed(item){
      return !(item.status == 'closed' && (new Date() - new Date(item.updatedAt))/(1000*60*60) <= 12)
    },
    closeArb(item){
      this.modalConfig.data = {
        cur:item,
        fields:[{label:'Комментарий', value: item.comment},{label:'slider'}],
        footer:'Сохранить',
        header: 'Арбитраж',
        type:'closeArbitrary'
      }
      this.modalConfig.show = true
    },
    handleSidesWallets(a){
      if(!this.modalConfig.data.cur.offer.sellerWalletData || !this.modalConfig.data.cur.offer.buyerWalletData){
        a.preventDefault()
        alert('Для разрешения арбитража с распределением выплат требуется чтобы у обоих сторон сделки был указан кошелек для выплат')
      }
    },
    closeModalHandler(){
      if(this.modalConfig.data.type == 'closeArbitrary'){
        //check if both wallets present
        const comment = this.modalConfig.data.fields.find(f=>f.label == 'Комментарий').value
        const customPayout = this.modalConfig.custom.customPayout? {seller:this.modalConfig.custom.sliderValSeller,buyer:this.modalConfig.custom.sliderValBuyer}:{}
        this.$http({method: 'POST', url: `/v1/arbitrary/${this.modalConfig.data.cur.id}/close/`, data:{
          comment: comment,
          ...customPayout
        }})
        .then(e => {
          this.modalConfig.data.cur.status = e.data.newStatus
          this.modalConfig.data.cur.comment = comment
        })
      }
    },
    getChatHistory(item){
      this.$http({method: 'GET', url: `/v1/arbitrary/${item.id}/history/`})
      .then(res=>{
        const blob = new Blob([res.data], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, `${item.id}_${new Date().toLocaleDateString()}.txt`);
      })
    },
    openDispute(item){
      this.$http({method: 'POST', url: `/v1/arbitrary/${item.id}/dispute/`, data:{initiator:this.userData.id}})
      .then(r=>{item.status = r.data.newStatus})
    }
    // closeModal(a,b,state){
    //   if(state){
    //     this.$http({method: 'POST', url: `/v1/offer/${this.currentItem.id}/action/`, data:{sellerWalletData:this.currentItem.sellerWalletData }}).then(e => {
    //     if(e.status!== 'error'){
    //       console.log(e)
    //       this.currentItem.sellerWalletData = this.currentItem.sellerWalletData
    //       this.currentItem.offerStatus = Object.assign({},e.data.newStatus)
    //     }
    //   })
    //   }
    // },
    // openModal(item){
    //   this.configModalVisState = true
    //   this.currentItem = Object.assign({}, item)
    // },
    // openModalA(item){
    //   this.configModalVisStateA = true
    //   this.currentItem = Object.assign({}, item)
    // },
    // closeModalA(a,b,state){
    //   if(state){
    //     this.$http({method: 'POST', url: `/v1/offer/${this.currentItem.id}/arbitrary/`, data:{
    //       reason:this.currentItem.reason,
    //       initiator: this.userData.id
    //       }})
    //   }
    // },
    // nextStepAction(offer){
    //   this.$http({method: 'POST', url: `/v1/offer/${offer.id}/action/`}).then(e => {
    //     if(e.status!== 'error'){
    //       offer.offerStatus = Object.assign({},e.data.newStatus)
    //     }
    //   })
    // }
  }
}
</script>
<style>
.range .form-control:focus {
  box-shadow: none!important;
}
@media screen and (max-width: 768px) {

    table {
      border: 0;
    }

    table thead {
      display: none;
    }

    table tr {
      margin-bottom: 10px;
      display: block;
      border: 1px solid #4f5d73;
      border-radius: 2px ;
      /* border-bottom: 2px solid #ddd; */
    }

    table td {
      display: block;
      text-align: right;
      font-size: 13px;
      /* border-bottom: 1px dotted #ccc; */
    }

    table td:last-child {
      border-bottom: 0;
    }

    table td:before {
      content: attr(data-label);
      float: left;
      font-weight: bold;
    }
  }
</style>