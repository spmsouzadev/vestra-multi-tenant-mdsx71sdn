import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

export function GoogleAnalytics() {
  const location = useLocation()
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

  useEffect(() => {
    if (!measurementId) return

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
  }, [measurementId])

  useEffect(() => {
    if (!measurementId) return

    const handlePageView = () => {
      if (window.gtag) {
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
  }, [location, measurementId])

  return null
}
