import { EditOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons/lib/components/Icon";
import { Button, Input, Modal } from "antd";
import { useLayoutEffect, useRef, useState } from "react"
import $api from "../../http/api";
import styles from "./inventory.module.scss"

export default function InventoryChangeGroup({shopId, inventoryId, group, setSelectGroup, isSelected, setInventory}) {
    const selectRef = useRef();
    const [value, setValue] = useState(group.name);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    useLayoutEffect(()=>selectRef.current && selectRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    }), [isSelected]);

    const showEditModal = e => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        setOpen(true);
    }
    
    const handleOk = () => {
        setConfirmLoading(true);
        $api.put(`/${shopId}/inventory/${inventoryId}/groups/${group.id}`, {name: value})
            .then(resp =>{
                setConfirmLoading(false);
                setOpen(false);
                setInventory(prev=>{return {...prev, inventoryGroups: prev.inventoryGroups
                    .map(gr=>{
                        if(gr.id===group.id)
                            return {...gr, name: value};
                        return {...gr};
                    }
                )}})
            })
            .catch(e=>{});
    };
    
    const handleCancel = () => {
        setOpen(false);
    }

    return (
        <>
            {isSelected ? 
            <li ref={selectRef} onClick={()=>setSelectGroup({...group})} className={styles.groupSelected} style={{display: "flex", alignItems:"center"}}>
                <h4 style={{marginRight: "5px"}}>{group.name}</h4>
                <EditOutlined onClick={showEditModal}/>
            </li> :
            <li ref={selectRef} onClick={()=>setSelectGroup({...group})} style={{display: "flex", alignItems:"center"}}>
                <h4 style={{marginRight: "5px"}}>{group.name}</h4>
                <EditOutlined onClick={showEditModal}/>
            </li>}
            <Modal open={open} title="Title" onOk={handleOk} onCancel={handleCancel} confirmLoading={confirmLoading}>
                <Input value={value} onChange={e=>setValue(e.target.value)} />
            </Modal>
        </>
    )
}