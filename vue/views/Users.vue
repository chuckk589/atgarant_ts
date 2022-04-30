<template>
  <div>
    <CExtendedModal @modal-closed = "closeModalHandler()" :vis="modalConfig.show" :mData="modalConfig.data">
      <template #role="{item}">
        <CSelect label="Роль" :options="roles" :value.sync="item.value"/>
      </template>
    </CExtendedModal>
    <CDataTable
    :items="users"
    :fields="fields"
    sorter
    columnFilter>
    <template #role="{item}"><td>{{roles.find(f=>f.value === item.role).label}}</td></template>
    <template #createdAt="{item}"><td>{{new Date(item.createdAt).toLocaleString()}}</td></template>
    <!-- <template #initiator="{item}"><td data-label = "Инициатор сделки">{{item.initiator.username || item.initiator.chat_id}}</td></template>
    <template #offerStatus="{item}"><td data-label = "Статус сделки">{{item.offerStatus.name}}</td></template>
    <template #partner="{item}"><td data-label = "Компаньон">{{item.partner.username || item.partner.chat_id}}</td></template>
    <template #paymentMethod="{item}"><td data-label = "Способ оплаты">{{item.paymentMethod.name}}</td></template>
    <template #createdAt="{item}"><td data-label = "Дата создания">{{new Date(item.createdAt).toLocaleString()}}</td></template>
    <template #role="{item}"><td data-label = "Роль инициатора">{{item.role === 'seller'?'Продавец':'Покупатель'}}</td></template> -->
    <template #action="{item}">
      <td>
        <CDropdown toggler-text="Действия" class="m-2" color="secondary">
          <CDropdownItem @click="setRole(item)">Изменить роль</CDropdownItem>
          <CDropdownItem @click="addLink(item)" v-if="isAdmin">Добавить ссылку</CDropdownItem>
          <CDropdownItem @click="addViolation(item)" v-if="isAdmin">Добавить нарушение</CDropdownItem>
          <!-- <CDropdownItem @click="deleteUser(item)">Удалить пользователя</CDropdownItem> -->
        </CDropdown>
      </td>
    </template>
    </CDataTable>
  </div>
</template>

<script>
import CExtendedModal from '../containers/CExtendedModal.vue'
import mixin from '../mixins/userData'
export default {
  name: 'Users',
  components: {
    CExtendedModal
  },
  mixins: [mixin],
  data () {
    return {
      modalConfig:{
        show:false,
        data:{},
        cur:{}
      },
      roles:[{ 
          value: 0, 
          label: 'Пользователь'
        },{ 
          value: 1, 
          label: 'Администратор'
        },{ 
          value: 2, 
          label: 'Арбитр'
        }],
      users:[],
      fields:[
        {key:'id', label:'Id'},
        {key:'role', label:'Роль'},
        {key:'chat_id', label:'Telegram Id'},
        {key:'username', label:'Имя пользователя'},
        {key:'first_name', label:'Имя'},
        {key:'locale', label:'Язык'},
        {key:'createdAt', label:'Дата регистрации'},
        {key:'action', label: '', filter: false,sorter: false}
      ]
    }
  },		
  mounted:function() {
    this.$http({method: 'GET', url: `/v1/user/`}).then(e => {
      this.users = e.data
    })
  },
  methods:{
    setRole(user){
      this.modalConfig.data = {
        cur:user,
        fields:[{label:'role', value: user.role}],
        footer:'Сохранить',
        header: 'Задать роль',
        type:'role'
      }
      this.modalConfig.show = true
    },
    addViolation(user){
      this.modalConfig.data = {
        cur: user,
        fields:[{label:'Комментарий', value: ''}],
        footer:'Сохранить',
        header: 'Добавить нарушение',
        type:'violation'
      }
      this.modalConfig.show = true
    },
    addLink(user){
      this.modalConfig.data = {
        cur: user,
        fields:[{label:'Ссылка на ресурс пользователя', value: ''}],
        footer:'Сохранить',
        header: 'Верифицировать пользователя',
        type:'link'
      }
      this.modalConfig.show = true
    },
    closeModalHandler(){
      if(this.modalConfig.data.type == 'role'){
        const newRole = this.modalConfig.data.fields.find(f=>f.label == 'role').value
        this.$http({method: 'PUT', url: `/v1/user/${this.modalConfig.data.cur.id}/`, data:{role:newRole}})
        .then(res=>{
          this.modalConfig.data.cur.role = newRole
        })
      }else if(this.modalConfig.data.type == 'link'){
        const userId = this.modalConfig.data.cur.id
        const url = this.modalConfig.data.fields[0].value
        this.$http({method: 'POST', url: `/v1/link/`, data:{
          userId: userId,
          url:url
          }
        })
      }else if(this.modalConfig.data.type == 'violation'){
        const userId = this.modalConfig.data.cur.id
        const text = this.modalConfig.data.fields[0].value
        this.$http({method: 'POST', url: `/v1/violation/`, data:{
          userId: userId,
          text: text
          }
        })
      }
    },
  }
}
</script>
