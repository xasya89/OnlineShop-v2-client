import Header from '../header/Header'
import styles from './main.module.scss'
import hamburg from '../../assets/hamburg.svg'
import { Outlet, useNavigate } from 'react-router-dom';
import { useLayoutEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useSelector } from 'react-redux';

export default function Main () {
    const [menuIsVisible, setMenuIsVisible] = useState(false);
    useLayoutEffect(()=>{
        setMenuIsVisible(!isMobile);
    }, []);
    const handleMenuVisible = () => setMenuIsVisible(!menuIsVisible);
    /*
    if(user==null)
        navigate("/login");
        */
    return (
        <div className={styles.main}>
            <div className={styles.mainDiv}>
                <Header isVisible={menuIsVisible}/>
                <div className={styles.workPage}>
                    <Outlet />
                </div>
            </div>
            <div onClick={handleMenuVisible} className={styles.mainMenuBtn}>
                <svg viewBox="0 0 100 80" width="30" height="30">
                    <rect width="100" height="20"></rect>
                    <rect y="30" width="100" height="20"></rect>
                    <rect y="60" width="100" height="20"></rect>
                </svg>

            </div>
        </div>
    )
}