import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import $api from '../../../http/api';
import styles from './MoneyReportPage.module.scss';

const { RangePicker } = DatePicker;

const columns = [
    {
        title: 'Дата',
        dataIndex: "create",
        key: "create",
    },
    {
        title: 'Инвент. товары',
        dataIndex: "inventoryGoodsSum",
        key: "inventoryGoodsSum",
    },
    {
        title: 'Инвент. касса',
        dataIndex: "inventoryCashMoney",
        key: "inventoryCashMoney",
    },
    {
        title: 'Приходы',
        dataIndex: "arrivalsSum",
        key: "arrivalsSum",
    },
    {
        title: 'Внесение',
        dataIndex: "cashIncome",
        key: "cashIncome",
    },
    {
        title: 'Изъятие',
        dataIndex: "cashOutcome",
        key: "cashOutcome",
    },
    {
        title: 'Продажи нал',
        dataIndex: "cashMoney",
        key: "cashMoney",
    },
    {
        title: 'Продажи безнал',
        dataIndex: "cashElectron",
        key: "cashElectron",
    },
    {
        title: 'Списания',
        dataIndex: "writeof",
        key: "writeof",
    },
    {
        title: 'Переоценка',
        dataIndex: "revaluationOld",
        key: "revaluationOld",
    },
    {
        title: 'Переоценка',
        dataIndex: "revaluationNew",
        key: "revaluationNew",
    },
    {
        title: 'Денег в кассе',
        dataIndex: "moneyItog",
        key: "moneyItog",
    },
    {
        title: 'Товары',
        dataIndex: "stopGoodSum",
        key: "stopGoodSum",
    },
]

const MoneyReportPage = () => {
    const shop = useSelector(state=>state.shop.value);
    const navigate = useNavigate();
    const [selectedRange, setSelectedRange] = useState([dayjs().add(-20, 'day'), dayjs()]);
    const [reports, setReports] = useState([]);

    const newDocumentHandler = () => {}

    const dateSelectedChange = (range) => {
        const [dateWith, dateBy] = range;
        setSelectedRange([dateWith, dateBy]);
    } 

    useEffect(()=>{

        const getReports = async () => {
            const [dateWith, dateBy] = selectedRange;
            const resp = await $api.get(`/${shop?.id}/moneyReport?with=${dateWith.format("DD.MM.YY")}&by=${dateBy.format("DD.MM.YY")}`);
            setReports(resp.data);
        }
        getReports();
    }, [selectedRange]);

    return (
        <div className={styles.actionContainer}>
            <div className={styles.actionPanel}>
                <RangePicker onChange={dateSelectedChange} value={selectedRange}/>
            </div>
            <div style={{overflowX: "scroll"}}>
                <Table columns={columns} dataSource={reports} rowKey={r=>r.id} pagination={false}/>
            </div>
            
        </div>
    )
}

export default MoneyReportPage;