// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    locale: {
      locale: 'en-GB',
      messages: {
        'en-GB': {
          "open": 'Open',
          input: {
            clear: 'Clear',
          },
          confirmEdit: {
            ok: 'OK',
            cancel: 'Cancel'
          },
          // datePicker: {
          //   header: 'Select date',
          // }
        }
      }
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#8AA73B',
            secondary: '#585858',
            accent: '#DCDFED',
            error: '#dc3545',
            info: '#17a2b8',
            success: '#28a745',
            warning: '#ffc107',
            lightGrey: '#9E9E9E',
            gold: '#D3AF37',
            bronze: '#CE8946'
          }
        }
      }
    }
  })
  app.vueApp.use(vuetify)
})
