// import Header from '~/components/Header.vue'
import Navigation from '~/components/Navigation.vue'
import AppHeader from '~/components/AppHeader.vue'
import Slider from '~/components/Slider.vue'
import Features from '~/components/Features.vue'
import Content from '~/components/Content.vue'
import Stats from '~/components/Stats.vue'
import Gallery from '~/components/Gallery.vue'
import Testimonials from '~/components/Testimonials.vue'
import BlogPreview from '~/components/BlogPreview.vue'
import CTA from '~/components/CTA.vue'
import ContactForm from '~/components/ContactForm.vue'
import Footer from '~/components/Footer.vue'
import Banner from '~/components/Banner.vue'
import AppFeatureCategory from '~/components/AppFeatureCategory.vue'

export const componentMap: Record<string, any> = {
  // header: Header,
  app_header: AppHeader,
  banner: Banner,
  navigation: Navigation,
  slider: Slider,
  features: Features,
  content: Content,
  stats: Stats,
  gallery: Gallery,
  testimonials: Testimonials,
  blog_preview: BlogPreview,
  cta: CTA,
  contact_form: ContactForm,
  footer: Footer,
  app_feature_category: AppFeatureCategory,
}

console.log('Component Map')