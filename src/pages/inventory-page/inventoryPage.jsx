import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import InventoryChange from "../../components/inventory/InventoryChange";
import $api from "../../http/api";
import {STATUS_LOAD} from "../../components/inventory/InventoryChangeGoodStatus"

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function InventoryPage(){
    const shopId = useSelector(state=>state.shop.value.id);
    const navigate = useNavigate();
    const {id} = useParams();
    const [inventory, setInventory] = useState(null);
    useEffect(()=>{
        const getInventory = async () => {
            try{
                const resp = await $api.get(`/${shopId}/inventory/${id}`);
                resp.data.inventoryGroups.forEach(gr=>gr.inventoryGoods.forEach(g=>{
                    g.state=STATUS_LOAD;
                    g.uuid = getRandomInt(0,10000);
                }));
                setInventory(resp.data);
            }
            catch({response}){
                navigate("/document/inventorylist");
            }
        };
        if(inventory==null)
            getInventory();
    }, [inventory]);

    return (
        <InventoryChange inventory={inventory} setInventory={setInventory}/>
    )
}