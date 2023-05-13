import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './ArrivalListPage.module.scss';

const ArrivalListPage = () => {
    const shop = useSelector(state=>state.shop.value);
    const navigate = useNavigate();

    const newDocumentHandler = () => navigate("/documents/arrivals/0")

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

export default ArrivalListPage;