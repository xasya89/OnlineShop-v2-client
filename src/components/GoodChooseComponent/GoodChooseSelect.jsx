import { useCallback } from "react";
import { useSelector } from "react-redux";
import AsyncSelect from "react-select/async";
import $api from "../../http/api";

export default function GoodChooseSelect({onSelected}){
    const shopId = useSelector(state => state.shop.value.id);
    const searchGoods = useCallback( ( inputValue, callback ) => {
        $api.get(`/goodsearch?search=${inputValue}`)
        .then(resp => callback(resp.data.map(good=> ({value: good.id, label: good.name})  )))
    }, [shopId]);

    const getGoodById = useCallback( ({value}) => {
        $api.get(`/${shopId}/goods/${value}`)
        .then(resp => onSelected([resp.data]))
    }, [shopId]);

    return <AsyncSelect cacheOptions loadOptions={searchGoods} defaultOptions isClearable defaultValue={null} defaultInputValue={null} 
    onChange={getGoodById} />
}