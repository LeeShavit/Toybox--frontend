
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { RootCmp } from './RootCmp'
import './assets/style/main.scss'


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
		<Router>
			<RootCmp />
		</Router>
)
