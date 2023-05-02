import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import $api from '../../http/api';
import styles from './SuppliersPage.module.scss';


let setSuppliersRef=null;
let startEditRef=null;
const onDelete = async (e, supplier) => {
    e.preventDefault();
    e.stopPropagation();
    if(window.confirm("Удалить поставщка?")){
        await $api.delete(`/${supplier.shopId}/suppliers/${supplier.id}`);
        setSuppliersRef(prev=>prev.filter(s=>s.id!==supplier.id));
    }
}

const onEdit = async (e, supplier) => {
    e.preventDefault();
    e.stopPropagation();
    startEditRef(supplier);
}

const columns = [
    {
        title: "",
        dataIndex: "id",
        key: "id",
        render: (rext, record) => <>
            <Button onClick={e => onDelete(e, record)}><DeleteFilled/></Button>
            <Button onClick={e => onEdit(e, record)}><EditFilled /></Button>
        </>
    },
    {
        title: 'Поставщик',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <span>{record.name}</span>,
    },
]

const SuppliersPage = () => {
    const shop = useSelector(state=>state.shop.value);
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [selectSupplier, setSelectSupplier] = useState({id:0, shopId: shop?.id, name: ""});
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState("");
    setSuppliersRef = setSuppliers;

    useEffect(() => {
        const getSuppliers = async () => {
            const resp = await $api.get(`/${shop?.id}/suppliers`);
            setSuppliers(resp.data);
        }
        getSuppliers();
    }, []);

    const newSupplier = () => {
        setSelectSupplier({id:0, shopId: shop?.id, name: ""});
        setIsOpen(true);
    }
    const startEdit = (supplier) => {
        setSelectSupplier(supplier);
        setIsOpen(true);
    }
    startEditRef = startEdit;

    const cancel = () => { setIsOpen(false); setValue(""); };
    const save = async () => {
        if(selectSupplier.id===0){
            const resp = await $api.post(`/${shop?.id}/suppliers`, selectSupplier);
            setSuppliers(prev=>[...prev, resp.data]);
        }
        else{
            const resp = await $api.put(`/${shop?.id}/suppliers`, selectSupplier);
            setSuppliers(prev=> prev.map(s=>{
                if(s.id===resp.data.id)
                    return {...s, name: resp.data.name};
                return {...s};
            }))
        }
        setIsOpen(false);
    }

    return (
        <div className={styles.actionContainer}>
            <div className={styles.actionPanel}>
                <Button type="primary" onClick={newSupplier}>
                    <PlusOutlined />
                    Создать
                </Button>
            </div>
            <Table rowKey={record => record.id} columns={columns} dataSource={suppliers} pagination={false} size="small"
                onRow={(record, rowIndex) => { 
                    return {
                    onClick: (event) => { startEdit(record); }, // click row
                    onDoubleClick: (event) => {}, // double click row
                    onContextMenu: (event) => {}, // right button click row
                    onMouseEnter: (event) => {}, // mouse enter row
                    onMouseLeave: (event) => {}, // mouse leave row
                    };
                }} />
            <Modal open={isOpen} onCancel={cancel} onOk={save} title="Поставщик">
                <Input value={selectSupplier.name} onChange={e=>setSelectSupplier({...selectSupplier, name: e.target.value})} placeholder="Наименование поставщика"/>
            </Modal>
        </div>
    )
}

export default SuppliersPage;