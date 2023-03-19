import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GoodsPage from './pages/goods-page/GoodsPage';
import Main from './components/main/Main';
import NotFoundPage from './pages/not-found-page/NotFoundPage';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
import Auth from './components/infrastructure/Auth';
import LoginPage from './pages/login-page/LoginPage';
import InventoryListPage from './pages/inventorylist-page/InventoryListPage';
import InventoryPage from './pages/inventory-page/inventoryPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: <Main />,
    children: [
      {
        index: true,
        element: <Auth><GoodsPage /></Auth>
      },
      {
        path:"goods",
        element:<Auth><GoodsPage /></Auth>
      },
      {
        path:"documents/inventorylist",
        element: <Auth><InventoryListPage /></Auth>
      },
      /*
      {
        path:"inventory",
        element: <Auth><InventoryPage /></Auth>
      },
      */
      {
        path:"documents/inventory/:id?",
        element: <Auth><InventoryPage /></Auth>
      },
    ],
    errorElement: <NotFoundPage />
  }
])
root.render(
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <RouterProvider router={router}>
          <Main />
        </RouterProvider>
      </PersistGate>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();