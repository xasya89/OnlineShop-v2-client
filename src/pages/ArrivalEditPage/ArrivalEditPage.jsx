import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Select, Table } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import $api from '../../http/api';
import styles from './ArrivalEditPage.module.scss';
import { useEffect, useState } from 'react';
import GoodChooseComponent from '../../components/GoodChooseComponent/GoodChooseComponent';
import { GenerateUuuid4 } from '../../features/generateUuid';
import dayjs from 'dayjs';

const ndsOptions = [
    {value: 0, label: "Без ндс"},
    {value: 1, label: "Ндс 20%"},
    {value: 2, label: "Ндс 10%"},
    {value: 3, label: "Ндс 0%"},
]

let setPositionRef = null;
const changePositionHandle = (record, key, value) => {
    return setPositionRef && setPositionRef(prev=> prev.map(pos=> {
        if(pos===record)
            pos[key]=value;
        return {...pos};
    }))
}

const removePositionHandle = (record) => 
    setPositionRef && setPositionRef(prev=>prev.filter(p=>p!==record || p.id!==0).map(p=>{
        if(p===record)
            p.isDelete = true;
        return p;
    }))

const columns = [
    {
        title:"",
        dataIndex: "id",
        render: (_, record) => !record.isDelete && <Button onClick={e=>removePositionHandle(record)}><DeleteFilled /></Button>
    },
    {
        title: "Товар",
        dataIndex: "goodName",
        render: (_, record) => {record.isDelete ? 
            <span>{record.goodName}</span> :
            <span style={{textDecoration: "line-through"}}>{record.goodName}</span>
        }
    },
    {
        title: "Ед",
        dataIndex: "unit",
        render: (_, record) => {record.isDelete ? 
            <span>{record.unit}</span> :
            <span style={{textDecoration: "line-through"}}>{record.unit}</span>
        }
    },
    {
        title: "Цена закуп",
        dataIndex: "pricePurchase",
        render: (_, record) => <>{
            record.isDelete ? 
                <span style={{textDecoration: "line-through"}}>{record.pricePurchase}</span> :
                <Input value={record.pricePurchase} onChange={e=>changePositionHandle(record, "pricePurchase", e.target.value.replace(".",","))} />
        }</>
    },
    {
        title: "Цена продажи",
        dataIndex: "priceSell",
        render: (_, record) =><>{
            record.isDelete ? 
                <span style={{textDecoration: "line-through"}}>{record.priceSell}</span> :
                <Input value={record.priceSell} onChange={e=>changePositionHandle(record, "priceSell", e.target.value.replace(".",","))} />
        }</>
    },
    {
        title: "Наценка",
        dataIndex: "pricePercent",
        render: (_, record) =>  {
            const pricePurchase = parseFloat(record.pricePurchase);
            const priceSell = parseFloat(record.priceSell);
            const percent = (!isNaN(pricePurchase) & !isNaN(priceSell)) && Math.floor((priceSell - pricePurchase) / priceSell * 100);
            return <>{
                record.isDelete ? 
                    <span style={{textDecoration: "line-through"}}>{percent}</span> :
                    <Input value={percent} readOnly/>
            }</>
        }
    },
    {
        title: "Кол-во",
        dataIndex: "count",
        render: (_, record) => <>{
            record.isDelete ? 
                <span style={{textDecoration: "line-through"}}>{record.count}</span> :
                <Input value={record.count} onChange={e=>changePositionHandle(record, "count", e.target.value.replace(".",","))} />
        }</>
    },
    {
        title: "НДС",
        dataIndex: "nds",
        render: (_, record) => <>{
            record.isDelete ? 
                <span style={{textDecoration: "line-through"}}>{record.nds}</span> :
                <Select onSelect={(val, _)=>changePositionHandle(record, "nds", val)} options={ndsOptions} defaultValue={record.nds} style={{width: 100}} /> 
        }</>
    },
    {
        title: "Продажа",
        dataIndex: "ammountPruchase",
        render: (_, record) => { 
            const pricePurchase = parseFloat(record.pricePurchase);
            const count = parseFloat(record.count);
            const amount = (!isNaN(pricePurchase) & !isNaN(count)) && (count * pricePurchase);
            return <>{
                record.isDelete ? 
                    <span style={{textDecoration: "line-through"}}>{amount}</span> :
                    <Input value={amount} readOnly/>
            }</>
        }
    },
    {
        title: "Закупка",
        dataIndex: "ammountSell",
        render: (_, record) => { 
            const priceSell = parseFloat(record.priceSell);
            const count = parseFloat(record.count);
            const amount = (!isNaN(priceSell) & !isNaN(count)) && (count * priceSell);
            return <>{
                record.isDelete ? 
                    <span style={{textDecoration: "line-through"}}>{amount}</span> :
                    <Input value={amount} readOnly/>
            }</>
        }
    },
]

const initialStateArrival = {
    id: 0,
    shopId: 0,
    status: 0,
    num: "",
    dateArrival: dayjs(Date.now()),
    supplierId: 0,
    legacyId: 0,
}

const ArrivalEditPage = () => {
    const shop = useSelector(state=>state.shop.value);
    const {id} = useParams();
    const navigate = useNavigate();
    const [arrivalHeader, setArrivalHeader] = useState({...initialStateArrival, shopId: +shop?.id});
    const [positions, setPositions] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const getSuppliers = async () => {
            const resp = await $api.get(`/${shop?.id}/suppliers`);
            const arr = resp.data.map(s=>({value: s.id, label: s.name}));
            setSuppliers(arr);
        }
        getSuppliers();
    }, []);
    useEffect(() => {
        const getArrival = async () => {
            if(id === 0) return;
            const resp = await $api.get(`/${shop?.id}/arrivals/${id}`);
            const {num, dateArrival, supplierId, arrivalGoods, legacyId} = resp.data;
            setArrivalHeader({...arrivalHeader, id, num, dateArrival: dayjs(dateArrival,'DD.MM.YY'), supplierId, legacyId});
            setPositions(arrivalGoods);
        }
        getArrival();
    }, [id]);
    const save = async () => {
        const {id, shopId, num, dateArrival, supplierId, legacyId} = arrivalHeader;
        if(!num || num==="") window.alert("Не заполнен поле №");
        if(!dateArrival) window.alert("Не указана дата документа");
        if(supplierId===0) window.alert("Не выбран поставщик");
        let flagPositionsErr= false;
        positions.reduce((flag, pos) => {
            let priceSell = parseFloat(pos.priceSell);
            let pricePurchase = parseFloat(pos.pricePurchase);
            let count = parseFloat(pos.count);
            if(isNaN(priceSell) || isNaN(pricePurchase) || isNaN(count))
                return true;
            pos.priceSell = priceSell;
            pos.pricePurchase = pricePurchase;
            pos.count = count;
            return flag;
        }, false);
        if(flagPositionsErr) alert("Не заполнены поля таблицы");

        let resultId = 0;
        if(id === 0)
            resultId = (await $api.post(`/${shop?.id}/arrivals/`,{
                id,
                shopId,
                status: 0,
                num: num,
                dateArrival: dateArrival.format("DD.MM.YY"),
                supplierId: supplierId,
                legacyId,
                arrivalGoods: positions
            })).data.id
        else
            resultId = (await $api.put(`/${shop?.id}/arrivals/${id}`,{
                id,
                shopId,
                status: 0,
                num: num,
                dateArrival: dateArrival.format("DD.MM.YY"),
                supplierId: supplierId,
                legacyId,
                arrivalGoods: positions
            })).data.id
        navigate(`/documents/arrivals/${resultId}`);
    }
    
    setPositionRef = setPositions;

    const addPosition = goods => {
        const newPositions = goods.map(g=>({
            id: 0,
            goodId: g.id,
            goodName: g.name,
            unit: g.unit,
            priceSell: null,
            pricePurchase: null,
            count: null,
            nds: 0,
            expiresDate: null,
            uuid: GenerateUuuid4(),
            isDelete: false
        })).flat();
        setPositions(prev => prev.concat(newPositions));
    }
    
    return (
        <div className={styles.actionContainer}>
            <div className={styles.actionPanel}>
                {
                    id == 0 &&
                    <Button type="primary" onClick={save}>
                        <PlusOutlined />
                        Сохранить
                    </Button>
                }
            </div>
            <div>
                <label>№</label>
                <Input value={arrivalHeader.num} onChange={e=>setArrivalHeader(prev=>({...prev, num: e.target.value}))} size="middle" />
            </div>
            <div>
                <label>Дата</label>
                <DatePicker value={arrivalHeader.dateArrival} onChange={(date, dateStr)=> setArrivalHeader(prev=>({...prev, dateArrival: date})) } size="middle" />
            </div>
            <div>
                <label>Поставщик</label>
                <Select value={arrivalHeader.supplierId} onSelect={(val, _) => setArrivalHeader(prev=>({...prev, supplierId: val}))} options={suppliers} style={{width: 200}}/>
            </div>
            <div>
                <GoodChooseComponent onChoosed={e=>addPosition(e)} />
                <Table dataSource={positions} key={record=>record.uuid} columns={columns} size="small" />
            </div>
        </div>
    )
}

export default ArrivalEditPage;