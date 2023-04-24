import { Button, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SearchOutlined } from '@ant-design/icons';
import $api from "../../http/api";
import styles from './GoodChoose.module.scss'
import useDebounce from "../infrastructure/UseDebounce";

function unitToStr (unit) { 
    switch(unit){
        case 796: return "шт"; break;
        case 112: return "л"; break;
        case 166: return "кг"; break;
    }
}

const specialTypeToStr = (specialType) => ["", "Пиво", "Тара", "Пакет"][specialType];

const columns = [
    {
        title: 'Товар',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <>{record.name}</>,
    },
    {
        title: 'Ед',
        dataIndex: 'unit',
        key: 'unit',
        render: (text, record) => <>{unitToStr(record.unit)}</>,
    },
    {
        title: 'Цена',
        dataIndex: 'price',
        key: 'price',
        render: (text, record) => <>{record.price}</>,
    },
]


export default function GoodChooseModal({onSelected}) {
    const shop = useSelector(state=>state.shop.value);
    const [selectedGoods, setSelectedGoods] = useState([]);
    const [isOpen, setOpen] = useState(false);
    const [groups, setGroups] = useState([]);
    const [selectGroupId, setSelectGroupId] = useState(null);
    const [goods, setGoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const debounceSearchValue = useDebounce(search, 500);

    const onCancel = () => {
        setOpen(false);
        setSelectedGoods([]);
    }

    const onOk= () => {
        setOpen(false);
        onSelected(selectedGoods);
    }

    useEffect(()=>{
        const getGroups = async () => {
            const resp = await $api.get(`/${shop?.id}/goodgroups`);
            setGroups(resp.data);
        }
        getGroups();
    }, []);

    useEffect(() => {
        const getGoods = async () => {
            if(debounceSearchValue===""){
                setGoods([]);
                return;
            }
            setLoading(true);
            const resp = await $api.get(`/${shop?.id}/goods?skipDeleted=true&find=${debounceSearchValue}&page=1&count=100`);
            setGoods(resp.data.goods);
            setLoading(false);
        }
        getGoods();
    }, [debounceSearchValue]);

    useEffect(() => {
        const getGoods = async () => {
            setLoading(true);
            const resp = await $api.get(`/${shop?.id}/goods?skipDeleted=true&groups=${selectGroupId}&page=1&count=500`);
            setGoods(resp.data.goods);
            setLoading(false);
        };
        getGoods();
    }, [selectGroupId])
    
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedGoods(goods.filter(g=>selectedRowKeys.includes(g.id)));
        },
        getCheckboxProps: (record) => ({ disabled: false, name: record.name, }),
    };

    return (<>
        <Button onClick={_=>setOpen(true)}>Подобрать</Button>
        <Modal onCancel={onCancel} onOk={onOk} open={isOpen} title="Подбор товара" width={"90vw"}>
            <div>
                <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="поиск"/>
            </div>
            <div className={styles.modalDialog}>
                <div className={styles.modalDialogFirstDiv}>
                    <ul>
                        {groups.map(gr=><li onClick={_=>setSelectGroupId(gr.id)}>{gr.name}</li>)}
                    </ul>
                </div>
                <div className={styles.modalDialogGoodsTable}>
                    <Table columns={columns} rowSelection={{type: "checkbox", ...rowSelection }} rowKey={record=>record.id} dataSource={goods} size="small" loading={loading} pagination={false} />
                </div>
            </div>
        </Modal>
    </>)
}