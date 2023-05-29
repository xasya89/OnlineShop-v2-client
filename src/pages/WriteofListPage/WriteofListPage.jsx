import { PlusOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import $api from '../../http/api';
import styles from './WriteofListPage.module.scss';

const columns = [
    {
        title: "Дата",
        dataIndex: "dateWriteof",
        key: "dateWriteof",
        render: (text, record) => <NavLink to={"/documents/writeofs/" + record.id}>{record.dateWriteofStr}</NavLink>
    },
    {
        title: "Примечание",
        dataIndex: "note",
        key: "note",
        render: (text, record) => <NavLink to={"/documents/writeofs/" + record.id}>{record.note}</NavLink>
    },
    {
        title: "Сумма",
        dataIndex: "sumAll",
        key: "sumAll",
        render: (text, record) => <NavLink to={"/documents/writeofs/" + record.id}>{record.sumAll}</NavLink>
    },
]

const WriteofListPage = () => {
    const shop = useSelector(state=>state.shop.value);
    const navigate = useNavigate();
    const [writeofs, setWriteofs] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 20,
            total: 1
          },
    });

    const newDocumentHandler = () => navigate(`/documents/writeofs/0`);

    const fetchData = async (page = 1) => {
        const resp = await $api.get(`/${shop?.id}/writeofs?page=${page}&count=${tableParams.pagination.pageSize}`);
        setWriteofs(resp.data.writeofs);
        setTableParams(prev=>({...prev, pagination: {...prev.pagination, total: resp.data.total} }))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleTableChange = (pagination, filters, sorter) => {
        fetchData(pagination.current);
        setTableParams({
          pagination,
          filters,
          ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
          setWriteofs([]);
        }
      };

    return (
        <div className={styles.actionContainer}>
            <div className={styles.actionPanel}>
                <Button type="primary" onClick={newDocumentHandler}>
                    <PlusOutlined />
                    Создать
                </Button>
            </div>
            <Table columns={columns} onChange={handleTableChange} pagination={tableParams.pagination} rowKey={r=>r.id} dataSource={writeofs} size="small" />
        </div>
    )
}

export default WriteofListPage;