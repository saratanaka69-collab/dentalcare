import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      const language = document.documentElement.lang
      const messages = language === 'ar'
        ? { title: 'تجربة أوضح ستصل قريباً.', body: 'حدثت مشكلة في العرض. أعد تحميل الصفحة للمحاولة مرة أخرى.', action: 'إعادة التحميل' }
        : language === 'en'
          ? { title: 'A clearer experience is on its way.', body: 'A display issue occurred. Reload the page to try again.', action: 'Reload' }
          : { title: 'Une expérience plus claire arrive.', body: 'Un problème d’affichage est survenu. Rechargez la page pour réessayer.', action: 'Recharger' }
      return <main className="runtime-error"><span className="eyebrow">DENTALCARE</span><h1>{messages.title}</h1><p>{messages.body}</p><button className="button button-primary" onClick={() => window.location.reload()}>{messages.action}</button></main>
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><ErrorBoundary><App /></ErrorBoundary></React.StrictMode>)
