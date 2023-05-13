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
import InventoryViewPage from './pages/inventory-view-page/InventoryViewPage';
import GoodListPage from './pages/GoodListPage/GoodListPage';
import GoodEditPage from './pages/GoodEditPage/GoodEditPage';
import GroupsPage from './pages/GroupsPage/GroupsPage';
import MainPage from './pages/MainPage/MainPage';
import GoodsPrintBalancePage from './pages/GoodsPrintBalancePage/GoodsPrintBalancePage';
import PrintPriceTagsPage from './pages/goods/PrintPriceTagsPage/PrintPriceTagsPage';
import PrintPriceTagsPageAction from './pages/goods/PrintPriceTagsPage/PrintPriceTagsPageAction';
import SuppliersPage from './pages/SuppliersPage/SuppliersPage';
import ArrivalEditPage from './pages/ArrivalEditPage/ArrivalEditPage';
import ArrivalListPage from './pages/ArrivalListPage/ArrivalListPage';

document.title = "Online shop v2";
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
        element: <Auth><MainPage /></Auth>
      },
      {
        path:"goods",
        element:<Auth><GoodListPage /></Auth>
      },
      {
        path:"goodedit/:id",
        element: <Auth><GoodEditPage /></Auth>
      },
      {
        path: "goodedit",
        element: <Auth><GoodEditPage /></Auth>
      },
      {
        path: "goodsPrintBalance",
        element: <Auth><GoodsPrintBalancePage /></Auth>
      },
      {
        path: `goodgroups`,
        element: <Auth><GroupsPage /></Auth>
      },
      {
        path: "goodsPrintPriceTags",
        element: <Auth><PrintPriceTagsPage /></Auth>
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
        path:"suppliers",
        element: <Auth><SuppliersPage /></Auth>
      },
      {
        path:"documents/inventory-view/:id?",
        element: <Auth><InventoryViewPage /></Auth>
      },
      {
        path:"documents/inventory/:id?",
        element: <Auth><InventoryPage /></Auth>
      },
      {
        path:"documents/arrivals/:id",
        element: <Auth><ArrivalEditPage /></Auth>
      },
      {
        path:"documents/arrivals",
        element: <Auth><ArrivalListPage /></Auth>
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
