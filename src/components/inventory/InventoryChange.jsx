import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import $api from "../../http/api";
import styles from "./inventory.module.scss"
import InventoryChangeGood from "./InventoryChangeGood";
import InventoryChangeGroups from "./InventoryChangeGroups";

let barcode = "";
let prevKeyDown = undefined;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function InventoryChange({inventory, setInventory}){
    const shopId = useSelector(state=>state.shop.value.id);
    const [selectGroup, setSelectGroup] = useState(null);
    
    const keyDownHandle = useCallback(({key})=>{
        const getGood = async () => {
            try{
                const resp = await $api.get(`/${shopId}/goods/scan/${barcode}`);
                const goodScan = resp.data;
                setInventory(prev => {
                    let group = prev.inventoryGroups.filter(gr => gr.id === selectGroup.id)[0];
                    let goods = group.inventoryGoods;
                    if(goods.filter(g=>g.goodId === goodScan.id).length===0)
                        group.inventoryGoods = [...goods, {id:0, goodId: goodScan.id, goodName: goodScan.name, price: goodScan.price, countFact: null, countAppend: null, uuid: getRandomInt(0, 10000)}];
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
    
    return (
        <>
            <InventoryChangeGroups inventory={inventory} setInventory={setInventory} selectGroup={selectGroup} setSelectGroup={setSelectGroup} />
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Товар</th>
                            <th>Цена</th>
                            <th>Кол-во</th>
                            <th>Изменен</th>
                        </tr>
                    </thead>
                    <tbody>
                        { getGoods().map((good, i)=>
                            <InventoryChangeGood key={good.uuid} groupId={selectGroup?.id} good={good} setInventory={setInventory} />
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}