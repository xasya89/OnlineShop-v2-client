import { Button, Table } from "antd";
import { PlusOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate, useNavigation } from "react-router-dom";
import styles from './inventoryList.module.scss';
import $api from "../../http/api";

const columns = [
    {
        title: '',
        dataIndex: '',
        key: '',
        render: (text, record) => <NavLink to={`/documents/inventory/${record.id}`}><FolderOpenOutlined /></NavLink>,
    },
    {
        title: '№',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => <NavLink to={`/documents/inventory/${record.id}`}>{text}</NavLink>,
    },
    {
        title: 'Создано',
        dataIndex: 'startStr',
        key: 'startStr',
        render: (text, record) => <NavLink to={`/documents/inventory/${record.id}`}>{text}</NavLink>,
    },
    {
        title: 'Завершен',
        dataIndex: 'stopStr',
        key: 'stopStr',
        render: (text, record) => <NavLink to={`/documents/inventory/${record.id}`}>{text}</NavLink>,
    },
    {
        title: 'Было',
        dataIndex: 'sumDb',
        key: 'sumDb',
        render: (text, record) => <NavLink to={`/documents/inventory/${record.id}`}>{text}</NavLink>,
    },
    {
        title: 'Фактически',
        dataIndex: 'sumFact',
        key: 'sumFact',
        render: (text, record) => <NavLink to={`/documents/inventory/${record.id}`}>{text}</NavLink>,
    },
    {
        title: 'Касса было',
        dataIndex: 'cashMoneyDb',
        key: 'cashMoneyDb',
        render: (text, record) => <NavLink to={`/documents/inventory/${record.id}`}>{text}</NavLink>,
    },
    {
        title: 'Касса факт',
        dataIndex: 'cashMoneyFact',
        key: 'cashMoneyFact',
        render: (text, record) => <NavLink to={`/documents/inventory/${record.id}`}>{text}</NavLink>,
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