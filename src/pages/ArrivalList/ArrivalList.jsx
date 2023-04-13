import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './ArrivalList.module.css';

const ArrivalList = () => {
    const shop = useSelector(state=>state.shop.value);
    const navigate = useNavigate();

    const newDocumentHandler = () => {}

    return (
        <div>
            <div className={styles.actionPanel}>
                <Button type="primary" onClick={newDocumentHandler}>
                    <PlusOutlined />
                    Создать
                </Button>
            </div>
        </div>
    )
}

export default ArrivalList;