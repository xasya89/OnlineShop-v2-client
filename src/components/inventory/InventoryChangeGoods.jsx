import { Table } from "antd"
import InventoryChangeGood from "./InventoryChangeGood"
import styles from './inventory.module.scss'

export default function InventoryChangeGoods({groupId, goods, setInventory }){
    const columnsTemplate = [
        {
            title: 'Товар',
            dataIndex: 'goodName',
            key: 'goodName',
            render: (text, record) => <span>{text}</span>,
        },
        {
            title: 'Цена',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => <span>{text}</span>,
        },
        {
            title: 'Колв-во',
            dataIndex: 'countFact',
            key: 'countFact',
            render: (text, record) => <InventoryChangeGood key={record.uuid} groupId={groupId} good={record} setInventory={setInventory}/>,
        },
        {
            title: 'Ед',
            dataIndex: 'good.unit',
            key: 'good.unit',
            render: (text, record) => <span>{text}</span>,
        },
        /*
        {
            title: 'Изменено',
            dataIndex: 'change',
            key: 'change',
            render: (text, record) => <span>{text}</span>,
        },
        */
    ]

    return (
        <div className={styles.tableDiv}>
            <Table columns={columnsTemplate} dataSource={goods} pagination={false} size="small"/>
        </div>
    )
}