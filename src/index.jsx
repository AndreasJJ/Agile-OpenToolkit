import React from 'react'
import { render } from 'react-dom'
import { App } from "./App"
import { Provider } from 'react-redux'
import { store } from './state/store/store'

import { saveState } from './state/helpers/localstorage'

store.subscribe(() => {
	saveState(store.getState())
})

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("app")
);

module.hot.accept();