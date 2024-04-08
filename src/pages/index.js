import * as React from 'react'
import "./../helpers/styles/reset.scss"
import ChatBot from './../components/ChatBot/ChatBot'

const IndexPage = () => {
  return (
    <main>
      <ChatBot />
    </main>
  )
}

export default IndexPage

export const Head = () => <title>Kijk op de wijk</title>
