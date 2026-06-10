<template>
  <footer class="footer-block">
    <div class="footer-inner">
      <div class="footer-top">
        <span class="footer-logo">Pixel Rise</span>
        <span class="footer-email">If you have any inquiry, please contact us via this email: <strong>info@example.com</strong></span>
      </div>
      <hr class="footer-divider" />
      <div class="footer-copy">
        All rights reserved. {{ new Date().getFullYear() }} Pixel Rise Co, Ltd
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer-block {
  border-top: 1px solid #ebebeb;
  background: #fff;
}
.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem;
}
.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.footer-logo {
  font-weight: 700;
  font-size: 1rem;
}
.footer-email {
  font-size: 0.85rem;
  color: #555;
}
.footer-divider {
  border: none;
  border-top: 1px solid #ebebeb;
  margin: 1rem 0;
}
.footer-copy {
  text-align: center;
  font-size: 0.78rem;
  color: #888;
}
</style>
