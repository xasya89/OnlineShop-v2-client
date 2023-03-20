import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import $api from '../../http/api';
import { fetchShops, setShop, shopSelector } from '../../redux/shopSlice';
import styles from './header.module.scss'

export default function MenuSelect(){
    const [optionsVisible, setOptionVisible] = useState(false);
    const [shops, setShops] = useState([]);
    const shop = useSelector(shopSelector);
    const dispatch = useDispatch();
    useEffect(() => {
        const getShops = async () => {
            const resp = await $api.get("/shops");
            setShops(resp.data);
        }
        getShops();
    }, []);
    const handleSelected = (shop)=>{
        setOptionVisible(false);
        dispatch(setShop(shop));
    }
    return (
        <div className={styles.menuSelect}>
            <div onClick={()=>setOptionVisible(prev=>!prev)}>
                <p>{shop?.alias || ""}</p>
                <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>
                    <path d="M0-.75h24v24H0z" fill="none"/>
                </svg>
            </div>
            {
                optionsVisible && (
                    <ul>
                        {shops.map(shop => <li key={shop.id} onClick={()=> handleSelected(shop)}>{shop.alias}</li>)}
                    </ul>
                )
            }
        </div>
    )
}