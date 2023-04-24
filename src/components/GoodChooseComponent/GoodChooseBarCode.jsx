import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import $api from "../../http/api";
import useEventListener from "../infrastructure/UseEventListener";

const numbersKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

export default function GoodChooseBarCode({onSelected}){
    const shopId = useSelector(state => state.shop.value.id);
    const barcode = useRef("");

    const getGood = async () => {
        try{
            const resp = await $api.get(`/${shopId}/goods/scan/${barcode.current}`);
            onSelected(resp.data);
        }
        catch(e) {
            console.error(e);
        }
        finally{
            barcode.current= "";
        }
    }

    const handler = (event) => {
        if(event===undefined)
            return;
        const {key} = event;
        if(numbersKeys.includes(parseInt(key)))
            barcode.current = barcode.current + "" + key;
        if(key === "Enter")
            getGood();
    };

    useEventListener("keydown", handler);
}