import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import $api from '../../../http/api';
import styles from './ShiftListReportPage.module.scss';

const { RangePicker } = DatePicker;

const getStartRange = () => new Date().setDate(new Date().getDate() - 20);

const columns = [
    {
        title: 'Дата',
        dataIndex: "start",
        key: "start",
        render: (text, record) => <Link to={`/reports/shifts/${record.id}`}>{record.start}</Link>,
    },
    {
        title: 'Всего',
        dataIndex: "sumAll",
        key: "sumAll",
        render: (text, record) => <Link to={`/reports/shifts/${record.id}`}>{record.sumAll}</Link>,
    },
    {
        title: '5 %',
        dataIndex: "sumPercent",
        key: "sumPercent",
        render: (text, record) => <Link to={`/reports/shifts/${record.id}`}>{record.sumPercent}</Link>,
    },
    {
        title: 'Наличные',
        dataIndex: "sumElectron",
        key: "sumElectron",
        render: (text, record) => <Link to={`/reports/shifts/${record.id}`}>{record.sumElectron}</Link>,
    },
    {
        title: 'Безналичные',
        dataIndex: "sumNoElectron",
        key: "sumNoElectron",
        render: (text, record) => <Link to={`/reports/shifts/${record.id}`}>{record.sumNoElectron}</Link>,
    },
    {
        title: 'Скидки',
        dataIndex: "sumDiscount",
        key: "sumDiscount",
        render: (text, record) => <Link to={`/reports/shifts/${record.id}`}>{record.sumDiscount}</Link>,
    },
    {
        title: 'Возвраты',
        dataIndex: "sumReturn",
        key: "sumReturn",
        render: (text, record) => <Link to={`/reports/shifts/${record.id}`}>{record.sumReturn}</Link>,
    },
]

const ShiftListReportPage = () => {
    const shop = useSelector(state=>state.shop.value);
    const navigate = useNavigate();
    const [summary, setSummary] = useState({
        sumAll: 0,
        sumPercent: 0,
    })
    const [isLoading, setIsLoading] = useState(false);
    const [range, setRange] = useState([dayjs(getStartRange()), dayjs()]);
    const [shifts, setShifts] = useState([]);

    useEffect(()=>{
        const getShifts = async () => {
            const [rangeWith, rangeBy] = range;
            const resp = await $api.get(`/${shop?.id}/reports/shifts?with=${rangeWith.format("DD.MM.YY")}&by=${rangeBy.format("DD.MM.YY")}`);
            setShifts(resp.data);
            const sumAll = resp.data.reduce((prev, cur) => cur.sumAll + prev, 0);
            const sumPercent = resp.data.reduce((prev, cur) => cur.sumPercent + prev, 0);
            setSummary({
                sumAll: sumAll,
                sumPercent: sumPercent,
            });
            setIsLoading(false);
        }
        setIsLoading(true);
        getShifts();
    },[range]);

    const changeRange = ([rangeWith, rangeBy]) => {
        console.log("Range",[rangeWith, rangeBy]);
        setRange([rangeWith, rangeBy]);
    }

    return (
        <div className={styles.actionContainer}>
            <div className={styles.actionPanel}>
                <label>Период</label>
                <RangePicker value={range} onChange={changeRange}/>
            </div>
            <div>
                <label>Итого за период: <b>{summary.sumAll}</b>. Продавцу 5%: <b>{summary.sumPercent}</b></label>
            </div>
            <div style={{overflowX: "scroll"}}>
                <Table columns={columns} dataSource={shifts} rowKey={x=>x.id} isLoading={isLoading} pagination={false} />
            </div>
            
        </div>
    )
}

export default ShiftListReportPage;