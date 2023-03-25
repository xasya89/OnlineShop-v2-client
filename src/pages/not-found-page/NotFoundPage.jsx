import { Link, useRouteError } from "react-router-dom";
import styles from "./not-found.module.scss"

export default function NotFoundPage(){
    const error = useRouteError();
    console.error("Error route", error);
    return(
        <div className={styles.notFoundBody}>
            <h1 className={styles.notFoundH1}>Whoops!</h1>
            <p className={styles.notFoundP}>
                {error.message}
            </p>
            <p className={styles.notFoundP}>
                <Link style={{color: "red"}} to="/">Вернуться на главную</Link>
            </p>
        </div>
    )
}