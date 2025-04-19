import { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom';
import s from './registration.module.scss'
import { loginValidationRules, registerValidationRules, validateForm } from './validation';
import { registerUser, loginUser } from '../../api/api';
import axios from 'axios';
import { SHA256 } from 'crypto-js';

const Registration = () => {
    //получения флага с стартовой страницы
    const location = useLocation();
    const navigate = useNavigate();
    const userType = location.state?.userType;
    const userTypeNum = userType === "veteran" ? 1 : 2;
  
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
    const [message, setMessage] = useState({ text: '', type: '' });

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

    //Хэшируем пароль
    const hashedPassword = SHA256(fields.pass.value).toString();;

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
      
        try {
          const userData = {
            firstName: fields.firstName.value,
            lastName: fields.lastName.value,
            login: fields.login.value,
            passwordHash: hashedPassword,
            phoneNumber: fields.phone.value,
            cityResidence: fields.city.value,
            role: userTypeNum
          };
          console.log(fields.login.value, hashedPassword)
          await registerUser(userData);
          setMessage({ text: 'Регистрация успешна! Войдите в систему', type: 'success' });
          setActive(false); // Переключаем на форму входа
          
          // Очищаем только пароли (логин остается)
          setFields(prev => ({
            ...prev,
            pass: { value: '', isFocused: false },
            pass2: { value: '', isFocused: false }
          }));
      
        } catch (error) {
          setMessage({ text: error.message, type: 'error' });
        } finally {
          setIsLoading(false);
        }
      };
      
      const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
      
        try {
            console.log(fields.login.value, hashedPassword)
          const { token, user } = await loginUser({
            login: fields.login.value,
            passwordHash: hashedPassword
          });

          
      
          localStorage.setItem('authToken', token);
          localStorage.setItem('userData', JSON.stringify(user));
          
          navigate('/lk', { 
            state: { 
              userType: userType,
              justLoggedIn: true 
            }
          });
      
        } catch (error) {
          setMessage({ text: error.message, type: 'error' });
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


    // Определяем город при монтировании компонента
    const [isGeoLoading, setIsGeoLoading] = useState(false);
    const [geoError, setGeoError] = useState(null);
  
    useEffect(() => {
      const fetchUserLocation = async () => {
        setIsGeoLoading(true);
        setGeoError(null);
        
        try {
          // Используем бесплатный API с CORS поддержкой
          const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
          
          if (response.data.city) {
            setFields(prev => ({
              ...prev,
              city: { ...prev.city, value: response.data.city }
            }));
          }
        } catch (error) {
          console.error('Не удалось определить местоположение:', error);
          setGeoError('Не удалось определить город автоматически');
        } finally {
          setIsGeoLoading(false);
        }
      };
  
      fetchUserLocation();
    }, []);

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
                    <form onSubmit={handleLogin}>
                        {renderField('login', 'Логин')}
                        {renderField('pass', 'Пароль', 'password')}
                        <button type="submit" className={s.form__submit}>Войти</button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister}>
                        {renderField('firstName', 'Имя')}
                        {renderField('lastName', 'Фамилия')}
                        {renderField('login', 'Логин')}
                        {renderField('pass', 'Пароль', 'password')}
                        {renderField('pass2', 'Подтверждение пароля', 'password')}
                        {renderField('phone', 'Телефон', 'tel')}
                        {renderField('city', 'Город')}
                        <button type="submit" className={s.form__submit}>
                            {/* <Link to="/lk" state={{ userType }} className={s.form__link}> */}
                                Зарегистрироваться
                            {/* </Link> */}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Registration