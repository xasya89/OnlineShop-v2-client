import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Checkbox, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useNavigation, useParams } from 'react-router-dom';
import $api from '../../http/api';
import styles from './GoodEditPage.module.scss';

const initState = {
    "id": 0,
    "goodGroupId": 0,
    "supplierId": null,
    "name": "",
    "article": null,
    "unit": 796,
    "price": null,
    "specialType": 0,
    "vPackage": null,
    "isDeleted": false,
    "goodPrices": [
      {
        "id": 2944,
        "shopId": 1,
        "price": 111
      },
      
      {
        "id": 2944,
        "shopId": 2,
        "price": 111
      },
      {
        "id": 2944,
        "shopId": 3,
        "price": 111
      }
    ],
    "barcodes": [
      {
        "id": 2934,
        "code": "144824"
      }
    ]
  }

const units = [{label: "шт", value: 796}, {label: "л", value: 112}, {label: "кг", value:166}];
const specialTypes = [{ label: " ", value:0}, { label: "Пиво", value:1}, { label: "Тара", value:2}, { label: "Пакет", value:3},];

const GoodEditPage = () => {
    const shop = useSelector(state=>state.shop.value);
    const {id} = useParams();
    const navigate = useNavigate();
    const [good, setGood] = useState(initState);
    const [groups, setGroups] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [shops, setShops] = useState([]);

    useEffect(()=>{
        const getGroups = async () => {
            let resp = await $api.get(`/${shop.id}/goodgroups`);
            setGroups(resp.data);
            resp = await $api.get(`/${shop.id}/suppliers`);
            setSuppliers([...resp.data, {id:null, name: "", shopId: shop.id}]);
            resp = await $api.get(`/shops`);
            setShops(resp.data);
        }
        const getSuppliers = async () => {
        }
        getGroups();
        getSuppliers();
    }, []);

    const handleAddBarcode = () => {
        setGood(prev=> ({ ...prev, barcodes: [...prev.barcodes, {id: 0, code: "" }] }));
    }

    const handlerSave = () => {}
    const selectedGroup = groups?.find(g=>g.id===good.goodGroupId);
    const selectedSupplier = suppliers?.find(s=>s.id===good.supplierId);
    const selectedUnit = units?.find(s=>s.value===good.unit);
    const selectSpecialType = specialTypes?.find(s=>s.value===good.specialType);

    return (
        <div className={styles.actionContainer}>
            <div className={styles.actionPanel}>
                <Button type="primary" onClick={handlerSave}>
                    <SaveOutlined />
                    Сохранить
                </Button>
            </div>
            <div>
                <div>
                    <label>Название</label>
                    <Input value={good.name} onChange={e=>setGood(prev => ({...prev, name:e.target.value}))} />
                </div>
                <div>
                    <label>Группа</label>
                    {selectedGroup!==undefined && 
                        <Select labelInValue 
                        onChange={({value}) => setGood(prev=>({...prev, goodGroupId: value}))} 
                        defaultValue={{label: selectedGroup.name, value: selectedGroup.id}} 
                        style={{width: "100%"}} options={groups.map(g=>({label: g.name, value: g.id}))} />
                    }
                    {selectedGroup===undefined && 
                        <Select labelInValue 
                        onChange={({value}) => setGood(prev=>({...prev, goodGroupId: value}))} 
                        defaultValue={{label: "", value: 0}} 
                        style={{width: "100%"}} options={groups.map(g=>({label: g.name, value: g.id}))} />
                    }
                </div>
                <div>
                    <label>Поставщик</label>
                    {selectedSupplier!==undefined && 
                        <Select labelInValue 
                        onChange={({value}) => setGood(prev=>({...prev, supplierId: value}))} 
                        defaultValue={{label: selectedSupplier.name, value: selectedSupplier.id}} 
                        style={{width: "100%"}} options={suppliers.map(g=>({label: g.name, value: g.id}))} />
                    }
                    {selectedSupplier===undefined && 
                        <Select labelInValue 
                        onChange={({value}) => setGood(prev=>({...prev, supplierId: value}))} 
                        defaultValue={{label: "", value: 0}} 
                        style={{width: "100%"}} options={suppliers.map(g=>({label: g.name, value: g.id}))} />
                    }
                </div>
                <div>
                    <label>Артикул</label>
                    <Input value={good.article} onChange={e=>setGood(prev => ({...prev, article:e.target.value}))} />
                </div>
                <div>
                    <label>Ед измер.</label>
                    {selectedUnit!==undefined &&
                        <Select labelInValue onChange={ ({value}) => setGood(prev=>({...prev, unit: value})) } 
                        defaultValue={selectedUnit}
                        options={units} />
                    }
                    {selectedUnit===undefined &&
                        <Select labelInValue onChange={ ({value}) =>  setGood(prev=>({...prev, unit: value})) } 
                        options={units} />
                    }
                </div>
                <div>
                    <label>Спец. тип</label>
                    {selectSpecialType!==undefined &&
                        <Select labelInValue onChange={ ({value}) => setGood(prev=>({...prev, specialType: value})) } 
                        defaultValue={selectSpecialType}
                        options={specialTypes} style={{width: "100%"}} />
                    }
                    {selectSpecialType===undefined &&
                        <Select labelInValue onChange={ ({value}) =>  setGood(prev=>({...prev, specialType: value})) } 
                        options={specialTypes} style={{width: "100%"}} />
                    }
                </div>
                <div>
                    <label>Обхем тары</label>
                    <Input value={good.vPackage} onChange={e=>setGood(prev=>({...prev, vPackage: e.target.value.replace(",", ".") }))} />
                </div>
                <div>
                    <Checkbox checked={good.isDeleted} onChange={_=>setGood(prev => ({...prev, isDeleted: !prev.isDeleted }) )}>Удален</Checkbox>
                </div>
                <div>
                    <label>Цена</label>
                    <Input value={good.price} onChange={e => setGood(prev => ({...prev, price: good.price}) )} />
                </div>
                {good.goodPrices.map(g=> <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                    <label>{shops.find(s=>s.id===g.shopId)?.alias}</label>
                    <Input value={g.price} 
                        onChange={e => 
                            setGood(prev => ({...prev, goodPrices: prev.goodPrices.map(p=>{
                                if(g===p) p.price = e.target.value;
                                return p;
                            }) })
                            )} />
                </div>)}
                <div>
                    <Button onClick={handleAddBarcode}><PlusOutlined /> штрих код</Button>
                </div>
                {good.barcodes.map(b=> <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                    <Input value={b.code} 
                    onChange={e => setGood(prev => ({...prev, barcodes: prev.barcodes.map(x => {
                        if(b===x) x.code=e.target.value;
                        return x;
                    })}))} />
                </div>)}
            </div>
        </div>
    )
}

export default GoodEditPage;