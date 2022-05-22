<template>
    <CCard>
        <CCardHeader>
            <strong>Новая сделка </strong>
        </CCardHeader>
        <CCardBody>
            <CRow>
                <CCol sm="12" class='form-group'>
                    <vue-autosuggest :suggestions="partnerVariants" :renderSuggestion="renderSuggestion"
                        @selected="onSelected" :getSuggestionValue="getSuggestionValue" @input="fetchResults"
                        :input-props="{ class: ['form-control'], id: 'autosuggest__input', placeholder: 'Начните вбивать никнейм или id' }" />
                </CCol>
            </CRow>
            <CRow>
                <CCol sm="12">
                    <CSelect prepend="Кто оплачивает комиссию?" :value.sync="feePayer"
                        :options="[{ label: 'Покупатель', value: 'buyer' }, { label: 'Продавец', value: 'seller' }]" />
                </CCol>
            </CRow>

            <CRow>
                <CCol sm="12">
                    <CSelect prepend="Способ оплаты" :value.sync="paymentMethodId" :options="paymentMethods" />
                    <CAlert style="height:10px; font-size:12px;" color="primary" class="d-flex align-items-center">
                        {{ pmString }}
                    </CAlert>
                </CCol>
            </CRow>
            <CRow>
                <CCol sm="4">
                    <CInput type="number" min="0" prepend="Сумма сделки" v-model="offerValue" />
                    <CAlert v-if="offerValue" style="height:10px; font-size:12px;" color="primary"
                        class="d-flex align-items-center">
                        {{ feeString }}
                    </CAlert>
                </CCol>
            </CRow>
            <CRow>
                <CCol sm="4">
                    <CInput type="date" prepend="Дата доставки" v-model="estimatedShipping" />
                </CCol>
                <CCol sm="4">
                    <CInput type="date" prepend="Последняя дата возврата" v-model="refundDetails" />
                </CCol>
            </CRow>
            <CRow>
                <CCol sm="4">
                    <CTextarea label="Детали" v-model="productDetails" />
                </CCol>
            </CRow>
            <CRow>
                <CCol sm="4">
                    <CTextarea label="Способ передачи товара" v-model="shippingDetails" />
                </CCol>
            </CRow>
            <CRow>
                <CCol sm="4">
                    <CTextarea label="Дополнительная информация" v-model="productAdditionalDetails" />
                </CCol>
            </CRow>
            <CRow>
                <CCol sm="4">
                    <CTextarea label="Прочее" v-model="restDetails" />
                </CCol>
            </CRow>
        </CCardBody>
        <CCardFooter>
            <CLoadingButton disabled-on-loading size="sm" shape="square" color="primary" style="margin-right:5px;">
                Сохранить и отправить
            </CLoadingButton>
            <CLoadingButton disabled-on-loading @click.native="drop()" shape="square" size="sm" color="danger">
                Сбросить
            </CLoadingButton>
        </CCardFooter>
    </CCard>
</template>
<script>
import a from '../assets/scripts/telegram-web-app.js'

export default {
    name: 'WebApp',
    data() {
        return {
            query: '',
            partnerVariants: [],
            feePayer: 'buyer',
            offerValue: '',
            paymentMethodId: '',
            estimatedShipping: '',
            refundDetails: '',
            productDetails: '',
            shippingDetails: '',
            productAdditionalDetails: '',
            restDetails: '',
            paymentMethods: [],
            partnerId: '',
        }
    },
    created: function () {
        this.$http({ method: "GET", url: `/v1/webapp/configs` }).then(res => {
            this.paymentMethods = res.data
            this.paymentMethodId = res.data[0].value
        })
    },
    mounted: function () {
        //console.log(window.Telegram.WebApp.initDataUnsafe)
    },
    methods: {
        fetchResults: function (value) {
            this.$http({ method: "GET", url: `/v1/webapp/user?partial=${value}` }).then(res => {
                this.partnerVariants = [{ data: res.data }]
            })
        },
        onSelected: function (selected) {
            this.partnerId = selected.item.id;
        },
        getSuggestionValue(suggestion) {
            return suggestion.item.username || suggestion.item.chatId
        },
        renderSuggestion(suggestion) {
            return `${suggestion.item.username || suggestion.item.chatId} ${+suggestion.item.offers} сделок, ${+suggestion.item.violations} нарушений`
        },
        drop() {
            this.feePayer = 'buyer'
            this.offerValue = ''
            this.paymentMethodId = this.paymentMethods[0].value
            this.estimatedShipping = ''
            this.refundDetails = ''
            this.productDetails = ''
            this.shippingDetails = ''
            this.productAdditionalDetails = ''
            this.restDetails = ''
        },
        getPmCode(pm){
            return pm.label == "Банковская карта" || pm.label == "QIWI" ? 'Руб' : pm.label
        }
    },
    computed: {
        feeString() {
            const paymentMethod = this.paymentMethods.find(pm => pm.value === this.paymentMethodId)
            return `Размер комиссии: ${Math.max((this.offerValue * paymentMethod.feePercent) / 100, paymentMethod.feeRaw)} ${this.getPmCode(paymentMethod)}`
        },
        pmString() {
            const pm = this.paymentMethods.find(pm => pm.value == this.paymentMethodId)
            const label = this.getPmCode(pm)
            return pm ? `${pm.minSum} - ${pm.maxSum} ${label}, комиссия ${pm.feeRaw} ${label} или ${pm.feePercent}%` : ''
        },
    }
}
</script>
<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
}

.avatar {
    height: 25px;
    width: 25px;
    border-radius: 20px;
    margin-right: 10px;
}


#autosuggest__input.autosuggest__input-open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.autosuggest__results-container {
    position: relative;
    width: 100%;
}

.autosuggest__results {
    font-weight: 300;
    margin: 0;
    position: absolute;
    z-index: 10000001;
    width: 100%;
    border: 1px solid #e0e0e0;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background: white;
    padding: 0px;
    max-height: 400px;
    overflow-y: scroll;
}

.autosuggest__results ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
}

.autosuggest__results .autosuggest__results-item {
    cursor: pointer;
    padding: 15px;
}

#autosuggest ul:nth-child(1)>.autosuggest__results_title {
    border-top: none;
}

.autosuggest__results .autosuggest__results-before {
    color: gray;
    font-size: 11px;
    margin-left: 0;
    padding: 15px 13px 5px;
    border-top: 1px solid lightgray;
}

.autosuggest__results .autosuggest__results-item:active,
.autosuggest__results .autosuggest__results-item:hover,
.autosuggest__results .autosuggest__results-item:focus,
.autosuggest__results .autosuggest__results-item.autosuggest__results-item--highlighted {
    background-color: #f6f6f6;
}
</style>