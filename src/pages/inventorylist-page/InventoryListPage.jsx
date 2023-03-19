import { useSelector } from "react-redux";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import $api from "../../http/api";

export default function InventoryListPage(){
    const shop = useSelector(state=>state.shop.value);
    const navigation = useNavigate();

    const startNewInventory = async () => {
        try{
            const resp = await $api.post(`/${shop?.id}/inventory/legacystart/${shop.legacyDbNum}`);
            navigation(`/documents/inventory/${resp.data.id}`);
        }
        catch({response}){
            if(response?.status === 500 && response.data.type=="ServiceError")
                alert(response.data.message);
        }
    }

    return(
        <div>
            <div>
                <button onClick={startNewInventory}>Создать</button>
            </div>
        </div>
    )
}