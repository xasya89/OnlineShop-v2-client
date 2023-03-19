import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import $api from "../../http/api";
import styles from "./inventory.module.scss"


export default function InventoryChange({inventory, setInventory}){
    const shopId = useSelector(state=>state.shop.value.id);
    const [selectGroup, setSelectGroup] = useState(null);
    const selectedGroupRef = useRef();
    const [newGroupName, setNewGroupName] = useState("");
    useLayoutEffect(()=>selectedGroupRef.current && selectedGroupRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    }), [inventory]);
    
    const [barcode, setBarCode] = useState("");
    const keyDownHandle = useCallback(({key})=>{
        const getGood = async (barcode) => {
            try{
                const resp = await $api.get(`/${shopId}/goods/scan/${barcode}`);
            }catch({response}){
                if(response?.status===500 && response.data.type=="ServiceError")
                    alert(response.data.message);
            }
            setBarCode("");
        }

        if(!isNaN(parseInt(key)))
            setBarCode(prev=>`${prev}${key}`);
        if(key==="Enter")
            getGood(barcode);
    })
    useEffect(()=>{
        window.addEventListener("keydown", keyDownHandle);
        return () => window.removeEventListener("keydown", keyDownHandle);
    }, [keyDownHandle]);

    const hasSelectedGroup = (group) => selectGroup?.id==group.id ? styles.groupSelected : "";

    

    const addGroup = async () => {
        try{
            const response = await $api.post(`/${shopId}/inventory/${inventory.id}/addgroup`,{name:newGroupName});
            setInventory(prev=>{
                const oldGroups = prev.inventoryGroups.map(item=>{return {...item}; });
                oldGroups.push({id: response.data.id, name: response.data.name});
                return {...prev, inventoryGroups: oldGroups}
            });
            setNewGroupName("");
        }
        catch({response}){
            alert(response.message);
        }
    }

    const groupsCount = inventory?.inventoryGroups?.length ?? -1;
    return (
        <div className={styles.groupPanel}>
                <ul className={styles.groups}>
                    {inventory?.inventoryGroups.map((gr, i)=> {
                        console.log(groupsCount);
                        if(groupsCount-1==i)
                            return (<li ref={selectedGroupRef} onClick={()=>setSelectGroup(gr)} key={gr.id} className={hasSelectedGroup(gr)}><h4>{gr.name}</h4></li>);
                        else
                            return <li onClick={()=>setSelectGroup(gr)} key={gr.id} className={hasSelectedGroup(gr)}><h4>{gr.name}</h4></li>;
                    })}
                </ul>
                <div>
                    <input value={newGroupName} onChange={e=>setNewGroupName(e.target.value)}/>
                    <button onClick={()=>addGroup()}>Добавить</button>
                </div>
        </div>
    )
}