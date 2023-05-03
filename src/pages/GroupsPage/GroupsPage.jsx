import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import $api from '../../http/api';
import styles from './GroupsPage.module.scss';

const columns = [
    {
        title: '',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => <>
            <Button onClick={e=> deleteGroup(e, record) }><DeleteFilled /></Button>
            <Button><EditFilled /></Button>
        </>
    },
    {
        title: '',
        dataIndex: 'name',
        key: 'name',
    }
]

let setGroupsRef= null;
const deleteGroup = async (e, group) => {
    e.preventDefault();
    e.stopPropagation();
    if(window.confirm(`Удалить группу ${group.name} ?`)){
        await $api.delete(`/${group.shopId}/goodgroups/${group.id}`);
        setGroupsRef(prev=>prev.filter(g=>g.id!==group.id));
    }
}

const GroupsPage = () => {
    const shop = useSelector(state=>state.shop.value);
    const [groups, setGroups] = useState([]);
    setGroupsRef = setGroups;
    const [selectGroup, setSelectGroup] = useState({id: 0, name: "", shopId: shop?.id});
    const [isOpen, setIsOpen] = useState(false);

    useEffect(()=>{
        const getGroups = async () => {
            const resp = await $api.get(`/${shop?.id}/goodgroups`);
            setGroups(resp.data);
        }
        getGroups();
    },[])

    const startCreate = () => {
        setSelectGroup({id: 0, name: "", shopId: shop?.id});
        setIsOpen(true);
    }
    const startEdit = (group) => {
        setSelectGroup(group);
        setIsOpen(true);
    }
    const save = async () => {
        if(selectGroup.id===0){
            const resp = await $api.post(`/${shop?.id}/goodgroups`,selectGroup);
            setGroups(prev=>[...prev, resp.data]);
        }
        else{
            const resp = await $api.put(`/${shop?.id}/goodgroups/${selectGroup?.id}`, selectGroup);
            setGroups(prev=>prev.map(g=>{
                if(g.id===resp.data.id)
                    return {...g, name: resp.data.name};
                return {...g};
            }))
        }
        setIsOpen(false);
    }
    const cancel = () => setIsOpen(false);

    return (
        <div className={styles.actionContainer}>
            <div className={styles.actionPanel}>
                <Button onClick={startCreate} type="primary">
                    <PlusOutlined />
                    Создать
                </Button>
            </div>
            <Table columns={columns} rowKey={record=>record.id} dataSource={groups} size="small" pagination={{pageSize: 50}}
                onRow={(record, rowIndex) => { 
                    return { onClick: (event) => { startEdit(record); }, };
                }} />
            <Modal open={isOpen} onCancel={cancel} onOk={save} title="Группа">
                <Input value={selectGroup.name} onChange={e=>setSelectGroup({...selectGroup, name: e.target.value})} />
            </Modal>
        </div>
    )
}

export default GroupsPage;