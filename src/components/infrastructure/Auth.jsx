import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirect, useNavigate, useNavigation } from "react-router-dom";
import { fetchUserByRefresh } from "../../redux/userSlice";

export default function Auth({ children }){
    const user = useSelector(state => state.user.value);
    const status = useSelector(state => state.user.status);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        if(user==null && localStorage.getItem("user-remember") && status!=="refresh-error")
            dispatch(fetchUserByRefresh());
        if((user == null & !localStorage.getItem("user-remember")) || status==="refresh-error")
            navigate("/login");
    }, [user, status])

    return children;
}