import React from 'react'
import { render } from 'react-dom'
import { App } from "./App"
import { Provider } from 'react-redux'
import { store } from './state/store/store'
import Firebase, { FirebaseContext } from './sharedComponents/Firebase';

import { saveState } from './state/helpers/localstorage'

store.subscribe(() => {
	saveState(store.getState())
})

render(
	<Provider store={store}>
		<FirebaseContext.Provider value={new Firebase()}>
			<App />
		</FirebaseContext.Provider>
	</Provider>,
	document.getElementById("app")
);

module.hot.accept();