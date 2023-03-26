import { Checkbox, Input, Table } from "antd";
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
        render: (goodName) => goodName
    },
    {
        title: "Текущее",
        dataIndex: "countCurrent",
        render: (goodName) => goodName
    },
    {
        title: "Разница",
        dataIndex: "countDiff",
        render: (goodName) => goodName
    },
    {
        title: "Сумма",
        dataIndex: "priceDiif",
        render: (priceDiif) => priceDiif
    },
]

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
            <Input  onInput={e => { handleChangeSearch.current(e.target.value); }} placeholder="поиск" />
            <Checkbox checked={tableParams.diffFlag} onChange={e=>setTableParams({...tableParams, diffFlag: e.target.checked})}>Отображать только расхождение</Checkbox>
            <Table columns={columns} dataSource={data} rowKey={(record)=>record.id} loading={isLoading} pagination={tableParams.pagination} onChange={handleTableChange}/>
        </div>
    )
}