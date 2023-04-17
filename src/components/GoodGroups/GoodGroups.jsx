import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Space } from "antd";
import { useEffect, useState } from "react";
import $api from "../../http/api";

export default function GoodGroups({shopId, setSelectGroups}){
    const [groups, setGroups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [value, setValue] = useState("");
    useEffect(() => {
        const getGroups = async () => {
            const resp = await $api.get(`/${shopId}/goodgroups`);
            setGroups(resp.data);
        }
        getGroups();
    }, []);

    const handleOnChange = (value) => {
        setSelectGroups( groups.filter(g=>value.includes(g.id)) )
    }

    const handleDialogOpen = async () => setIsModalOpen(true);

    const handleOk = async () => {
        if(value=="") return;
        try{
            const resp = await $api.post(`/${shopId}/goodgroups`,{
                name: value,
                shopId: 1
              });
            setGroups(prev=>[...prev, resp.data]);
            setSelectGroups(prev => [...prev, resp.data]);
            setIsModalOpen(false);
        }
        catch(e){
            alert(e);
        }
    }

    const handleCancel = () => setIsModalOpen(false);

    return (<>
        <Select onChange={handleOnChange} mode="multiple" placeholder="Фильтр по группам" style={{width: "200px"}} options={groups.map(g=>({value: g.id, label: g.name}))} />
        <Button onClick={handleDialogOpen}><PlusCircleOutlined/> группу</Button>
        <Modal onOk={handleOk} title="Новая группа" open={isModalOpen}>
            <Form name="basic" labelCol={{span: 8,}} wrapperCol={{span: 16,}} onFinish={handleOk} autoComplete="off">
                <div>
                    <label>Название</label>
                    <Input value={value} onChange={e=>setValue(e.target.value)} style={{width: "100%"}}/>
                </div>
            </Form>
        </Modal>
    </>)
}