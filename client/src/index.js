import React from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import LoadingSpinner from "./LoadingSpinner";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker({area: props.area});
  return (
    promiseInProgress && <LoadingSpinner area="image"/>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <LoadingIndicator/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
