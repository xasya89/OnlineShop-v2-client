import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Table } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import GoodChooseComponent from '../../components/GoodChooseComponent/GoodChooseComponent';
import $api from '../../http/api';
import styles from './WriteofPage.module.scss';
import dayjs from 'dayjs';
import { GenerateUuuid4 } from '../../features/generateUuid';

const { TextArea  } = Input;

let setWriteofRef = null;
const changeCount = (goodId, value) => {
    if(setWriteofRef===null) return;
    setWriteofRef(prev => ({...prev,  writeofGoods: prev.writeofGoods.map(pos => {
        if(pos.goodId === goodId)
            pos.count = value;
        return {...pos}
    }) }))
}

const calcSum = pos => {
    try{
        const price = parseFloat(pos.price);
        const count = parseFloat(pos.count.replace(",","."));
        if(isNaN(price) || isNaN(count))
            return 0;
        return price * count;
    }
    catch(ex){}
    return 0;
}

const columns = [
    {
        title: "Наименование",
        dataIndex: "goodName",
        render: (_, record) => <>{record.goodName}</>
    },
    {
        title: "Ед",
        dataIndex: "unitStr",
        render: (_, record) => <>{record.unitStr}</>
    },
    {
        title: "Цена",
        dataIndex: "price",
        render: (_, record) => <>{record.price}</>
    },
    {
        title: "Кол-во",
        dataIndex: "count",
        render: (_, record) => <><Input value={record.count} onChange={ e => changeCount(record.goodId, e.target.value)}/></>
    },
    {
        title: "Сумма",
        dataIndex: "sum",
        render: (_, record) => <>{calcSum(record)}</>
    }
]

const WriteOfPage = () => {
    const shop = useSelector(state=>state.shop.value);
    const {id} = useParams();
    const navigate = useNavigate();
    const [writeof, setWriteof] = useState({id: parseInt(id), status: 2, dateWriteof: dayjs() ,shopId: shop?.id, note: "", writeofGoods: []})
    setWriteofRef = setWriteof;
    const noteInpRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            if(id==0) return;
            const resp = await $api.get(`/${shop?.id}/writeofs/${id}`);
            resp.data.dateWriteof = dayjs(resp.data.dateWriteof, "DD.MM.YY");
            resp.data.writeofGoods = resp.data.writeofGoods.map(p=> {
                p.uuid = GenerateUuuid4();
                return p;
            });
            setWriteof(resp.data);
        }
        fetchData();
    }, [])

    const save = async () => {
        const respData = {...writeof, id: writeof.id, dateWriteof: writeof.dateWriteof.format("DD.MM.YYYY"), note: noteInpRef.current.value, sumAll:0, writeofGoods: writeof.writeofGoods.map(pos => {
            let price = parseFloat(pos.price);
            let count = pos.count;
            if(typeof pos.count !== "number")
                count = parseFloat(pos.count.replace(",","."));
            price = isNaN(price) ? 0 : price;
            count = isNaN(count) ? 0 : count;
            return {...pos, price: price, count: count};
        })}
        respData.status = 2;
        respData.sumAll = 0;
        respData.note = noteInpRef.current.value;
        let result = null;
        if(respData.id===0)
            result = await $api.post(`/${shop?.id}/writeofs`, respData);
        if(respData.id!==0)
            result = await $api.put(`/${shop?.id}/writeofs`, respData);
        result.data.dateWriteof = dayjs(result.data.dateWriteof, "DD.MM.YY");
        setWriteof(result.data);
    }
    const cancel = () => navigate("/documents/writeofs")

    const addPositions = goods => {
        const newPositions = goods.filter(g=>writeof.writeofGoods.find(item => item.goodId === g.id) === undefined).map(g=>({
            id: 0,
            goodId: g.id,
            goodName: g.name,
            unit: g.unit,
            unitStr: g.unitStr,
            price: g.price,
            count: "0",
            sum: 0,
            uuid: GenerateUuuid4()
        })).flat();
        setWriteof(prev => ({...prev, writeofGoods: prev.writeofGoods.concat(newPositions) }))
    }

    const calcSumAll = () => writeof.writeofGoods.reduce((prev, item) => prev + calcSum(item),0)

    return (
        <div className={styles.actionContainer}>
            <div className={styles.actionPanel}>
                <Button type="primary" onClick={save}>
                    <PlusOutlined />
                    Сохранить
                </Button>
                <Button onClick={cancel}>Отмена</Button>
            </div>
            <div className={styles.space}>
                <label>Дата</label>
                <DatePicker value={writeof.dateWriteof} onChange={(date, dateStr) => setWriteof(prev=>({...prev, dateWriteof: date}))} />
            </div>
            <div className={styles.space}>
                <label>Общая сумма: {calcSumAll()}</label>
            </div>
            <GoodChooseComponent onChoosed={addPositions} />
            <Table rowKey={x=>x.uuid} columns={columns} dataSource={writeof.writeofGoods} pagination={null} size="small" />
            <div className={styles.space}></div>
            <div>
                <textarea ref={noteInpRef} rows={4} value="23" placeholder='примечаение' style={{width: "100%"}}/>
            </div>
        </div>
    )
}

export default WriteOfPage;