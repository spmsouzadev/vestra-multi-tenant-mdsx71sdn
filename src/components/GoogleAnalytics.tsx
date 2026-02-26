import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
    [key: string]: any // To allow dynamic properties like ga-disable-ID
  }
}

export function GoogleAnalytics() {
  const location = useLocation()
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
  const { consents } = useAppStore()

  useEffect(() => {
    if (!measurementId) return

    // If analytics consent is rejected, disable GA explicitly
    if (!consents.analytics) {
      window[`ga-disable-${measurementId}`] = true
      return
    }

    // Enable GA if previously disabled
    window[`ga-disable-${measurementId}`] = false

    if (!document.getElementById('ga-script')) {
      const script1 = document.createElement('script')
      script1.id = 'ga-script'
      script1.async = true
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      document.head.appendChild(script1)

      const script2 = document.createElement('script')
      script2.id = 'ga-config'
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${measurementId}', { send_page_view: false });
      `
      document.head.appendChild(script2)
    }
  }, [measurementId, consents.analytics])

  useEffect(() => {
    if (!measurementId || !consents.analytics) return

    const handlePageView = () => {
      if (window.gtag && !window[`ga-disable-${measurementId}`]) {
        window.gtag('event', 'page_view', {
          page_path: location.pathname + location.search,
          page_location: window.location.href,
          page_title: document.title,
        })
      }
    }

    // Small delay to ensure route changes reflect in document.title if necessary
    const timeoutId = setTimeout(handlePageView, 100)

    return () => clearTimeout(timeoutId)
  }, [location, measurementId, consents.analytics])

  return null
}
