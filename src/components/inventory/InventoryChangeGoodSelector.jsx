import AsyncSelect from 'react-select/async';
import Select from 'react-select'
import $api from '../../http/api';
import { useSelector } from 'react-redux';

const colourOptions = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const filterColors = (inputValue) => {
    return colourOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  const searchGoods = async (inputValue) => {
    const resp = await $api.get(`/goodsearch?search=${inputValue}`);
    return resp.data.map(good => {return {value: good.id, label: good.name}})
  }
  
  const loadOptions = ( inputValue, callback ) => {
    searchGoods(inputValue).then(goods=>callback(goods));
  };
  
  const getGoodId = async (id, callback) => {
    const resp = await $api.get(`/${shopId}/goods/${id}`);
    callback(resp.data);
  }

  let shopId=0;

export default function InventoryChangeGoodSelector ({onChange}){
  shopId = useSelector(state => state.shop.value.id);
  return(
    <AsyncSelect cacheOptions loadOptions={loadOptions} defaultOptions isClearable defaultValue={null} defaultInputValue={null} onChange={(val)=>getGoodId(val.value, onChange)}/>
  )
}