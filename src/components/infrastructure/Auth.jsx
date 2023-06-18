import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirect, useNavigate, useNavigation } from "react-router-dom";
import LoginPage from "../../pages/login-page/LoginPage";
import { fetchUserByRefresh } from "../../redux/userSlice";

let countRepeat = 0;

export default function Auth({ children }){
    const user = useSelector(state => state.user.value);
    const status = useSelector(state => state.user.status);
    const [authorizeFlag, setAuthorizeFlag] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useLayoutEffect(() => {
        /*
        if(user==null && localStorage.getItem("user-remember") && status!=="refresh-error"){
            dispatch(fetchUserByRefresh());
        }
        if((user == null & !localStorage.getItem("user-remember")) || status==="refresh-error")
            setAuthorizeFlag(false);
        */
        if(status==="refresh-error")
            setAuthorizeFlag(false);
        if(!sessionStorage.getItem("user-id"))
            setAuthorizeFlag(false);
        else
            setAuthorizeFlag(true);
    }, [user]);
    if(!authorizeFlag)
        return <LoginPage />

    return children;
}