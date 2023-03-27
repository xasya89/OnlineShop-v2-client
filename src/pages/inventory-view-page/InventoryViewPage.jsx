import { Button, Checkbox, Input, Table } from "antd";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import $api from "../../http/api";

const columns = [
    {
        title: "Товар",
        dataIndex: "goodName",
        render: (goodName) => goodName
    },
    {
        title: "Цена",
        dataIndex: "price",
        render: (price) => price
    },
    {
        title: "Было",
        dataIndex: "countOld",
        render: (countOld) => countOld
    },
    {
        title: "Текущее",
        dataIndex: "countCurrent",
        render: (countCurrent) => countCurrent
    },
    {
        title: "Разница",
        dataIndex: "countDiff",
        render: (countDiff) => countDiff
    },
    {
        title: "Сумма",
        dataIndex: "priceDiif",
        render: (priceDiif) => priceDiif
    },
]

const printInventory = async (shopId, id, {search, diffFlag}) => {
  const newWindow= window.open();
  newWindow.document.head.innerHTML = `
  <style>
  table {
    width: 100%;
    margin-bottom: 20px;
    border: 1px solid #dddddd;
    border-collapse: collapse; 
  }
  table th {
    font-weight: bold;
    padding: 5px;
    background: #efefef;
    border: 1px solid #dddddd;
  }
  table td {
    border: 1px solid #dddddd;
    padding: 2px;
  }
  </style>
  `;
  const resp = await $api.get(`/${shopId}/inventory-view/${id}?search=${search}&isDiff=${diffFlag}`);
  let trList = newWindow.document.createElement("tbody");
  resp.data.inventorySummaryGoods.forEach(summary =>{
    const tr = newWindow.document.createElement("tr");
    tr.innerHTML=`<td>${summary.goodName}</td>
    <td>${summary.price}</td>
    <td>${summary.countOld}</td>
    <td>${summary.countCurrent}</td>
    <td>${summary.countDiff}</td>
    <td>${summary.priceDiif}</td>`;
    trList.append(tr);
  });
  const table = newWindow.document.createElement("table");
  table.setAttribute('border','1');
  table.innerHTML = `<thead>
    <tr>
      <th rowspan='2'>Товар</th>
      <th rowspan='2'>Цена</th>
      <th>Кол-во было</th>
      <th>Кол-во факт</th>
      <th rowspan='2'>Расх кол-во</th>
      <th rowspan='2'>Расх руб</th>
    </tr>
  </thead>`;
  table.append(trList);
  newWindow.document.body.appendChild(table);
  newWindow.print();
}

export default function InventoryViewPage () {
    const {id} = useParams();
    const shopId = useSelector(state=>state.shop.value.id);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tableParams, setTableParams] = useState({
        search: "",
        diffFlag: true,
        pagination: {
          current: 1,
          pageSize: 50,
        },
      });

    const fetchData = async () => {
        setIsLoading(true);
        const resp = await $api.get(`/${shopId}/inventory-view/${id}?search=${tableParams.search}&page=${tableParams.pagination.current}&pageSize=${tableParams.pagination.pageSize}&isDiff=${tableParams.diffFlag}`);
        setData(resp.data.inventorySummaryGoods);
        setIsLoading(false);
        setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: resp.data.total,
            },
          });
    }

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
          pagination,
          filters,
          ...sorter,
        });
    
        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
          setData([]);
        }
      };
      
    useEffect(()=> { fetchData() }, [JSON.stringify(tableParams)]);
    /*
    const handleChangeSearch = useRef(value => { console.log(value); debounce(() => { console.log("Debounce", value); setSearch(value) }, 300) });
    useEffect(()=> handleChangeSearch.current(searchValue), [searchValue])
   */
  /*
    const handleChangeSearch = useCallback( e =>{
        setSearchValue(e.target.value);
        debounce(()=>{ console.log("debounce"); fetchData() }, 300);
    }, []);
*/
    const handleChangeSearch = useRef( value=> setTableParams({...tableParams, search: value}));
    return (
        <div>

            <Button onClick={e=>printInventory(shopId, id, tableParams)}>print</Button>
            <Input  onInput={e => { handleChangeSearch.current(e.target.value); }} placeholder="поиск" />
            <Checkbox checked={tableParams.diffFlag} onChange={e=>setTableParams({...tableParams, diffFlag: e.target.checked})}>Отображать только расхождение</Checkbox>
            <Table columns={columns} dataSource={data} rowKey={(record)=>record.id} loading={isLoading} pagination={tableParams.pagination} onChange={handleTableChange}/>
        </div>
    )
}