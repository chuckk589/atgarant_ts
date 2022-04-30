<template>
  <div>
    <CExtendedModal
      :disableFooter="socketModal"
      @modal-closed="closeModalHandler()"
      :vis="modalConfig.show"
      :mData="modalConfig.data"
    >
      <template #content>
        <CAlert v-if="modalConfig.data.cur.description" show color="success">
          <pre>{{ modalConfig.data.cur.description }}</pre>
        </CAlert>
        <div v-if="socketModal">
          <CInput
            type="tel"
            placeholder="Номер привязки телеграма"
            autocomplete="tel"
            v-model="modalConfig.data.phone"
          >
            <template #append>
              <CButton @click="telegramGetPhone" color="primary"
                >Получить код</CButton
              >
            </template>
          </CInput>
          <CInput
            v-if="modalConfig.data.step == 1"
            placeholder="Код"
            v-model="modalConfig.data.code"
          >
            <template #append>
              <CButton @click="telegramSendCode" color="primary"
                >Отправить</CButton
              >
            </template>
          </CInput>
        </div>
      </template>
    </CExtendedModal>
    <CRow>
      <CCol>
        <CCard>
          <CCardBody>
            <CTabs class="configTabs">
              <CTab
                :active="index === 0"
                v-for="(tab, index) in tabs"
                :key="index"
                :title="tab"
              >
                <div v-if="tab == 'Payments'">
                  <CListGroup class="configRow">
                    <CListGroupItem
                      v-for="(config, index) in configs[tab].Payments"
                      :key="index"
                    >
                      <CRow>
                        <CCol>{{ config.name }}</CCol>
                        <CCol>{{ config.value }}</CCol>
                        <CCol>{{
                          config.requiresReboot === 1
                            ? "Требуется перезагрузка"
                            : ""
                        }}</CCol>
                        <CCol
                          ><CIcon
                            @click.native="openConfigModal(config)"
                            name="cil-cog"
                            height="18"
                            width="18"
                        /></CCol>
                      </CRow>
                    </CListGroupItem>
                  </CListGroup>
                  <CCard v-for="(payment, name) in getPayments" :key="name">
                    <CCardHeader>
                      {{ name.split("_").pop() }}
                    </CCardHeader>
                    <CCardBody>
                      <CListGroup class="configRow">
                        <CListGroupItem
                          v-for="(config, index) in payment"
                          :key="index"
                        >
                          <CRow>
                            <CCol>{{ config.name }}</CCol>
                            <CCol>{{ config.value }}</CCol>
                            <CCol>{{
                              config.requiresReboot === 1
                                ? "Требуется перезагрузка"
                                : ""
                            }}</CCol>
                            <CCol
                              ><CIcon
                                @click.native="openConfigModal(config)"
                                name="cil-cog"
                                height="18"
                                width="18"
                            /></CCol>
                          </CRow>
                        </CListGroupItem>
                      </CListGroup>
                    </CCardBody>
                  </CCard>
                </div>
                <CListGroup v-else class="configRow">
                  <CListGroupItem
                    v-for="(config, index) in configs[tab]"
                    :key="index"
                  >
                    <CRow>
                      <CCol>{{ config.name }}</CCol>
                      <CCol>{{ config.value }}</CCol>
                      <CCol>{{
                        config.requiresReboot === 1
                          ? "Требуется перезагрузка"
                          : ""
                      }}</CCol>
                      <CCol
                        ><CIcon
                          @click.native="openConfigModal(config)"
                          name="cil-cog"
                          height="18"
                          width="18"
                      /></CCol>
                    </CRow>
                  </CListGroupItem>
                </CListGroup>
              </CTab>
              <CTab disabled>
                <template #title
                  ><CButton color="primary" @click="reboot" class="reboot-btn"
                    >Перезагрузка</CButton
                  ></template
                >
              </CTab>
            </CTabs>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
const { io } = require("socket.io-client");
import CExtendedModal from "../containers/CExtendedModal.vue";
import mixin from "../mixins/userData";

export default {
  name: "Settings",
  components: {
    CExtendedModal,
  },
  mixins: [mixin],
  data() {
    return {
      socket: null,
      modalConfig: {
        show: false,
        data: {
          cur: {},
        },
      },
      configs: { Payments: {} },
      tabs: ["Payments"],
    };
  },
  mounted: function () {
    if (!this.isAdmin) {
      this.$router.push("/login");
    }
    console.log(
      typeof webpackHotUpdate !== "undefined" ? "http://localhost:3000/" : null
    );
    this.socket = io(
      // typeof webpackHotUpdate !== "undefined" ? "http://localhost:3000/" : null,
      null,
      { autoConnect: false }
    );
    this.socket.on("done", (result) => {
      this.socket.disconnect();
      this.modalConfig.show = false;
      if (result.error) {
        alert(JSON.stringify(result.error));
      } else if (result.session) {
        this.modalConfig.data.cur.value = result.session;
        //console.log(result.session)
      }
    });
    this.$http({ method: "GET", url: `/v1/config/` }).then((e) => {
      this.configs = e.data.reduce((sum, cur) => {
        if (cur.category !== "config") {
          if (cur.category.includes("Payments")) {
            sum.Payments = sum.Payments || { [cur.category]: [] };
            sum.Payments[cur.category] = sum.Payments[cur.category] || [];
            sum.Payments[cur.category].push(cur);
          } else {
            sum[cur.category] = sum[cur.category] || [];
            sum[cur.category].push(cur);
            if (!this.tabs.includes(cur.category)) this.tabs.push(cur.category);
          }
        }
        return sum;
      }, {});
    });
  },
  computed: {
    getPayments() {
      const { Payments, ...rest } = this.configs.Payments;
      return rest;
    },
    socketModal() {
      return this.modalConfig.data.cur.name == "APP_SESSION_STRING";
    },
  },
  methods: {
    telegramSendCode() {
      this.socket.emit("code", this.modalConfig.data.code, (data) => {
        console.log(data);
      });
    },
    telegramGetPhone() {
      if (this.modalConfig.data.phone) {
        this.modalConfig.data.loading = true;
        this.socket.connect();
        this.socket.emit("phoneCode", this.modalConfig.data.phone, (data) => {
          this.modalConfig.data.step = 1;
          this.modalConfig.data.loading = false;
        });
      }
    },
    reboot() {
      this.$http({ method: "GET", url: `/v1/config/reboot` });
    },
    openConfigModal(config) {
      if (config.name == "APP_SESSION_STRING") {
        this.modalConfig.data = {
          cur: config,
          step: 0,
          phone: "",
          code: "",
          loading: false,
          header: "Привязка аккаунта",
          type: "telegram",
        };
      } else if (config.name == "PAYMENT_SERVICE") {
        this.modalConfig.data = {
          cur: config,
          fields: [
            {
              label: "Значение",
              value: config.value,
              select: [
                { label: "btc-core", value: "btc-core" },
                { label: "coin-payments", value: "coin-payments" },
              ],
            },
          ],
          footer: "Сохранить",
          header: "Редактировать",
          type: "config",
        };
      } else {
        this.modalConfig.data = {
          cur: config,
          fields: [{ label: "Значение", value: config.value }],
          footer: "Сохранить",
          header: "Редактировать",
          type: "config",
        };
      }
      this.modalConfig.show = true;
    },
    closeModalHandler() {
      if (this.modalConfig.data.type == "config") {
        this.$http({
          method: "PUT",
          url: `/v1/config/`,
          data: {
            id: this.modalConfig.data.cur.id,
            name: this.modalConfig.data.cur.name,
            value: this.modalConfig.data.fields[0].value,
          },
        }).then((res) => {
          if (!res.data.error) {
            this.modalConfig.data.cur.value =
              this.modalConfig.data.fields[0].value;
            this.modalConfig.show = false;
          } else {
            alert("Неверный формат данных");
          }
        });
      }
    },
  },
};
</script>
<style>
.configRow .col {
  white-space: nowrap;
  overflow: hidden;
}
.configRow .col:not(:last-child) {
  display: flex;
  justify-content: center;
}
.configTabs ul {
  border-bottom: none;
}
.configRow .col svg {
  float: right;
}
.nav.nav-tabs li:last-child a {
  padding: 0;
  pointer-events: all;
}
.nav.nav-tabs li:last-child {
  margin-left: auto;
}
.reboot-btn {
  padding: 0.3rem 0.75rem;
}
</style>