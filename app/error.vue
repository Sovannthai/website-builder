<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row justify="center" class="text-center">
      <v-col cols="12" md="6">
        <v-card
          elevation="4"
          rounded="2xl"
          class="pa-10"
          color="surface"
        >
          <div class="text-h1 font-weight-bold text-primary mb-4">
            404
          </div>

          <h2 class="text-h5 font-weight-medium mb-2">
            Page Not Found
          </h2>

          <p class="text-body-1 text-grey mb-8">
            Sorry, the page you’re looking for doesn’t exist or has been moved.
          </p>

          <div class="d-flex justify-center gap-4 flex-wrap">
            <v-btn
              color="primary"
              size="large"
              to="/"
              class="mr-4"
            >
              Go Home
            </v-btn>

            <v-btn
              variant="outlined"
              size="large"
              @click="goBack"
            >
              Go Back
            </v-btn>
          </div>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const goBack = () => {
  window.history.length > 1
    ? window.history.back()
    : window.location.href = "/"
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fill-height {
  min-height: 100vh;
}

.error-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(33, 150, 243, 0);
  }
}

.error-icon {
  font-size: 80px !important;
  color: #2196f3;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.error-code {
  font-size: 120px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -5px;
  text-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.error-title {
  color: #2c3e50;
  animation: slideIn 0.6s ease 0.2s both;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.error-description {
  color: #5a6c7d;
  line-height: 1.8;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  animation: slideIn 0.6s ease 0.4s both;
}

.error-actions {
  gap: 16px;
  animation: slideIn 0.6s ease 0.6s both;
}

.error-actions .v-btn {
  text-transform: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.error-actions .v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(33, 150, 243, 0.3);
}

.decorative-dots {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
}

.dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.1;
}

.dot-1 {
  top: 10%;
  left: 10%;
  animation: float 3s ease-in-out infinite;
}

.dot-2 {
  top: 80%;
  right: 15%;
  animation: float 4s ease-in-out infinite 1s;
}

.dot-3 {
  bottom: 15%;
  left: 15%;
  animation: float 3.5s ease-in-out infinite 0.5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.2);
  }
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .error-code {
    font-size: 80px;
    letter-spacing: -3px;
  }
  
  .error-icon-wrapper {
    width: 100px;
    height: 100px;
  }
  
  .error-icon {
    font-size: 60px !important;
  }
  
  .error-title {
    font-size: 1.75rem !important;
  }
  
  .error-description {
    font-size: 0.95rem;
    padding: 0 8px;
  }
  
  .error-actions .v-btn {
    width: 100%;
  }
}

.gap-3 {
  gap: 12px;
}
</style>
