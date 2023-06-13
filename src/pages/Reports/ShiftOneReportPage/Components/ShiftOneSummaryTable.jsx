import { Table } from "antd"
import { useEffect, useState } from "react"
import $api from "../../../../http/api";

const columns = [
    {
        title: 'Товар',
        dataIndex: "goodName",
        key: "goodName",
    },
    {
        title: 'Ед',
        dataIndex: "unitStr",
        key: "unitStr",
    },
    {
        title: 'Кол-во',
        dataIndex: "count",
        key: "count",
    },
    {
        title: 'Сумма',
        dataIndex: "sum",
        key: "sum",
    },
    {
        title: 'Возврат сумма',
        dataIndex: "sumReturn",
        key: "sumReturn",
    }
]

const ShiftOneSummaryTable = ({shop, shiftId}) => {
    const [summary, setSummary] = useState([]);
    useEffect(()=>{
        const getSummary = async () => {
            const resp = await $api.get(`/${shop?.id}/reports/shiftsummary/${shiftId}`);
            setSummary(resp.data);
        }
        getSummary();
    }, [shiftId])
    return <Table columns={columns} dataSource={summary} pagination={false} />
}

export default ShiftOneSummaryTable;