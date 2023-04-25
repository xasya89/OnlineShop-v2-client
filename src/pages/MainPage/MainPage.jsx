import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GoodChooseAllFromSelectGroupComponent from '../../components/GoodChooseAllFromSelectGroupComponent/GoodChooseAllFromSelectGroupComponent';
import GoodChooseComponent from '../../components/GoodChooseComponent/GoodChooseComponent';
import styles from './MainPage.module.scss';

const MainPage = () => {
    const shop = useSelector(state=>state.shop.value);
    const navigate = useNavigate();

    const newDocumentHandler = () => {}

    return (
        <div className={styles.actionContainer}>
            <h3>Здесь будет отображаться аналитика по всем магазинам</h3>
            <GoodChooseComponent onChoosed={e=>console.log(e)}/>
            <GoodChooseAllFromSelectGroupComponent onChoosed={e=>console.log(e)} />
        </div>
    )
}

export default MainPage;