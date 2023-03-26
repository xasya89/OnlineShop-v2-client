import { Button, Table } from "antd";
import { PlusOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate, useNavigation } from "react-router-dom";
import styles from './inventoryList.module.scss';
import $api from "../../http/api";

export const InventoryLink = ({record, children}) => {
    return (
        record.status === 0 ?
            <NavLink to={`/documents/inventory/${record.id}`}>{children}</NavLink> :
            <NavLink to={`/documents/inventory-view/${record.id}`}>{children}</NavLink>
    )
}

const columns = [
    {
        title: '',
        dataIndex: '',
        key: '',
        render: (text, record) => <InventoryLink record={record}><FolderOpenOutlined /></InventoryLink>,
    },
    {
        title: '№',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => <InventoryLink record={record}>{text}</InventoryLink>,
    },
    {
        title: 'Создано',
        dataIndex: 'startStr',
        key: 'startStr',
        render: (text, record) => <InventoryLink record={record}>{text}</InventoryLink>,
    },
    {
        title: 'Завершен',
        dataIndex: 'stopStr',
        key: 'stopStr',
        render: (text, record) => <InventoryLink record={record}>{text}</InventoryLink>,
    },
    {
        title: 'Было',
        dataIndex: 'sumDb',
        key: 'sumDb',
        render: (text, record) => <InventoryLink record={record}>{text}</InventoryLink>,
    },
    {
        title: 'Фактически',
        dataIndex: 'sumFact',
        key: 'sumFact',
        render: (text, record) => <InventoryLink record={record}>{text}</InventoryLink>,
    },
    {
        title: 'Касса было',
        dataIndex: 'cashMoneyDb',
        key: 'cashMoneyDb',
        render: (text, record) => <InventoryLink record={record}>{text}</InventoryLink>,
    },
    {
        title: 'Касса факт',
        dataIndex: 'cashMoneyFact',
        key: 'cashMoneyFact',
        render: (text, record) => <InventoryLink record={record}>{text}</InventoryLink>,
    },
]

export default function InventoryListPage(){
    const shop = useSelector(state=>state.shop.value);
    const navigation = useNavigate();
    const [inventoryList, setInventoryList] = useState([]);

    const startNewInventory = async () => {
        try{
            const resp = await $api.post(`/${shop?.id}/inventory/legacystart/${shop.legacyDbNum}`);
            navigation(`/documents/inventory/${resp.data.id}`);
        }
        catch({response}){
            if(response?.status === 500 && response.data.type=="ServiceError")
                alert(response.data.message);
        }
    }

    useEffect(()=>{
        const getInventories = async () =>{
            try{
                const resp = (await $api.get(`/${shop.id}/inventory`)).data;
                setInventoryList(resp);
            }
            catch(e){};
        }
        getInventories();
    },[]);

    return(
        <div>
            <div style={{marginBottom: "10px"}}>
                <Button type="primary" onClick={startNewInventory}>
                    <PlusOutlined />
                    Создать
                </Button>
            </div>
            <div className={styles.tableDiv}>
                <Table columns={columns} dataSource={inventoryList} size="small"/>
            </div>
        </div>
    )
}