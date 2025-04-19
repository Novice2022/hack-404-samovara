import s from './registration.module.scss'
import {
    BrowserRouter as Router,
    Link,
  } from 'react-router-dom';

const MainRegistration = () =>{
    // Тут никакой логики не надо, просто стартовая страничка, стиль под нее готов уже
    return(
        <main>
            <div className={s.main__wrapper}>
            <h1>
                Добро пожаловать в сервис помощи ветеранам
            </h1>

            <div className={s.links}>
                <Link 
                    to="/registration" 
                    className={s.veteranBtn}
                    state={{ userType: 'veteran'}} >Я ветеран</Link>
                <Link 
                    to="/registration"
                    state={{ userType: 'volunteer'}}>Я волонтер</Link>
            </div>
            </div>
        </main>
    )   
}

export default MainRegistration