import { PlusOutlined } from '@ant-design/icons';
import { Button, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import $api from '../../http/api';
import styles from './ArrivalListPage.module.scss';



const ArrivalListPage = () => {
    const shop = useSelector(state=>state.shop.value);
    const navigate = useNavigate();
    const [arrivals, setArrivals] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectSupplier, setSelectSupplier] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 20,
            total: 1
          },
    });

    const newDocumentHandler = () => navigate("/documents/arrivals/0")

    const fetchData = async (current = 1) => {
        setLoading(true);
            try{
                const supplierParam = selectSupplier!=null ?"&supplierId=" + selectSupplier : "";
                const resp = await $api.get(`/${shop?.id}/arrivals?page=${current}&count=${tableParams.pagination.pageSize}${supplierParam}`);
                setArrivals(resp.data.arrivals);
                setTableParams(prev=>({...prev, pagination: {...prev.pagination, total: resp.data.total} }))
            }
            catch(e){
                console.error(e);
            }
        setLoading(false);
    }

    useEffect(()=>{
        const getSuppliers = async () => {
            const resp = await $api.get(`/${shop?.id}/suppliers`);
            const values = [{value: null, label: ""}].concat(resp.data.map(s=>({value: s.id, label: s.name})))
            setSuppliers(values);
        } 
        getSuppliers();
    }, []);

    useEffect(()=> {
        fetchData() 
    }, [selectSupplier])

    const handleTableChange = (pagination, filters, sorter) => {
        fetchData(pagination.current);
        setTableParams({
          pagination,
          filters,
          ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
          setArrivals([]);
        }
      };

    const columns = [
        {
            title: 'Номер',
            dataIndex: "num",
            key: "num",
            render: (text, record) => <Link to={`/documents/arrivals/${record.id}`}>{record.num}</Link>
        },
        {
            title: 'Дата',
            dataIndex: "dateArrivalStr",
            key: "dateArrivalStr",
            render: (text, record) => <Link to={`/documents/arrivals/${record.id}`}>{record.dateArrivalStr}</Link>
        },
        {
            title: 'Поставщик',
            dataIndex: "supplierName",
            key: "supplierName",
            render: (text, record) => <Link to={`/documents/arrivals/${record.id}`}>{record.supplierName}</Link>
        },
        {
            title: 'Цена закупки',
            dataIndex: "purchaseAmount",
            key: "purchaseAmount",
            render: (text, record) => <Link to={`/documents/arrivals/${record.id}`}>{record.purchaseAmount}</Link>
        },
        {
            title: 'Цена продажи',
            dataIndex: "saleAmount",
            key: "saleAmount",
            render: (text, record) => <Link to={`/documents/arrivals/${record.id}`}>{record.saleAmount}</Link>
        },
    ]

    return (
        <div>
            <div className={styles.actionPanel}>
                <Button type="primary" onClick={newDocumentHandler}>
                    <PlusOutlined />
                    Создать
                </Button>

                <Select onChange={val=>setSelectSupplier(val)} options={suppliers} defaultValue={null} style={{minWidth: "150px"}} placeholder=""/>
            </div>
            <Table rowKey={r=>r.id} columns={columns} dataSource={arrivals} pagination={tableParams.pagination} onChange={handleTableChange} loading={loading} size="small"/>
        </div>
    )
}

export default ArrivalListPage;