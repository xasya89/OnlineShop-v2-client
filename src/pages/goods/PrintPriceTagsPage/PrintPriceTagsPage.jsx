import { PlusOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Select, Table } from 'antd';
import JsBarcode from 'jsbarcode';
import { useState } from 'react';
import Barcode from 'react-barcode';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GoodChooseAllFromSelectGroupComponent from '../../../components/GoodChooseAllFromSelectGroupComponent/GoodChooseAllFromSelectGroupComponent';
import GoodChooseComponent from '../../../components/GoodChooseComponent/GoodChooseComponent';
import styles from './PrintPriceTagsPage.module.scss';
import  RenderInWindow  from './PrintPriceTagsPageAction';

const makets = [{id:1, name: "Кассир"}, {id:2, name:"Витрина"}, {id:3, name: "Витрина 100г"}]

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
]

const print = (goods, maket) => {
    const goodsPrint = goods.map(g => g.barcodes.map(b => ({name: g.name, price: g.price, unit:g.unit, barcode:b.code}) )).flat(1);
    const newWindow = window.open();
    const doc = newWindow.document;
    const canv = doc.createElement("canvas");

    newWindow.document.write(JsBarcode(canv, "Hi!"));
    doc.appendChild(canv);
}

const PrintPriceTagsPage = () => {
    const shop = useSelector(state=>state.shop.value);
    const navigate = useNavigate();
    const [maket, setMaket] = useState(null);
    const [goods, setGoods] = useState([]);
    const [goodsIdSelect, setGoodsIdSelect] = useState([]);

    const handlePrint = () => {}

    const goodsAdd = list =>  setGoods(prev=> prev.concat(list.filter(g=> prev.find(x=>x.id===g.id)===undefined ) ) );

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => setGoodsIdSelect(selectedRowKeys),
        getCheckboxProps: (record) => ({
          disabled: false,
          name: record.name,
        }),
      };
    
    const rowSelectionRemove = () => setGoods(prev => prev.filter(g=> !goodsIdSelect.includes(g.id) ));
    const rowClearAll = () => setGoods([]);

    return (
        <div className={styles.actionContainer}>
            <div className={styles.actionPanel}>
                <div>Выберите макет</div>
                <div>
                    <Select onChange={val => setMaket(val)} options={makets.map(m => ({value: m.id, label: m.name}) )} style={{minWidth: "200px"}} />
                </div>
                <div>
                    <Button type="primary" onClick={_=>print(goods, maket)} disabled={maket===null}>
                        <PrinterOutlined />
                        Печать
                    </Button>
                </div>
            </div>
            <GoodChooseComponent onChoosed={goodsAdd}/>
            <GoodChooseAllFromSelectGroupComponent onChoosed={goodsAdd}/>
            <div>
                <Button onClick={rowSelectionRemove}>Удалить</Button>
                <Button onClick={rowClearAll}>Очистить все</Button>
            </div>
            <Table rowSelection={{type: "checkbox", ...rowSelection }} columns={columns} rowKey={e=>e.id} dataSource={goods} pagination={false} size="small"/>
            <RenderInWindow><Barcode value="12345" height={20} displayValue={false}/></RenderInWindow>
        </div>
    )
}

export default PrintPriceTagsPage;