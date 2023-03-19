import { Link } from "react-router-dom";

export default function NotFoundPage(){
    return(
        <div>Страница не найдена<br/><Link to="/">Вернуться на главную</Link></div>
    )
}