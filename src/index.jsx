import React from 'react'
import { render } from 'react-dom'
import { App } from "./App"
import { Provider } from 'react-redux'
import { store } from './state/store/store'
import Firebase, { FirebaseContext } from './sharedComponents/Firebase';
import { ErrorBoundary } from './sharedComponents/ErrorBoundary'

import { saveState } from './state/helpers/localstorage'

store.subscribe(() => {
	saveState(store.getState())
})

render(
	<Provider store={store}>
		<FirebaseContext.Provider value={new Firebase()}>
            <ErrorBoundary>
			    <App />
            </ErrorBoundary>
		</FirebaseContext.Provider>
	</Provider>,
	document.getElementById("app")
);

// Enable hot reload on development build
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	module.hot.accept();
}
