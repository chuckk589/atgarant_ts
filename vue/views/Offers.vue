<template>
  <div>
    <CExtendedModal
      @modal-closed="closeModalHandler()"
      :vis="modalConfig.show"
      :mData="modalConfig.data"
    >
      <template #type="{ item }">
        <CSelect
          label="Тип отзыва"
          :options="[
            { value: 'positive', label: 'Положительный' },
            { value: 'negative', label: 'Отрицательный' },
          ]"
          :value.sync="item.value"
        />
      </template>
      <template #text="{ item }">
        <CTextarea label="Текст отзыва" :value.sync="item.value"></CTextarea>
      </template>
    </CExtendedModal>
    <CDataTable :items="offers" :fields="fields" sorter columnFilter>
      <template #initiator="{ item }"
        ><td data-label="Инициатор сделки">
          {{ item.initiator.username || item.initiator.chat_id }}
        </td></template
      >
      <template #offerStatus="{ item }"
        ><td data-label="Статус сделки">
          {{ item.offerStatus.name }}
        </td></template
      >
      <template #partner="{ item }"
        ><td data-label="Компаньон">
          {{ item.partner.username || item.partner.chat_id }}
        </td></template
      >
      <template #paymentMethod="{ item }"
        ><td data-label="Способ оплаты">
          {{ item.paymentMethod.name }}
        </td></template
      >
      <template #createdAt="{ item }"
        ><td data-label="Дата создания">
          {{ new Date(item.createdAt).toLocaleString() }}
        </td></template
      >
      <template #role="{ item }"
        ><td data-label="Роль инициатора">
          {{ item.role === "seller" ? "Продавец" : "Покупатель" }}
        </td></template
      >
      <template #action="{ item }">
        <td>
          <CDropdown toggler-text="Действия" class="m-2" color="secondary">
            <CDropdownItem
              @click="nextStepAction(item)"
              v-if="isOwner(item) && isSeller(item)"
              :disabled="item.offerStatus.value !== 'payed'"
              >Подтвердить отправку</CDropdownItem
            >
            <CDropdownItem @click="setWallet(item)" v-if="isOwner(item)"
              >Указать кошелек</CDropdownItem
            >
            <CDropdownItem
              @click="receivePayout(item)"
              v-if="isOwner(item) && isSeller(item)"
              :disabled="isPayable(item)"
              >Получить выплату</CDropdownItem
            >
            <CDropdownItem
              @click="nextStepAction(item)"
              v-if="isOwner(item) && !isSeller(item)"
              :disabled="item.offerStatus.value !== 'shipped'"
              >Подтвердить получение</CDropdownItem
            >
            <CDropdownItem
              @click="leaveFeedback(item)"
              v-if="isFeedbackable(item)"
              >Оставить отзыв</CDropdownItem
            >
            <!-- <CDropdownItem @click="nextStepAction(item)" v-if="userData.id == item.initiator.id">Повторно согласовать</CDropdownItem> -->
            <CDropdownItem
              @click="openArbitrary(item)"
              v-if="isOwner(item)"
              :disabled="
                item.offerStatus.value === 'closed' ||
                item.offerStatus.value === 'arbitrary' ||
                item.offerStatus.value === 'pending'
              "
              >Арбитраж</CDropdownItem
            >
          </CDropdown>
        </td>
      </template>
    </CDataTable>
  </div>
</template>

<script>
import CExtendedModal from "../containers/CExtendedModal.vue";
import mixin from "../mixins/userData";
export default {
  name: "Offers",
  components: {
    CExtendedModal,
  },
  mixins: [mixin],
  data() {
    return {
      modalConfig: {
        show: false,
        data: {},
      },
      offers: [],
      fields: [
        { key: "id", label: "Id" },
        { key: "offerValue", label: "Сумма сделки" },
        { key: "initiator", label: "Инициатор сделки" },
        { key: "partner", label: "Компаньон" },
        { key: "offerStatus", label: "Статус сделки" },
        { key: "paymentMethod", label: "Способ оплаты" },
        { key: "productAdditionalDetails", label: "Доп. детали" },
        { key: "productDetails", label: "Детали" },
        { key: "refundDetails", label: "Возврат" },
        { key: "restDetails", label: "Остальное" },
        { key: "role", label: "Роль инициатора" },
        { key: "sellerWalletData", label: "Кошелек продавца" },
        { key: "buyerWalletData", label: "Кошелек покупателя" },
        { key: "shippingDetails", label: "Доставка" },
        { key: "createdAt", label: "Дата создания" },
        { key: "action", label: "", filter: false, sorter: false },
      ],
    };
  },
  mounted: function () {
    this.$http({
      method: "GET",
      url: `/v1/offer?userId=${
        this.userData.role === 1 ? "" : this.userData.id
      }`,
    }).then((e) => {
      this.offers =
        this.userData.role === 1
          ? e.data
          : e.data.filter(
              (o) =>
                !(
                  o.partner.id == this.userData.id &&
                  o.offerStatus.value == "pending"
                )
            );
    });
  },
  methods: {
    leaveFeedback(item) {
      this.modalConfig.data = {
        cur: item,
        fields: [
          { label: "text", value: "" },
          { label: "type", value: "positive" },
        ],
        footer: "Сохранить",
        header: "Редактировать",
        type: "feedback",
      };
      this.modalConfig.show = true;
    },
    setWallet(item) {
      this.modalConfig.data = {
        cur: item,
        fields: [
          {
            label: "Кошелек",
            value: this.isSeller(item)
              ? item.sellerWalletData
              : item.buyerWalletData,
          },
        ],
        footer: "Сохранить",
        header: "Редактировать",
        type: "wallet",
      };
      this.modalConfig.show = true;
    },
    openArbitrary(item) {
      this.modalConfig.data = {
        cur: item,
        fields: [{ label: "Причина", value: "" }],
        footer: "Отправить",
        header: "Обращение в арбитраж",
        type: "arbitrary",
      };
      this.modalConfig.show = true;
    },
    closeModalHandler() {
      if (this.modalConfig.data.type == "wallet") {
        const newWalletData = this.modalConfig.data.fields.find(
          (f) => f.label == "Кошелек"
        ).value;
        const isSeller = this.isSeller(this.modalConfig.data.cur);
        this.$http({
          method: "PUT",
          url: `/v1/offer/${this.modalConfig.data.cur.id}/`,
          data: { seller: isSeller, walletData: newWalletData },
        }).then((res) => {
          if (res.data.status !== "error") {
            this.modalConfig.data.cur[
              isSeller === true ? "sellerWalletData" : "buyerWalletData"
            ] = newWalletData;
          } else {
            alert("Кошелек указан неверно");
          }
        });
      } else if (this.modalConfig.data.type == "arbitrary") {
        const reason = this.modalConfig.data.fields.find(
          (f) => f.label == "Причина"
        ).value;
        this.$http({
          method: "POST",
          url: `/v1/offer/${this.modalConfig.data.cur.id}/arbitrary/`,
          data: {
            reason: reason,
            initiator: this.userData.id,
          },
        }).then((e) => {
          Object.assign(
            this.offers.find((o) => o.id === this.modalConfig.data.cur.id)
              .offerStatus,
            e.data.newStatus
          );
        });
      } else if (this.modalConfig.data.type == "feedback") {
        const type = this.modalConfig.data.fields.find(
          (f) => f.label == "type"
        ).value;
        const text = this.modalConfig.data.fields.find(
          (f) => f.label == "text"
        ).value;
        this.$http({
          method: "POST",
          url: `/v1/review/`,
          data: {
            offerId: this.modalConfig.data.cur.id,
            authorId: this.userData.id,
            recipientId:
              this.modalConfig.data.cur.partnerId === this.userData.id
                ? this.modalConfig.data.cur.initiatorId
                : this.modalConfig.data.cur.partnerId,
            rate: type,
            text: text,
          },
        }).then(() => {
          this.modalConfig.data.cur.reviews.push({
            authorId: this.userData.id,
          });
        });
      }
    },
    receivePayout(item) {
      // data:{sellerWalletData:item.sellerWalletData }
      this.$http({ method: "POST", url: `/v1/offer/${item.id}/action/` }).then(
        (e) => {
          if (e.status !== "error") {
            Object.assign(
              this.offers.find((o) => o.id === item.id).offerStatus,
              e.data.newStatus
            );
          }
        }
      );
    },
    isPayable(item) {
      return !(item.offerStatus.value === "arrived" && item.sellerWalletData);
    },
    isSeller(item) {
      const seller =
        item.role === "seller" ? item.initiator.id : item.partner.id;
      return seller === this.userData.id;
    },
    isFeedbackable(item) {
      return (
        item.offerStatusId > 5 &&
        !item.reviews.find((r) => r.authorId === this.userData.id)
      );
    },
    isOwner(item) {
      return (
        this.userData.id === item.initiator.id ||
        this.userData.id === item.partner.id
      );
    },
    nextStepAction(offer) {
      this.$http({ method: "POST", url: `/v1/offer/${offer.id}/action/` }).then(
        (e) => {
          if (e.status !== "error") {
            offer.offerStatus = Object.assign({}, e.data.newStatus);
          }
        }
      );
    },
  },
};
</script>
<style >
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
    border-radius: 2px;
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