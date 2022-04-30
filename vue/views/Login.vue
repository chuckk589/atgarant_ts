<template>
  <main class="form-signin">
    <CCard>
      <CCardBody>
        <h2 class="h3 mb-4 fw-normal text-center">Авторизация</h2>
        <CForm>
          <CInput
            v-model="login"
            @input="clear"
            placeholder="Логин"
            :is-valid="isValid"
          />
          <CInput
            @input="clear"
            type="password"
            invalid-feedback="Указаны неверные данные"
            v-model="password"
            placeholder="Пароль"
            :is-valid="isValid"
          />
        </CForm>
        <CButton class="w-100 btn btn-lg" color="primary" @click="auth"
          >Войти</CButton
        >
      </CCardBody>
    </CCard>
    <p class="mt-3 mb-3 text-muted text-center">
      © 2020–2022
      <a href="https://t.me/ATgarantBot" target="_blank">ATgarantBot</a>
    </p>
  </main>
</template>

<script>
export default {
  data() {
    return {
      login: "",
      password: "",
      isValid: undefined,
    };
  },
  created() {
    if (Object.keys(this.$route.query).length !== 0) {
      this.login = this.$route.query.l;
      this.password = this.$route.query.p;
      this.$router.replace({ query: {} });
    }
  },
  methods: {
    clear() {
      this.isValid = undefined;
    },
    auth() {
      if (!(this.login && this.password)) {
        this.isValid = false;
        return;
      }
      this.$http
        .post("/auth/login", {
          username: this.login,
          password: this.password,
        })
        .then((res) => {
          localStorage.setItem("jwt", res.data.access_token);
          this.isValid = true;
          this.$router.push({ name: "Offers", params: { skipAuth: true } });
        })
        .catch(() => (this.isValid = false));
    },
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}
.form-group:last-child {
  height: 50px;
}
.form-signin {
  width: 100%;
  max-width: 450px;
  margin: auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
label {
  font-weight: 600;
}
</style>