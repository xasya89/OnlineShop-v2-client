import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react"

export default function InventoryChangeGood({groupId, good, setInventory}) {
    const [value, setValue] = useState(good.countFact ?? "");
    const valueRef = useRef(good.countFact);
    
    //useEffect(()=>setValue(good.value), []);

    const setDebounceValue = useCallback(
        debounce(()=>{ 
            setInventory(prev=>{
                let group = prev.inventoryGroups.filter(gr=>gr.id===groupId)[0];
                group.inventoryGoods=[...group.inventoryGoods.map(g=>{
                    if(g.goodId===good.goodId)
                        return {...g, countFact: valueRef.current};
                    return {...g};
                })];
                return {...prev};
            })
        },300)
    ,[]);

    useEffect(()=>{
        valueRef.current = value;
        setDebounceValue();
    }, [value]);

    return (
        <tr>
            <td>{good.goodName}</td>
            <td>
                <input value={value} onChange={e=>setValue(e.target.value.replace(",","."))} />
            </td>
            <td>{good.change}</td>
        </tr>
    )
}