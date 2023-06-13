import { Modal, Table } from "antd"
import { useState } from "react"

const columns = [
    {
        title: 'Вермя',
        dataIndex: "dateCreateStr",
        key: "dateCreateStr",
    },
    {
        title: 'Признак расчета',
        dataIndex: "typeSellStr",
        key: "typeSellStr",
    },
    {
        title: 'Оплата',
        dataIndex: "dateCreate",
        key: "dateCreate",
    },
    {
        title: 'Сумма',
        dataIndex: "sumBuy",
        key: "sumBuy",
    },
    {
        title: 'Скидка',
        dataIndex: "sumDiscont",
        key: "sumDiscont",
    },
]

const ShiftOneChecksTable = ({chekcs}) => {
    const [selectedCheck, setSelectedCheck] = useState(null);

    const closeModal = () => setSelectedCheck(null);
    return <div>
        <Table columns={columns} dataSource={chekcs} pagination={false} rowKey={r=>r.id} 
            onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {setSelectedCheck(record)}, // click row
                  onDoubleClick: (event) => {}, // double click row
                  onContextMenu: (event) => {}, // right button click row
                  onMouseEnter: (event) => {}, // mouse enter row
                  onMouseLeave: (event) => {}, // mouse leave row
                };
              }}
        />
        <Modal title={selectedCheck?.dateCreateStr} open={selectedCheck!=null} onCancel={closeModal} onOk={closeModal}>
            <div>
                <h3>Время: {selectedCheck?.dateCreateStr}</h3>
                <h4>Наличные: {selectedCheck?.sumNoElectron}</h4>
                <h4>Безналичные: {selectedCheck?.sumElectron}</h4>
                <h4>Покупатель: {selectedCheck?.buyerPhone}</h4>
                <h4>Скидка: {selectedCheck?.sumDiscont}</h4>
                <div style={{overflowX: "scroll"}}>
                    <table style={{width: "100%"}}>
                        <tbody>
                            {selectedCheck && selectedCheck.checkGoods.map(ch=><tr key={ch.id}>
                                <td>{ch.goodName}</td>
                                <td>{ch.count} {ch.unitStr}</td>
                                <td>{ch.price} р.</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    </div>
}

export default ShiftOneChecksTable;