import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import $api from '../../http/api';
import styles from './TemplateName.module.scss';

const TemplateName = () => {
    const shop = useSelector(state=>state.shop.value);
    const navigate = useNavigate();

    const newDocumentHandler = () => {}

    return (
        <div className={styles.actionContainer}>
            <div className={styles.actionPanel}>
                <Button type="primary" onClick={newDocumentHandler}>
                    <PlusOutlined />
                    Создать
                </Button>
            </div>
        </div>
    )
}

export default TemplateName;