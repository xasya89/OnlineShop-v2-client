import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import InventoryChange from "../../components/inventory/InventoryChange";
import $api from "../../http/api";

export default function InventoryPage(){
    const shopId = useSelector(state=>state.shop.value.id);
    const navigate = useNavigate();
    const {id} = useParams();
    const [inventory, setInventory] = useState(null);
    useEffect(()=>{
        const getInventory = async () => {
            try{
                const resp = await $api.get(`/${shopId}/inventory/${id}`);
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