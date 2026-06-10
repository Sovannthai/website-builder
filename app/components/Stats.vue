<template>
  <ContainerWrapper class="py-16" bg-color="#A9CDEB">
    <SectionText :title="title">
      <template #content>
        <v-row justify="center" align="stretch" class="mt-6">
          <v-col
            v-for="(item, index) in items"
            :key="index"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              class="stat-card text-center py-10 px-4"
              elevation="8"
              rounded="xl"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <!-- Icon -->
              <div class="stat-icon-wrapper mb-4">
                <v-icon 
                  :icon="item.icon || 'mdi-chart-line'" 
                  size="48"
                  color="primary"
                  class="stat-icon"
                ></v-icon>
              </div>

              <!-- Value with animation -->
              <v-card-title class="stat-value text-h2 font-weight-bold mb-2">
                <span class="number-counter">{{ item.value }}</span>
                <span v-if="item.suffix" class="text-primary">{{ item.suffix }}</span>
              </v-card-title>
    
              <!-- Label -->
              <v-card-subtitle class="stat-label text-h6 font-weight-medium px-2">
                {{ item.label }}
              </v-card-subtitle>

              <!-- Optional description -->
              <v-card-text v-if="item.description" class="text-body-2 text-medium-emphasis mt-2">
                {{ item.description }}
              </v-card-text>

              <!-- Decorative element -->
              <div class="stat-decoration"></div>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </SectionText>
  </ContainerWrapper>
</template>

<script setup>
defineProps({
  title: String,
  items: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.stat-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(54, 130, 194, 0.1);
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

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(54, 130, 194, 0.25) !important;
}

.stat-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(54, 130, 194, 0.1) 0%, rgba(54, 130, 194, 0.05) 100%);
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, rgba(54, 130, 194, 0.2) 0%, rgba(54, 130, 194, 0.1) 100%);
}

.stat-icon {
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1);
}

.stat-value {
  color: #2c3e50;
  line-height: 1.2;
  letter-spacing: -1px;
}

.number-counter {
  background: linear-gradient(135deg, #3682C2 0%, #2c6ba0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  color: #5a6c7d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.95rem !important;
}

.stat-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3682C2 0%, #5ba3d0 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.stat-card:hover .stat-decoration {
  transform: scaleX(1);
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .stat-value {
    font-size: 2.5rem !important;
  }
  
  .stat-icon-wrapper {
    width: 64px;
    height: 64px;
  }
  
  .stat-icon {
    font-size: 36px !important;
  }
}
</style>
