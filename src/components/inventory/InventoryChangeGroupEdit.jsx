import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
    const [openRemove, setOpenRemove] = useState(false);
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

    const removeConfirm = () => setOpenRemove(true);
    const remove = ()=> {
        setConfirmLoading(true);
        const action = async () => {
            try{
                await $api.delete(`/${shopId}/inventory/${inventoryId}/groups/${group.id}`);
                setOpenRemove(false);
                setConfirmLoading(false);
                setInventory(prev=>({...prev, inventoryGroups: prev.inventoryGroups.filter(gr=>gr.id!==group.id)}));
            }
            catch(e){
                console.error("Ошибка удаления группы", e);
            }
        };
        action();
    }

    return (
        <>
            {isSelected ? 
            <li ref={selectRef} onClick={()=>setSelectGroup({...group})} className={styles.groupSelected} style={{display: "flex", alignItems:"center"}}>
                <h4 style={{marginRight: "5px"}}>{group.name}</h4>
                <EditOutlined onClick={showEditModal} style={{marginRight: "10px"}}/>
                <DeleteOutlined onClick={removeConfirm}/>
            </li> :
            <li ref={selectRef} onClick={()=>setSelectGroup({...group})} style={{display: "flex", alignItems:"center"}}>
                <h4 style={{marginRight: "5px"}}>{group.name}</h4>
                <EditOutlined onClick={showEditModal} style={{marginRight: "10px"}}/>
                <DeleteOutlined onClick={removeConfirm}/>
            </li>}
            <Modal open={open} title="Title" onOk={handleOk} onCancel={handleCancel} confirmLoading={confirmLoading}>
                <Input value={value} onChange={e=>setValue(e.target.value)} />
            </Modal>
            <Modal open={openRemove} title="" onOk={remove} onCancel={() => setOpenRemove(false)} confirmLoading={confirmLoading}>
                <p>Удалить группу {group.name} ?</p>
            </Modal>
        </>
    )
}