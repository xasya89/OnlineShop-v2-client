import { Button, Input } from "antd";
import { useEffect, useLayoutEffect, useRef, useState } 
from "react";import $api from "../../http/api";
import styles from "./inventory.module.scss"
import InventoryChangeGroup from "./InventoryChangeGroupEdit";

export default function InventoryChangeGroups ({inventory, setInventory, selectGroup, setSelectGroup}){
    const selectedGroupRef = useRef();
    const [newGroupName, setNewGroupName] = useState("");
    const [firstRender, setFirstRender] = useState(false);

    const groupsCount = inventory?.inventoryGroups?.length ?? -1;
    
    useEffect(()=>{
        if(!firstRender && inventory && inventory?.inventoryGroups.length>0)
        {
            const group = inventory.inventoryGroups[groupsCount - 1];
            setSelectGroup({ id: group.id, name: group.name});
            setFirstRender(true);
        }
    }, [inventory, firstRender]);
    /*
    useLayoutEffect(()=>selectedGroupRef.current && selectedGroupRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    }), [selectGroup]);
    */
    const addGroup = async () => {
        try{
            const response = await $api.post(`/${inventory.shopId}/inventory/${inventory.id}/addgroup`,{name:newGroupName});
            setInventory(prev=>{
                const oldGroups = prev.inventoryGroups.map(item=>{return {...item}; });
                oldGroups.push({id: response.data.id, name: response.data.name, inventoryGoods: []});
                return {...prev, inventoryGroups: oldGroups}
            });
            setSelectGroup({id: response.data.id, name: response.data.name});
            setNewGroupName("");
        }
        catch({response}){
            alert(response.message);
        }
    }
    
    const hasSelectedClass = (group) => selectGroup?.id==group.id ? styles.groupSelected : "";
    return ( 
        <div className={styles.groupPanel}>
            <ul className={styles.groups}>
                {inventory?.inventoryGroups.map((gr, i)=> {
                    if(selectGroup?.id===gr.id)
                        return <li ref={selectedGroupRef} onClick={()=>setSelectGroup({...gr})} key={gr.id} className={hasSelectedClass(gr)}><h4>{gr.name}</h4></li>;
                    else
                        return <li onClick={()=>setSelectGroup({...gr})} key={gr.id} className={hasSelectedClass(gr)}><h4>{gr.name}</h4></li>;
                })}
            </ul>
            <ul className={styles.groups}>
                {inventory?.inventoryGroups.map((gr, i)=>
                    <InventoryChangeGroup shopId={inventory.shopId} inventoryId={inventory.id} setInventory={setInventory}  group={gr} setSelectGroup={setSelectGroup} key={gr.id} isSelected={(selectGroup?.id==gr.id)} />
                    )}
            </ul>
            <div>
                <Input value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} addonAfter={<span onClick={()=>addGroup()} style={{cursor: "pointer"}}>Добавить</span>} />
            </div>
        </div>
    )
}