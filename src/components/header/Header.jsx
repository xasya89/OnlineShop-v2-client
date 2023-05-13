import classNames from 'classnames'
import { Link, NavLink } from 'react-router-dom';
import styles from './header.module.scss'
import MenuSelect from './MenuSelect';

export default function Header({isVisible}){
    const headerClass= styles.header;
    const headerActiveCLass = styles.headerActive;

    const handleHoverLink = ({isActive, isPending}) => isActive ? styles.menuItemActive : styles.menuItem;

    return (
        isVisible && (
            <header className={classNames(headerClass, headerActiveCLass) }>
                <div>
                    <h4>Online-shop v2</h4>
                    Магазин
                    <MenuSelect />
                </div>
                <ul className={styles.menuItems}>
                    <li>
                        Справочники
                        <ul>
                            <li><NavLink to="/goods" className={handleHoverLink}>Товары</NavLink></li>
                            <li><NavLink to="/suppliers" className={handleHoverLink}>Поставщики</NavLink></li>
                            <li><NavLink to="/goodgroups" className={handleHoverLink}>Группы</NavLink></li>
                        </ul>
                    </li>
                    <li>
                        Документы
                        <ul>
                            <li><NavLink to="/documents/inventorylist" className={handleHoverLink}>Инверторизация</NavLink></li>
                            <li><NavLink to="/documents/arrivals" className={handleHoverLink}>Поступления</NavLink></li>
                            <li><NavLink to="/documents/writeofs" className={handleHoverLink}>Списания</NavLink></li>
                        </ul>
                    </li>
                </ul>
            </header>
        )
    )
}