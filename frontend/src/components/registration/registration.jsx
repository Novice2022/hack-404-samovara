import { useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom';
import s from './registration.module.scss'
import { loginValidationRules, registerValidationRules, validateForm } from './validation';
import { registerUser } from '../../api/api';

const Registration = () => {
    //получения флага с стартовой страницы
    const location = useLocation();
    const navigate = useNavigate();
    const userType = location.state?.userType;
    const userTypeRu = userType === "veteran" ? "ветерана" : "волонтера";
  
    const [active, setActive] = useState(false);
    const handleActive = () => {
        setActive(!active)
    }
    const [fields, setFields] = useState({
      login: { value: "", isFocused: false },
      pass: { value: "", isFocused: false },
      firstName: { value: "", isFocused: false },
      lastName: { value: "", isFocused: false },
      pass2: { value: "", isFocused: false },
      phone: { value: "", isFocused: false },
      city: { value: "", isFocused: false },
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields(prev => ({
            ...prev,
            [name]: { ...prev[name], value },
        }));
    };

    const handleFocus = (name) => {
        setFields(prev => ({
            ...prev,
            [name]: { ...prev[name], isFocused: true },
        }));
    };

    const handleBlur = (name) => {
        // Валидация при потере фокуса
        const rules = active ? registerValidationRules : loginValidationRules;
        if (rules[name]) {
            const error = validateField(name, fields[name].value, rules[name], fields);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { isValid, errors: validationErrors } = validateForm(fields, active);
        setErrors(validationErrors);
    
        if (!isValid) return;
    
        setIsLoading(true);
        setServerError(null);
    
        try {
          if (active) {
            // Данные для регистрации
            const userData = {
              firstName: fields.firstName.value,
              lastName: fields.lastName.value,
              login: fields.login.value,
              passwordHash: fields.pass.value,
              phoneNumber: fields.phone.value,
              cityResidence: fields.city.value,
              role: userType // берем из location.state
            };
    
            await registerUser(userData);
            navigate('/lk', { state: { userType } }); // Перенаправляем после успешной регистрации
          } else {
            // Логика для входа
            try {
              const credentials = {
                login: fields.login.value,
                password: fields.pass.value
              };
              const userData = await loginUser(credentials);
              // Сохраняем токен или другие данные
              navigate('/lk', { state: { userType } });
            } catch (error) {
              setServerError(error.message || 'Неверный логин или пароль');
            }
          }
        } catch (error) {
          console.error('Ошибка регистрации:', error);
          setServerError(error.message || 'Произошла ошибка при регистрации');
        } finally {
          setIsLoading(false);
        }
      };

    // Рендер поля с ошибкой
    const renderField = (name, label, type = 'text') => (
        <div className={s.form__wrapper}>
            <input
                className={`${s.form__input} ${errors[name] ? s.form__input_error : ''}`}
                name={name}
                id={name}
                type={type}
                value={fields[name]?.value || ''}
                onChange={handleChange}
                onFocus={() => handleFocus(name)}
                onBlur={() => handleBlur(name)}
            />
            <label
                className={`${s.form__label} ${fields[name]?.isFocused || fields[name]?.value ? s.form__label_focused : ''}`}
                htmlFor={name}
            >
                {label}
            </label>
            {errors[name] && <div className={s.form__error}>{errors[name]}</div>}
        </div>
    );

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
                    // <form action="">
                    //     <div className={s.form__wrapper}>
                    //         <input 
                    //             className={s.form__input} 
                    //             name="login" 
                    //             id="login" 
                    //             type="text" 
                    //             onChange={handleChange}
                    //              />
                    //         <label className={s.form__label} htmlFor="login">Логин</label>
                    //     </div>
                    //     <div className={s.form__wrapper}>
                    //         <input 
                    //             className={s.form__input} 
                    //             name="pass" 
                    //             id="pass" 
                    //             type="password" 
                    //             onChange={handleChange}
                    //              />
                    //         <label className={s.form__label} htmlFor="pass">Пароль</label>
                    //     </div>
                    //     <button className={s.form__submit} onClick={clickSubmit}>Войти</button>
                    // </form>
                    <form onSubmit={handleSubmit}>
                        {renderField('login', 'Логин')}
                        {renderField('pass', 'Пароль', 'password')}
                        <button type="submit" className={s.form__submit}>Войти</button>
                    </form>
                ) : (
                    // <form action="">
                    //     <div className={s.form__wrapper}>
                    //         <input 
                    //             className={s.form__input} 
                    //             name="firstName" 
                    //             id="firstName" 
                    //             type="text" 
                    //             onChange={handleChange}
                    //              />
                    //         <label className={s.form__label} htmlFor="login">Имя</label>
                    //     </div>
                    //     <div className={s.form__wrapper}>
                    //         <input 
                    //             className={s.form__input} 
                    //             name="lastName" 
                    //             id="lastName" 
                    //             type="text" 
                    //             onChange={handleChange}
                    //              />
                    //         <label className={s.form__label} htmlFor="login">Фамилия</label>
                    //     </div>
                    //     <div className={s.form__wrapper}>
                    //         <input 
                    //             className={s.form__input} 
                    //             name="login" 
                    //             id="login" 
                    //             type="text" 
                    //             onChange={handleChange}
                    //              />
                    //         <label className={s.form__label} htmlFor="login">Логин</label>
                    //     </div>
                    //     <div className={s.form__wrapper}>
                    //         <input 
                    //             className={s.form__input} 
                    //             name="pass" 
                    //             id="pass" 
                    //             type="password" 
                    //             onChange={handleChange}
                    //              />
                    //         <label className={s.form__label} htmlFor="pass">Пароль</label>
                    //     </div>
                    //     <div className={s.form__wrapper}>
                    //         <input 
                    //             className={s.form__input} 
                    //             name="pass2" 
                    //             id="pass2" 
                    //             type="password" 
                    //             onChange={handleChange}
                    //              />
                    //         <label className={s.form__label} htmlFor="pass">Подтвержение пароля</label>
                    //     </div>
                    //     <div className={s.form__wrapper}>
                    //         <input 
                    //             className={s.form__input} 
                    //             name="phone" 
                    //             id="phone" 
                    //             type="phone" 
                    //             onChange={handleChange}
                    //              />
                    //         <label className={s.form__label} htmlFor="login">Телефон</label>
                    //     </div>
                    //     <div className={s.form__wrapper}>
                    //         <input 
                    //             className={s.form__input} 
                    //             name="login" 
                    //             id="login" 
                    //             type="text" 
                    //             onChange={handleChange}
                    //              />
                    //         <label className={s.form__label} htmlFor="login">Город</label>
                    //     </div>
                    //     <button className={s.form__submit} onClick={clickSubmit}>
                    //     <Link 
                    //         to="/lk" 
                    //         state={{ userType: userType}}
                    //     >
                    //         Зарегистрироваться
                    //     </Link>
                    //     </button>
                    // </form>
                    <form onSubmit={handleSubmit}>
                        {renderField('firstName', 'Имя')}
                        {renderField('lastName', 'Фамилия')}
                        {renderField('login', 'Логин')}
                        {renderField('pass', 'Пароль', 'password')}
                        {renderField('pass2', 'Подтверждение пароля', 'password')}
                        {renderField('phone', 'Телефон', 'tel')}
                        {renderField('city', 'Город')}
                        <button type="submit" className={s.form__submit}>
                            <Link to="/lk" state={{ userType }} className={s.form__link}>
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