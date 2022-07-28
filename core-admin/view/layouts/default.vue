<template>
  <div>
    <!-- Begin page -->
    <Vertical>
      <Nuxt />
    </Vertical>
    <!-- END layout-wrapper -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import Vertical from "./vertical";

export default {
  middleware: 'auth',
  components: {
    Vertical,
  },
  computed: mapState(["layout"]),
  mounted() {
    document.body.classList.remove("authentication-bg");
  },
};
</script>
