import { Button, Input, Modal, Table } from "antd";
import { PlusOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate, useNavigation } from "react-router-dom";
import styles from './inventoryList.module.scss';
import $api from "../../http/api";
import { GetDocumentStatusName, DOCUMENT_STATUS  } from '../../components/infrastructure/document-statuses'

export const InventoryLink = ({record, children}) => {
    const navigate = useNavigate();

    const setMoney = () => {
        record.setMoney();
    }

    switch(record.status){
        case DOCUMENT_STATUS.New: return <NavLink to={`/documents/inventory/${record.id}`}>{children}</NavLink>; break;
        case DOCUMENT_STATUS.Complited: return <span onClick={()=>setMoney(record.id)}>{children}</span>; break;
        case DOCUMENT_STATUS.Successed: return <NavLink to={`/documents/inventory-view/${record.id}`}>{children}</NavLink>; break;
        default: return <>{children}</>; break;
    }
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
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        render: (status, record) => <InventoryLink record={record}>{GetDocumentStatusName(status)}</InventoryLink>,
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cashMoney, setCahMoney] = useState("");
    const inventorySetMoneySelect = useRef(null);

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
                resp.forEach(i=>i.setMoney = () => {
                    inventorySetMoneySelect.current = i.id;
                    setIsModalOpen(true);
                })
                setInventoryList(resp);
            }
            catch(e){};
        }
        getInventories();
    },[]);
    
    const start = async () => {
        try{
            const resp = await $api.post(`/${shop?.id}/inventory`,{cashMoney: null});
            setIsModalOpen(false);
            navigation(`/documents/inventory/${resp.data.id}`);
        }
        catch({response}){
            if(response?.status === 500 && response.data.type=="ServiceError")
                alert(response.data.message);
        }
      };
    
      const handleOk = async () => {
        if(!isNaN(parseFloat(cashMoney)))
            try{
                const resp = await $api.post(`/${shop?.id}/inventory/${inventorySetMoneySelect.current}/setmoney`,{cashMoney: parseFloat(cashMoney)});
                setIsModalOpen(false);
                navigation(`/documents/inventory-view/${inventorySetMoneySelect.current}`);
            }
            catch({response}){
                if(response?.status === 500 && response.data.type=="ServiceError")
                    alert(response.data.message);
            }
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };

    return(
        <div>
            <div style={{marginBottom: "10px"}}>
                <Button type="primary" onClick={start}>
                    <PlusOutlined />
                    Создать
                </Button>
            </div>
            <div className={styles.tableDiv}>
                <Table columns={columns} dataSource={inventoryList} size="small"/>
            </div>
            <Modal title="Денег в кассе" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Input value={cashMoney} onChange={e=>setCahMoney(e.target.value)} placeholder="Укажите сумму денег на начало инверторизации"/>
            </Modal>
        </div>
    )
}