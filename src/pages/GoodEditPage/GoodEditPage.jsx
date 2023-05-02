import { DeleteFilled, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Checkbox, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useNavigation, useParams } from 'react-router-dom';
import { GenerateUuuid4 } from '../../features/generateUuid';
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
    "goodPrices": [],
    "barcodes": []
  }

const units = [{label: "шт", value: 796}, {label: "л", value: 112}, {label: "кг", value:166}];
const specialTypes = [{ label: " ", value:0}, { label: "Пиво", value:1}, { label: "Тара", value:2}, { label: "Пакет", value:3},];

const handleEditPrice = (setGood, goodPrice, value) => setGood(prev => ({...prev, goodPrices: prev.goodPrices.map(p=>{
    if(goodPrice===p) p.price = value;
    return p;
}) })
)

const handleEditBarcode = (setGood, barcode, value) => setGood(prev => ({...prev, barcodes: prev.barcodes.map(x => {
    if(barcode===x) x.code=value;
    return x;
})}))

const handleRemoveBarcode = (setGood, barcode) => setGood(prev => ({...prev, barcodes: prev.barcodes.map(x => {
    if(barcode===x) x.isDeleted=!x.isDeleted;
    return x;
}).filter(b=>(b.id!==0 & b.isDeleted) || !b.isDeleted)}))

const handleChangePriceMain = (setGood, value) => setGood(prev => ({...prev, price: value, goodPrices: prev.goodPrices.map(p => ({...p, price: value}) )}));

const save = async (good, shopId, setGood) => {
    try{
        good.price = parseFloat(good.price);
        good.goodPrices.forEach(p=>p.price=parseFloat(p.price));
        if(good.id===0){
            const resp = await $api.post(`/${shopId}/goods`, good);
            setGood(resp.data);
        }
        if(good.id!==0){
            const resp = await $api.put(`/${shopId}/goods`, good);
            setGood(resp.data);
        }
    }
    catch(e){
        const {code, data} = e.response;
        if(code === 500)
            alert("Ошибка сохранения! " + data.message);
        else
            alert("Ошибка сохранения");
        console.error(e);
    }
}

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
            const shops = resp.data;
            setShops(resp.data);
            if(id) {
                resp = await $api.get(`/${shop.id}/goods/${id}`);
                resp.data.barcodes.forEach(b=> { b.isDeleted = false; b.uuid = GenerateUuuid4(); });
                resp.data.goodPrices.forEach(p => p.uuid = GenerateUuuid4() );
                setGood(resp.data);
            }
            else {
                resp = await $api.get("/SystemConfiguration");
                if(resp.data.ownerGoodForShops)
                    setGood(prev => ( {...prev, goodPrices:  [{id:0, shopId: shop.id, price: null, uuid: GenerateUuuid4() }] } ))
                else
                    setGood(prev => ({...prev, goodPrices: shops.map(s=> ({id: 0, shopId: s.id, price: null, uuid: GenerateUuuid4() }))}));
            }
        }
        getGroups();
    }, []);

    const handleAddBarcode = () => {
        setGood(prev=> ({ ...prev, barcodes: [...prev.barcodes, {id: 0, code: "", isDeleted: false, uuid: GenerateUuuid4() }] }));
    }

    const selectedGroup = groups?.find(g=>g.id===good.goodGroupId);
    const selectedSupplier = suppliers?.find(s=>s.id===good.supplierId);
    const selectedUnit = units?.find(s=>s.value===good.unit);
    const selectSpecialType = specialTypes?.find(s=>s.value===good.specialType);

    return (
        <div className={styles.actionContainer}>
            <div className={styles.actionPanel}>
                <Button type="primary" onClick={_ => save(good, shop.id, setGood)}>
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
                    {selectedSupplier!==undefined && selectedSupplier.id!==null && 
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
                    <Input value={good.article ?? ""} onChange={e=>setGood(prev => ({...prev, article:e.target.value}))} />
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
                    <Input value={good.vPackage ?? ""} onChange={e=>setGood(prev=>({...prev, vPackage: e.target.value.replace(",", ".") }))} />
                </div>
                <div>
                    <Checkbox checked={good.isDeleted} onChange={_=>setGood(prev => ({...prev, isDeleted: !prev.isDeleted }) )}>Удален</Checkbox>
                </div>
                <div style={{border: "solid 1px lightgray", padding: "5px", marginTop: "10px"}}>
                    <div>
                        <label>Цена</label>
                        <Input value={good.price ?? ""} onChange={e => handleChangePriceMain(setGood, e.target.value) } />
                    </div>
                    {good.goodPrices.map(g=> <div key={g.uuid} style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <label>{shops.find(s=>s.id===g.shopId)?.alias}</label>
                        <Input value={g.price ?? ""} 
                            onChange={e => handleEditPrice(setGood, g, e.target.value)} />
                    </div>)}
                </div>
                <div style={{border: "solid 1px lightgray", padding: "5px", marginTop: "10px"}}>
                    <div>
                        <label style={{marginRight: "10px"}}>Штрихкоды</label>
                        <Button onClick={handleAddBarcode}><PlusOutlined /> штрих код</Button>
                    </div>
                    {good.barcodes.filter(b=>!b.isDeleted).map(b=> <div key={b.uuid} style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <Input value={b.code} 
                        onChange={e => handleEditBarcode(setGood, b, e.target.value)} />
                        <Button onClick={_ => handleRemoveBarcode(setGood, b)}><DeleteFilled /></Button>
                    </div>)}
                </div>
                
            </div>
        </div>
    )
}

export default GoodEditPage;