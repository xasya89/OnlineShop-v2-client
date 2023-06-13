import { PlusOutlined } from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import $api from '../../../http/api';
import ShiftOneChecksTable from './Components/ShiftOneChecksTable';
import ShiftOneSummaryTable from './Components/ShiftOneSummaryTable';
import styles from './ShiftOneReportPage.module.scss';

const ShiftOneReportPage = () => {
    const shop = useSelector(state=>state.shop.value);
    const navigate = useNavigate();
    const {id} = useParams();
    const [shift, setShift] = useState(null);

    useEffect(() => {
        const getShift = async () => {
            const resp = await $api.get(`/${shop?.id}/reports/shifts/${id}`);
            setShift(resp.data);
        }
        getShift();
    }, [id]);

    const tabs = [
        {
            key: "1",
            label: "Общее",
            children: <ShiftOneSummaryTable shop={shop} shiftId={id} />
        },
        {
            key: "2",
            label: "Чеки",
            children: <ShiftOneChecksTable chekcs={shift?.checkSells} />
        }
    ]

    return (
        <div className={styles.actionContainer}>
            <div className={styles.actionPanel}>
                <p><label>От: </label>{shift?.start}</p>
                <p><label>Всего: </label>{shift?.sumAll}</p>
                <p><label>Наличные: </label>{shift?.sumNoElectron}</p>
                <p><label>Безналичные: </label>{shift?.sumElectron}</p>
                <p><label>Возвраты: </label>{shift?.sumReturn}</p>
            </div>
            <div>
                <Tabs items={tabs} />
            </div>
        </div>
    )
}

export default ShiftOneReportPage;