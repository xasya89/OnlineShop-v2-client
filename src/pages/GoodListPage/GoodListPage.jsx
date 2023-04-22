import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Dropdown, Input, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import GoodGroups from '../../components/GoodGroups/GoodGroups';
import $api from '../../http/api';
import styles from './GoodListPage.module.scss';

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
        render: (text, record) => <Link to={"/goodedit/"+record.id}>{record.name}</Link>,
    },
    {
        title: 'Группа',
        dataIndex: 'goodGroup.name',
        key: 'goodGroup.name',
        render: (text, record) => <Link to={"/goodedit/"+record.id}>{record.goodGroup.name}</Link>,
    },
    {
        title: 'Поставщик',
        dataIndex: 'supplier.name',
        key: 'suppliername',
        render: (text, record) => <Link to={"/goodedit/"+record.id}>{record.supplier?.name}</Link>,
    },
    {
        title: 'Ед',
        dataIndex: 'unit',
        key: 'unit',
        render: (text, record) => <Link to={"/goodedit/"+record.id}>{unitToStr(record.unit)}</Link>,
    },
    {
        title: 'Цена',
        dataIndex: 'price',
        key: 'price',
        render: (text, record) => <Link to={"/goodedit/"+record.id}>{record.price}</Link>,
    },
    {
        title: 'Спец тип',
        dataIndex: 'specialType',
        key: 'specialType',
        render: (text, record) => <Link to={"/goodedit/"+record.id}>{specialTypeToStr(record.specialType)}</Link>,
    },
    {
        title: '',
        dataIndex: 'isDeleted',
        key: 'isDeleted',
        render: (text, record) => <Link to={"/goodedit/"+record.id}>{record.isDeleted && <DeleteOutlined />}</Link>,
    },
]

const items = [
    {
      key: '1',
      label: (
        <Link to="/">Ценники</Link>
      ),
    },
    {
      key: '2',
      label: (
        <Link to="/goodsPrintBalance">Остатки</Link>
      ),
    },
  ];

const GoodListPage = () => {
    const shop = useSelector(state=>state.shop.value);
    const navigate = useNavigate();
    const [goods, setGoods] = useState([]);
    const [selectGroups, setSelectGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 50,
            total: 1
          },
    });
    const [search, setSearch] = useState("");
    const [skipDeleted, setSkipDeleted] = useState(true);

    const fetchData = async (current = 1) => {
        setLoading(true);
            try{
                let groups = "";
                selectGroups.forEach(g=> { groups = groups + `groups=${g.id}&` });
                const resp = await $api.get(`/${shop?.id}/goods?${groups}skipDeleted=${skipDeleted}&find=${search}&page=${current}&count=${tableParams.pagination.pageSize}`);
                setGoods(resp.data.goods);
                setTableParams(prev=>({...prev, pagination: {...prev.pagination, total: resp.data.total} }))
            }
            catch(e){
                console.error(e);
            }
        setLoading(false);
    }
    useEffect(()=>{
        fetchData();
    },[])
    useEffect(()=>{
        fetchData();
    }, [search, skipDeleted, selectGroups]);

    const handleNewGood = () => navigate("/goodedit");

    const handleTableChange = (pagination, filters, sorter) => {
        fetchData(pagination.current);
        setTableParams({
          pagination,
          filters,
          ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
          setGoods([]);
        }
      };

    return (
        <div className={styles.actionContainer}>
            <div className={styles.actionPanel} style={{marginBottom: "7px", width: "100%", display: "flex", justifyContent: "space-between"}}>
                <Space>
                    <Button type="primary" onClick={handleNewGood}>
                        <PlusOutlined />
                        Создать
                    </Button>
                    <Dropdown menu={{ items }} placement="bottom">
                        <Button>Печать</Button>
                    </Dropdown>
                </Space>
                <Space direction='horizontal'>
                    <GoodGroups shopId={shop.id} setSelectGroups={setSelectGroups} />
                </Space>
                <Space direction='horizontal' >
                    
                    <Checkbox onChange={_=>setSkipDeleted(!skipDeleted)}>Отображать удаленные</Checkbox>
                    <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск" maxLength={25}/>
                </Space>
            </div>
            <div>
                <Table columns={columns} rowKey={record=>record.id} dataSource={goods} size="small" loading={loading} pagination={tableParams.pagination} onChange={handleTableChange}/>
            </div>
        </div>
    )
}

export default GoodListPage;