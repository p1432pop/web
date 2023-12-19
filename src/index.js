import React from "react";
import ReactDOM from "react-dom/client";
import store from "./app/store";
import { Provider } from "react-redux";
import App from "./App";
import { StyledEngineProvider } from "@mui/styled-engine";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<StyledEngineProvider injectFirst>
				<App />
			</StyledEngineProvider>
		</Provider>
	</React.StrictMode>
);
