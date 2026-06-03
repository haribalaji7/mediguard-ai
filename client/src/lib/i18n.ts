import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './translations/en.json'
import hi from './translations/hi.json'
import ta from './translations/ta.json'
import te from './translations/te.json'
import bn from './translations/bn.json'

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    ta: { translation: ta },
    te: { translation: te },
    bn: { translation: bn },
  },
  lng: savedLang || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
