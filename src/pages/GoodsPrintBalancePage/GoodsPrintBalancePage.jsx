import {  PrinterFilled } from '@ant-design/icons';
import { Button, Checkbox, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import $api from '../../http/api';
import styles from './GoodsPrintBalancePage.module.scss';

const columns = [
    {
        title: 'Товар',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Ед',
        dataIndex: 'unit',
        key: 'unit',
        render: (text, record) => {
            let unitStr = "";
            if(record.unit===796) unitStr = "шт";
            if(record.unit===112) unitStr = "л";
            if(record.unit===166) unitStr = "кг";
            return <>{unitStr}</>
        }
    },
    {
        title: 'Цена',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Остаток',
        dataIndex: 'currentCount',
        key: 'currentCount',
    },
    {
        title: '',
        dataIndex: 'note',
        key: 'note',
    },
]


const GoodsPrintBalancePage = () => {
    const shop = useSelector(state=>state.shop.value);
    const navigate = useNavigate();
    const [goods, setGoods] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedSuppliers, setSelectedSuppliers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [viewRemoved, setViewRemoved] = useState(false);
    const [viewNegativeBalance, setViewNegativeBalance] = useState(false);

    const handleOnChangeGroups = (value) => setSelectedGroups( groups.filter(g=>value.includes(g.id)) );
    const handleOnChangeSupplier = (value) => setSelectedGroups( suppliers.filter(g=>value === g.id) );

    const handlePrint = () => {
        const mywindow = window.open('', 'PRINT');
        mywindow.document.write('<html><head><title>' + document.title  + '</title>');
        mywindow.document.write(`<style>
        @media print {
            body {-webkit-print-color-adjust: exact;}
            }
        table{
            border: 1px solid #eee;
            table-layout: fixed;
            width: 100%;
            margin-bottom: 20px;
        }
        table th {
            text-align:center;
            font-weight: bold;
            padding: 5px;
            background: #efefef;
            border: 1px solid #dddddd;
        }
        table td{
            padding: 5px 10px;
            border: 1px solid #eee;
            text-align: left;
        }
        table tbody tr:nth-child(odd){
            background: #fff;
        }
        table tbody tr:nth-child(even){
            background: #F7F7F7;
        }
        </style></head><body >`);

        mywindow.document.write('<table>');
        mywindow.document.write(`<thead><tr>
            <th style="width:60%">Товар</th>
            <th style="width:10%">Цена</th>
            <th style="width:10%">Кол-во</th>
            <th style="width:20%">Расхождение</th>
        </tr></thead>`);
        mywindow.document.write('<tbody>');
        groups.forEach(gr=>{
            mywindow.document.write(`<tr><th colspan=4>${gr.name}</th></tr>`);
            goods.filter(g=>g.goodGroupId===gr.id).forEach(g=>{
                mywindow.document.write(`<tr>
                <td style="width:60%">${g.name}</td>
                <td style="width:10%">${g.price}</td>
                <td style="width:10%">${g.currentCount}</td>
                <td style="width:20%"></td>
                </tr>`);
            })
        })
        mywindow.document.write('</tbody>');
        mywindow.document.write('</table>');
        mywindow.document.write('</body></html>');
        mywindow.document.close();
        mywindow.focus();
        mywindow.print();
        mywindow.close();
        return true;
    }

    useEffect(()=>{
        const getData = async () => {
            let resp =await $api.get(`/${shop?.id}/goodgroups`);
            setGroups(resp.data);
            resp = await $api.get(`/${shop?.id}/suppliers`);
            setSuppliers([{id:null, name:""}].concat(resp.data));
        };
        getData();
    },[]);

    useEffect(() => {
        const getGoods = async () => {
            let groups = "";
            selectedGroups.forEach(g=> { groups = groups + `groups=${g.id}&` });
            let suppliers = "";
            selectedSuppliers.forEach(s=> { suppliers = suppliers + `suppliers=${s.id}&` });
            let resp = await $api.get(`/${shop?.id}/currentbalance?${groups}${suppliers}skipDeleted=${!viewRemoved}&viewNegativeBalance=${viewNegativeBalance}`);
            setGoods(resp.data);
        };
        getGoods();
    }, [selectedGroups, selectedSuppliers, viewRemoved, viewNegativeBalance]);

    return (
        <div className={styles.actionContainer}>
            <div className={styles.actionPanel}>
                <Button type="primary" onClick={handlePrint}>
                    <PrinterFilled />
                    Печать
                </Button>
                <Select onChange={handleOnChangeGroups} mode="multiple" placeholder="Фильтр по группам" style={{width: "200px"}} options={groups.map(g=>({value: g.id, label: g.name}))}/>
                <Select onChange={handleOnChangeSupplier} placeholder="Фильтр по поставщикам" style={{width: "200px"}} options={suppliers.map(g=>({value: g.id, label: g.name}))}/>
                <Checkbox onChange={_ => setViewRemoved(prev=>!prev)}>Отображать удаленные</Checkbox>
                <Checkbox onChange={_ => setViewNegativeBalance(prev=>!prev)}>Отобразить отрицательный баланс</Checkbox>
            </div>
            <div>
                <Table columns={columns} rowKey={x=>x.id} dataSource={goods} size="small" pagination={false}/>
            </div>
        </div>
    )
}


export default GoodsPrintBalancePage;