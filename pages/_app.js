import '../styles/globals.css'
import Head from 'next/head'
import { AuthProvider } from '../context/AuthContext'
import CustomCursor from '../components/CustomCursor'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>MindVeda - Healing & Growth</title>
      </Head>
      <AuthProvider>
        <CustomCursor />
        <Component {...pageProps} />
      </AuthProvider>
    </>
  )
}
