import { Button } from "antd";
import GoodChooseBarCode from "./GoodChooseBarCode";
import GoodChooseModal from "./GoodChooseModal";
import GoodChooseSelect from "./GoodChooseSelect";

export default function GoodChooseComponent({onChoosed}) {

    return (
        <div style={{display: "grid", gap: "10px", gridTemplateColumns: "4fr 1fr 1fr"}}>
            <div>
                <GoodChooseSelect onSelected={onChoosed} />
            </div>
            <div>
                <GoodChooseModal onSelected={onChoosed}/>
            </div>
            <div>
                <GoodChooseBarCode onSelected={onChoosed}/>
            </div>
        </div>
    )

}