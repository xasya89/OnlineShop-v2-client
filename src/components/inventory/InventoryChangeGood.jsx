import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react"
import { STATUS_ADD, STATUS_DELETE, STATUS_EDIT, STATUS_LOAD } from "./InventoryChangeGoodStatus";

export default function InventoryChangeGood({groupId, good, setInventory}) {
    const [value, setValue] = useState(good.countFact ?? "");
    const [initState, setInitState] = useState(false);
    const valueRef = useRef(good.countFact);

    const setDebounceValue = useCallback(
        debounce(()=>{ 
            setInventory(prev=>{
                let group = prev.inventoryGroups.filter(gr=>gr.id===groupId)[0];
                group.inventoryGoods=[...group.inventoryGoods.map(g=>{
                    if(g.goodId===good.goodId & g.uuid === good.uuid)
                        return {...g, countFact: valueRef.current==="" ? null : valueRef.current, state: g.state===STATUS_LOAD ? STATUS_EDIT : g.state};
                    return {...g, state: g.state};
                })];
                return {...prev};
            })
        },300)
    ,[]);

    useEffect(()=>{
        valueRef.current = value;
        if(initState)
            setDebounceValue();
        else
            setInitState(true);
    }, [value]);

    return (
        <tr>
            <td>{good.goodName}</td>
            <td>{good.price}</td>
            <td>
                <input value={value} onChange={e=>setValue(e.target.value.replace(",","."))} />
            </td>
            <td>{good.change}</td>
        </tr>
    )
}