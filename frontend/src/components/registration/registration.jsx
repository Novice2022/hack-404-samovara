import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom';
import s from './registration.module.scss'

const Registration = () => {
    //получаем тип, ветеран или волонтер
    const location = useLocation();
    const userType = location.state?.userType;
    const userTypeRu = userType == "veteran" ? "ветерана" : "волонтера"
    //стейт для хранения флага переключения между формами
    const [active, setActive] = useState(false)
    const handleActive = () => {
        setActive(!active)
    }

    //обьект для всех полей
    const [fields, setFields] = useState({
        login: { value: "", isFocused: false },
        email: { value: "", isFocused: false },
        pass: { value: "", isFocused: false },
    });

    // Обработчик изменения значения
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields((prev) => ({
            ...prev,
            [name]: { ...prev[name], value },
        }));
    };


    //отправка данных
    const clickSubmit = () =>{

    }


    // ▄███████▀▀▀▀▀▀███████▄
    // ░▐████▀▒ЗАПУСКАЕМ▒▀██████▄
    // ░███▀▒▒▒▒▒ДЯДЮ▒▒▒▒▒▒▀█████
    // ░▐██▒▒▒▒▒▒БОГДАНА▒▒▒▒▒████▌
    // ░▐█▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████▌
    // ░░█▒▄▀▀▀▀▀▄▒▒▄▀▀▀▀▀▄▒▐███▌
    // ░░░▐░░░▄▄░░▌▐░░░▄▄░░▌▐███▌
    // ░▄▀▌░░░▀▀░░▌▐░░░▀▀░░▌▒▀▒█▌
    // ░▌▒▀▄░░░░▄▀▒▒▀▄░░░▄▀▒▒▄▀▒▌
    // ░▀▄▐▒▀▀▀▀▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒█
    // ░░░▀▌▒▄██▄▄▄▄████▄▒▒▒▒█▀
    // ░░░░▄██████████████▒▒▐▌
    // ░░░▀███▀▀████▀█████▀▒▌
    // ░░░░░▌▒▒▒▄▒▒▒▄▒▒▒▒▒▒▐
    // ░░░░░▌▒▒▒▒▀▀▀▒▒▒▒▒▒▒▐


    return (
        <div className={s.container}>
            <h1>Регистрация {userTypeRu}</h1>
            <div className={s.frame}>
                {/* Кнопки для переключения между кнопками */}
                <div className={s.controls}>
                    <div className={s.controls__wrapper}>    
                        <button disabled={!active} onClick={handleActive}>Вход</button>
                        <div className={active ? s.line : s.line + ' ' + s.active}></div> {/* полоска под кнопкой, меняется в зависимости от формы */}
                    </div>
                    <div className={s.controls__wrapper}>
                        <button disabled={active} onClick={handleActive}>Регистрация</button>
                        <div className={!active ? s.line : s.line + ' ' + s.active}></div> {/* полоска под кнопкой, меняется в зависимости от формы */}
                    </div>
                </div>

                {/* Форма входа */}                
                 
                {!active ? (
                <form action="">
                    <div className={s.form__wrapper}>
                        <input 
                            className={s.form__input} 
                            name="login" 
                            id="login" 
                            type="text" 
                            onChange={handleChange}
                             />
                        <label className={s.form__label} htmlFor="login">Логин</label>
                    </div>
                    <div className={s.form__wrapper}>
                        <input 
                            className={s.form__input} 
                            name="pass" 
                            id="pass" 
                            type="password" 
                            onChange={handleChange}
                             />
                        <label className={s.form__label} htmlFor="pass">Пароль</label>
                    </div>
                    <button className={s.form__submit} onClick={clickSubmit}>Войти</button>
                </form>
                ) : (
                <form action="">
                    <div className={s.form__wrapper}>
                        <input 
                            className={s.form__input} 
                            name="firstName" 
                            id="firstName" 
                            type="text" 
                            onChange={handleChange}
                             />
                        <label className={s.form__label} htmlFor="login">Имя</label>
                    </div>
                    <div className={s.form__wrapper}>
                        <input 
                            className={s.form__input} 
                            name="lastName" 
                            id="lastName" 
                            type="text" 
                            onChange={handleChange}
                             />
                        <label className={s.form__label} htmlFor="login">Фамилия</label>
                    </div>
                    <div className={s.form__wrapper}>
                        <input 
                            className={s.form__input} 
                            name="login" 
                            id="login" 
                            type="text" 
                            onChange={handleChange}
                             />
                        <label className={s.form__label} htmlFor="login">Логин</label>
                    </div>
                    <div className={s.form__wrapper}>
                        <input 
                            className={s.form__input} 
                            name="pass" 
                            id="pass" 
                            type="password" 
                            onChange={handleChange}
                             />
                        <label className={s.form__label} htmlFor="pass">Пароль</label>
                    </div>
                    <div className={s.form__wrapper}>
                        <input 
                            className={s.form__input} 
                            name="pass2" 
                            id="pass2" 
                            type="password" 
                            onChange={handleChange}
                             />
                        <label className={s.form__label} htmlFor="pass">Подтвержение пароля</label>
                    </div>
                    <div className={s.form__wrapper}>
                        <input 
                            className={s.form__input} 
                            name="phone" 
                            id="phone" 
                            type="phone" 
                            onChange={handleChange}
                             />
                        <label className={s.form__label} htmlFor="login">Телефон</label>
                    </div>
                    <div className={s.form__wrapper}>
                        <input 
                            className={s.form__input} 
                            name="login" 
                            id="login" 
                            type="text" 
                            onChange={handleChange}
                             />
                        <label className={s.form__label} htmlFor="login">Город</label>
                    </div>
                    <button className={s.form__submit} onClick={clickSubmit}>
                    <Link to="/lk">
                        Зарегистрироваться
                    </Link>
                    </button>
                </form>
                )}
            </div>
        </div>
    )
}

export default Registration