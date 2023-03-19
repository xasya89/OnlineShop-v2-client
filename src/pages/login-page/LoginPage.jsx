import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../../redux/userSlice';
import './style.scss'

export default function LoginPage () {
  const user = useSelector(state => state.user.value);
  const navigate = useNavigate();
  useEffect(()=> {
    console.log(user);
    if(user!=null) navigate("/");
  }, [user]);
  const dispatch= useDispatch();
    const panelOne = useRef(null);
    const panelTwo = useRef(null);
    const [login, setLogin] = useState("xasya");
    const [password, setPassword] = useState("kt38hmapq");
    const [rememberMe, setRememberMe] = useState(false);
    useEffect(()=> {
    }, []);
    const handleLogin = () => {
      dispatch(fetchUser({login, password, rememberMe}));
    }
    const handleRememberMe = () => setRememberMe(!rememberMe);
    /*
    $(document).ready(function() {
        var panelOne = $('.form-panel.two').height(),
          panelTwo = $('.form-panel.two')[0].scrollHeight;
      
        $('.form-panel.two').not('.form-panel.two.active').on('click', function(e) {
          e.preventDefault();
      
          $('.form-toggle').addClass('visible');
          $('.form-panel.one').addClass('hidden');
          $('.form-panel.two').addClass('active');
          $('.form').animate({
            'height': panelTwo
          }, 200);
        });
      
        $('.form-toggle').on('click', function(e) {
          e.preventDefault();
          $(this).removeClass('visible');
          $('.form-panel.one').removeClass('hidden');
          $('.form-panel.two').removeClass('active');
          $('.form').animate({
            'height': panelOne
          }, 200);
        });
      });
      */


    return (
        <div class="login-body">
<div class="form">
  <div class="form-toggle"></div>
  <div ref={panelOne} class="form-panel one">
    <div class="form-header">
      <h1>Online shop v2</h1>
    </div>
    <div class="form-content">
      <div>
        <div class="form-group">
          <label for="username">Пользователь</label>
          <input value={login} onChange={e=>setLogin(e.target.value)} id="username" type="text" name="username" required="required"/>
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} id="password" type="password" name="password" required="required"/>
        </div>
        <div class="form-group">
          <label class="form-remember">
            <input onChange={handleRememberMe} checked={rememberMe} type="checkbox"/>Запомнить
          </label>
        </div>
        <div class="form-group">
          <button onClick={handleLogin} type="submit">Войти</button>
        </div>
      </div>
    </div>
  </div>
  <div ref={panelTwo} class="form-panel two">
    <div class="form-header">
      <h1>Register Account</h1>
    </div>
    <div class="form-content">
      <form>
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" type="text" name="username" required="required"/>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" name="password" required="required"/>
        </div>
        <div class="form-group">
          <label for="cpassword">Confirm Password</label>
          <input id="cpassword" type="password" name="cpassword" required="required"/>
        </div>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input id="email" type="email" name="email" required="required"/>
        </div>
        <div class="form-group">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  </div>
</div>
<div class="pen-footer"><a href="https://exp-tech.com" target="_blank"><i class="material-icons">arrow_backward</i>View on Behance</a><a href="exp-tech.com" target="_blank">View on Github<i class="material-icons">arrow_forward</i></a></div>
        </div>
    )
}