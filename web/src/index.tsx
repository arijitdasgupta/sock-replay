import ReactDOM from 'react-dom'
import React from 'react'
import { ForwardMessage, InitialMessage } from '../../common/lib/messages'
import { Tester } from './components/Tester'

const mainDiv = document.createElement('div')
document.body.appendChild(mainDiv)

// Rendering the tester application
ReactDOM.render(<Tester />, mainDiv)
