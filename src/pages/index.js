import * as React from 'react'
import "./../helpers/styles/reset.scss"
import ChatBot from './../components/ChatBot/ChatBot'

const IndexPage = () => {
  return (
    <main>
      <ChatBot />
      <div id="mobile-warning">
        Please view on a mobile device
      </div>
    </main>
  )
}

export default IndexPage

export const Head = () => <title>Kijk op de wijk</title>
