<template>
  <CHeader with-subheader>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="$store.commit('toggleSidebarMobile')"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="$store.commit('toggleSidebarDesktop')"
    />
    <CHeaderBrand
      class="mx-auto d-lg-none"
      src="img/brand/coreui-vue-pro-logo.svg"
      width="190"
      height="46"
      alt="CoreUI Logo"
    />
    <CHeaderNav class="d-md-down-none mr-auto">
      <CHeaderNavItem  class="px-3" v-if="isAdmin">
        <CHeaderNavLink to="/settings">
          Настройки
        </CHeaderNavLink>
      </CHeaderNavItem>
      <!-- <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/offers">
          Offers
        </CHeaderNavLink>
      </CHeaderNavItem> -->
    </CHeaderNav>
    <CHeaderNav>
      <CHeaderNavItem class="px-3">
        <button
          @click="() => $store.commit('toggle', 'darkMode')"
          class="c-header-nav-btn"
        >
          <CIcon v-if="$store.state.darkMode" name="cil-sun"/>
          <CIcon v-else name="cil-moon"/>
        </button>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <button
          class="c-header-nav-btn"
          @click="$store.commit('toggle', 'asideShow')"
        >
          <CIcon size="lg" name="cil-applications-settings" class="mr-2"/>
        </button>
      </CHeaderNavItem>
    </CHeaderNav>

    <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0 mb-0"/>
    </CSubheader>
  </CHeader>
</template>

<script>
import mixin from '../mixins/userData'

export default {
  name: 'TheHeader',
  mixins: [mixin]
}
</script>
