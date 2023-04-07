import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import { Button, Space } from 'antd';
import $api from "../../http/api";
import styles from "./inventory.module.scss"
import InventoryChangeGood from "./InventoryChangeGood";
import InventoryChangeGoodSelector from "./InventoryChangeGoodSelector";
import InventoryChangeGroups from "./InventoryChangeGroups";
import { STATUS_ADD, STATUS_DELETE, STATUS_EDIT, STATUS_LOAD } from "./InventoryChangeGoodStatus";
import { useNavigate } from "react-router-dom";
import InventoryChangeGoods from "./InventoryChangeGoods";

let barcode = "";
let prevKeyDown = undefined;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function InventoryChange({inventory, setInventory}){
    const navigate = useNavigate();
    const shopId = useSelector(state=>state.shop.value.id);
    const [selectGroup, setSelectGroup] = useState(null);
    
    const keyDownHandle = useCallback(({key})=>{
        const getGood = async () => {
            try{
                const resp = await $api.get(`/${shopId}/goods/scan/${barcode}`);
                addGood(resp.data);
            }catch({response}){
                if(response?.status===500 && response.data.type=="ServiceError")
                    alert(response.data.message);
            }
            barcode="";
        }
        
        if(keyDownHandle!==undefined && Date.now() - prevKeyDown > 150)
            barcode="";

        if(!isNaN(parseInt(key)))
            barcode = `${barcode}${key}`;
        if(key==="Enter" && barcode.length>4)
            getGood();
        prevKeyDown = Date.now();
    })
    useEffect(()=>{
        window.addEventListener("keydown", keyDownHandle);
        return () => window.removeEventListener("keydown", keyDownHandle);
    }, [keyDownHandle]);
    
    const getGoods = () => {
        if(inventory==null)
            return [];
        const group = inventory?.inventoryGroups?.filter(gr=>gr.id===selectGroup?.id)[0];

        return group?.inventoryGoods ?? [];
    }

    const addGood = async good => {
        if(!selectGroup)
            return;
        //Проверим не сущесвует в выбранной группе
        let group = inventory.inventoryGroups.filter(gr => gr.id === selectGroup.id)[0];
        let goodAppended = group.inventoryGoods.filter(g=>g.id==good.id);
        if(goodAppended.length!==0)
            return;
        try{
            const resp = (await $api.post(`/${shopId}/inventory/${inventory.id}/goods`, 
                [{id: 0, groupId: group.id, goodId: good.id, countFact: 0, state: STATUS_ADD}]
            )).data;
        
            setInventory(prev => {
                let group = prev.inventoryGroups.filter(gr => gr.id === selectGroup.id)[0];
                let goods = group.inventoryGoods;
                if(goods.filter(g=>g.goodId === good.id).length===0)
                    group.inventoryGoods = [...goods, {
                        id:resp[0].id, 
                        goodId: good.id, 
                        goodName: good.name, 
                        price: good.price, 
                        countFact: null, 
                        countAppend: null, 
                        uuid: getRandomInt(0, 10000),
                        state: STATUS_EDIT
                    }];
                else
                    group.inventoryGoods = [...goods];
                /*
                else
                    group.inventoryGoods = goods.map(g=>{
                        if(g.goodId===goodScan.goodId){
                            if(goodScan.countFact){
                                if(!isNaN(parseFloat(goodScan.countFact))) // Добавить проыерку, что это штучный товар
                                    goodScan.countFact=parseFloat(goodScan.countFact) + 1;
                            }
                        }
                        return {...g};
                    });
                */
                return {...prev};
            })
        }
        catch(e){
            console.error("Ошибка добавления товара", e);
        }
    }

    const saveGoods = async () => {
        let chandgeArr  =[];
        inventory.inventoryGroups.forEach(group => {
            chandgeArr = chandgeArr.concat(group.inventoryGoods
                .filter(g=>g.state!==STATUS_LOAD)
                .map(g=>{ return {id: g.id, groupId: group.id, goodId: g.goodId, countFact: g.countFact, state: g.state} }));
        });
        try{
            const resp = (await $api.post(`/${shopId}/inventory/${inventory.id}/goods`, chandgeArr)).data;
            setInventory(prev => {
                prev.inventoryGroups = prev.inventoryGroups.map(gr=>{
                    gr.inventoryGoods = gr.inventoryGoods
                        .filter(g=>g.state!==STATUS_DELETE)
                        .map(g=>{
                            if(g.state===STATUS_ADD){
                                let goodResp = resp.filter(r=> r.groupId===gr.id & r.goodId===g.goodId)[0];
                                return {...g, id:goodResp.id, state: STATUS_LOAD};
                            }
                            return {...g, state: STATUS_LOAD};
                        });
                    return {...gr};
                })
                return {...prev};
            })
        }
        catch(e){
            alert(e);
        }
    }

    const complite = async () => {
        let chandgeArr  =[];
        inventory.inventoryGroups.forEach(group => {
            chandgeArr = chandgeArr.concat(group.inventoryGoods
                .filter(g=>g.state!==STATUS_LOAD)
                .map(g=>{ return {id: g.id, groupId: group.id, goodId: g.goodId, countFact: g.countFact, state: g.state} }));
        });
        try{
            const resp = await $api.post(`/${shopId}/inventory/${inventory.id}/complite`, chandgeArr);
            if(resp.status==200)
                navigate("/documents/inventorylist");
        }
        catch(e){
            alert(e);
        }
    }

    const cancel = () => navigate("/documents/inventorylist");

    const calcSumAll = inventory?.inventoryGroups?.reduce( (sum, group) =>  sum + group.inventoryGoods?.reduce( (sum, good) => sum + good.price * (good.countFact ?? 0), 0 ), 0);
    const calcSumGroup = inventory?.inventoryGroups?.filter(gr=>gr.id===selectGroup?.id).reduce( (sum, group) =>  sum + group.inventoryGoods?.reduce( (sum, good) => sum + good.price * (good.countFact ?? 0), 0 ), 0);
    
    return (
        <>
            <Space wrap size="large" style={{marginBottom: "20px"}}>
                <Button type="primary" size="default" onClick={saveGoods}>Созранить</Button>
                <Button size="default" onClick={cancel}>Закрыть</Button>
                <Button type="danger" onClick={complite} size="default">Завершить</Button>
            </Space>
            <div>
                <Space wrap size="large" style={{marginBottom: "20px", marginLeft: "5px"}}>
                    <h3>Сумма всего: {calcSumAll} в группе: {calcSumGroup}</h3>
                </Space>
            </div>
            <InventoryChangeGroups inventory={inventory} setInventory={setInventory} selectGroup={selectGroup} setSelectGroup={setSelectGroup} />
            <div>
                    
                <div style={{margin: "5px"}}>
                    <InventoryChangeGoodSelector onChange={addGood}/>
                </div>
                <InventoryChangeGoods groupId={selectGroup?.id} goods={getGoods()} setInventory={setInventory} />
            </div>
        </>
    )
}