import { Outlet, NavLink, useNavigate, useNavigation } from 'react-router-dom';
import { Layout, Menu, Select } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutEffect, useState } from 'react';
import { setShop, shopSelector } from './redux/shopSlice';
import $api from './http/api';

function getItem(label, key, link, icon, children, type) {
    return {
      key,
      icon,
      link,
      children,
      label,
      type,
    };
  }

const menuItems = [
    getItem("Справочники", "item 1", null, null, [
        getItem("Товары", "item 1-1", "/goods", null),
        getItem("Поставщики", "item 1-2", "/suppliers", null),
        getItem("Группы", "item 1-3", "/goodgroups", null),
    ], "group"),
    
    getItem("Документы", "item 2", null, null, [
        getItem("Инверторизация", "item 2-1", "/documents/inventorylist", null),
        getItem("Поступления", "item 2-2", "/documents/arrivals", null),
        getItem("Списания", "item 2-3", "/documents/writeofs", null),
    ], "group"),
    
    getItem("Отчеты", "item 3", null, null, [
        getItem("По дням", "item 3-1", "/reports/money", null),
        getItem("Поступления", "item 3-2", "/reports/shifts", null),
    ], "group"),
]




export default function LayoutComponent () {
    const navigation = useNavigate();
    const onClick = e => {
        const selectItem = menuItems.map(x=>x.children).flat().find(x=>x.key===e.key);
        if(selectItem===undefined)
            return;
        navigation(selectItem.link);
    }

    const [shops, setShops] = useState([]);
    const shop = useSelector(shopSelector);
    const dispatch = useDispatch();
    useLayoutEffect(() => {
        const getShops = async () => {
            const resp = await $api.get("/shops");
            const shops = resp.data;
            setShops(shops);
        }
        getShops();
    }, []);

    const changeSelectShop = shopId => {
        if(shopId===-1)
            return;
        const shop = shops.find(x=>x.id === shopId);
        dispatch(setShop(shop));
    }

    const selectShop = shop == null ? -1: shop?.id;
    const shopsKeyValue = shops.map(x=>({value: x.id, label: x.alias}));
    return (
        <Layout>
            <Sider collapsedWidth="0" breakpoint="lg" theme="light"> 
                <Select onChange={changeSelectShop} defaultValue={selectShop} options={shopsKeyValue} style={{width: "100%"}} />
                <Menu items={menuItems} mode="inline" theme="light" onClick={onClick} />

            </Sider>
            <Layout>
                <Content style={{margin: "0"}}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

