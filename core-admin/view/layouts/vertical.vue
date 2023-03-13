<template>
  <!-- Begin page -->
  <div id="layout-wrapper">
    <Topbar />
    <Sidebar type="light" width="fluid" />
    <!-- ============================================================== -->
    <!-- Start right Content here -->
    <!-- ============================================================== -->
    <div class="main-content">
      <div class="page-content">
        <div class="container-fluid">
          <Nuxt />
        </div>
      </div>
      <!-- End Page-content -->
      <Footer />
    </div>
    <!-- end main content-->
    <notifications
        group="notif"
        position="top right" />
  </div>
  <!-- END layout-wrapper -->
</template>

<script>
import { mapState } from "vuex";

/**
 * Vertical layout
 */
export default {
  name: "Vertical",
  data() {
    return {};
  },
  computed: mapState(["layout"]),
  created() {
    // document.body.removeAttribute("data-layout");
    // document.body.removeAttribute("data-topbar");
  },
  methods: {
    toggleRightSidebar() {
      document.body.classList.toggle("right-bar-enabled");
    },
    hideRightSidebar() {
      document.body.classList.remove("right-bar-enabled");
    },
    toggleMenu() {
      document.body.classList.toggle("sidebar-enable");

      if (window.screen.width >= 992) {
        // eslint-disable-next-line no-unused-vars
        this.$router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
          document.body.classList.remove("vertical-collpsed");
        });
        document.body.classList.toggle("vertical-collpsed");
      } else {
        // eslint-disable-next-line no-unused-vars
        this.$router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
        });
        document.body.classList.remove("vertical-collpsed");
      }
      this.isMenuCondensed = !this.isMenuCondensed;
    },
  }
};
</script>