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
import GoodChoose from '../GoodChooseComponent/GoodChooseComponent';

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

    const addGood = async goods => {
        if(!selectGroup)
            return;
        //Проверим не сущесвует в выбранной группе
        let appendedGoods = inventory.inventoryGroups.filter(gr => gr.id === selectGroup.id)[0].inventoryGoods;
        const appendGoods = goods.filter(g=>appendedGoods.find(a=>a.goodId===g.id)===undefined);
        if(appendGoods.length===0) return;
        try{
            const resp = await $api.post(`/${shopId}/inventory/${inventory.id}/goods`, 
                appendGoods.map(g=>({id: 0, inventoryGroupId: selectGroup.id, goodId: g.id, countFact: 0, state: STATUS_ADD}))
            );
        
            setInventory(prev => {
                let group = prev.inventoryGroups.filter(gr => gr.id === selectGroup.id)[0];
                group.inventoryGoods = group.inventoryGoods.concat(resp.data.map(r=>({
                    id: r.id,
                    goodId: r.goodId,
                    goodName: r.goodName,
                    price: r.price,
                    countFact: null,
                    countAppend: null,
                    uuid: getRandomInt(0, 10000),
                    state: STATUS_EDIT
                })));
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
                .map(g=>{ return {id: g.id, inventoryGroupId: group.id, goodId: g.goodId, countFact: g.countFact, state: g.state} }));
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
                .map(g=>{ return {id: g.id, inventoryGroupId: group.id, goodId: g.goodId, countFact: g.countFact, state: g.state} }));
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

    const calcSumAll = inventory?.inventoryGroups?.reduce( (sum, group) =>  sum + group.inventoryGoods?.reduce( (sum, good) => sum + good.price * (good.countFact ?? 0), 0 ), 0) ?? 0;
    const calcSumGroup = inventory?.inventoryGroups?.filter(gr=>gr.id===selectGroup?.id).reduce( (sum, group) =>  sum + group.inventoryGoods?.reduce( (sum, good) => sum + good.price * (good.countFact ?? 0), 0 ), 0) ?? 0;
    
    return (
        <div style={{display: "grid", gridTemplateRows: "auto 1fr", height:"calc(100vh - 40px)"}}>
            <div>    
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
                
                <div style={{margin: "5px"}}>
                    <GoodChoose onChoosed={e=>addGood(e)} />
                </div>
            </div>
            <div style={{overflow: "scroll"}}>
                    <InventoryChangeGoods groupId={selectGroup?.id} goods={getGoods()} setInventory={setInventory} />
            </div>
        </div>
    )
}