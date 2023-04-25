import { PlusOutlined } from "@ant-design/icons";
import { Button, Select } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import $api from "../../http/api";

export default function GoodChooseAllFromSelectGroupComponent ({onChoosed}){
    const shop = useSelector(state=>state.shop.value);
    const [groups, setGroups] = useState([]);
    const [selectGroup, setSelectGroup] = useState(null);

    useEffect(() => {
        const getGroups = async () => {
            const resp = await $api.get(`/${shop?.id}/goodgroups`);
            setGroups(resp.data);
        }
        getGroups();
    }, [])

    const handleChoose = async () => {
        const resp = await $api.get(`/${shop?.id}/goods?groups=${selectGroup}&page=1&count=500`);
        onChoosed(resp.data.goods);
    }
    

    return (<div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
        <div>Добавьте все товары выбранной группы: </div>
        <Select onChange={val => setSelectGroup(val)} defaultValue={null} options={groups.map(g=>({value: g.id, label: g.name}) )} style={{minWidth: "200px"}}/>
        <Button onClick={handleChoose}>
            <PlusOutlined />
            Добавить
        </Button>
    </div>)
}