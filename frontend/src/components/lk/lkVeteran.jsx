import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import s from './lk.module.scss'

//Создание заявки
const CreateBid = () => {
    // Состояния формы
    const [requestType, setRequestType] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');

    // Варианты типов заявок
    const requestTypes = [
        'Медицинская помощь',
        'Юридическая консультация',
        'Помощь с транспортом',
        'Психологическая поддержка',
        'Финансовая помощь',
        'Помощь с пропитанием',
        'Другое'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь будет логика отправки формы
        console.log({
            requestType,
            description,
            city,
            address
        });
        // Можно добавить отправку на сервер или другие действия
    };

    return (
        <div className={s.create}>
            <h2 className={s.create__title}>Создание новой заявки</h2>
            <form onSubmit={handleSubmit} className={s.form}>
                <div className={s.form__wrapper}>
                    <label htmlFor="requestType" className={s.form__label}>
                        Тип заявки:
                    </label>
                    <select
                        id="requestType"
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                        className={s.form__select}
                        required
                    >
                        <option value="">Выберите тип заявки</option>
                        {requestTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={s.form__wrapper}>
                    <label htmlFor="description" className={s.form__label}>
                        Описание:
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={s.form__textarea}
                        placeholder="Опишите вашу проблему или потребность..."
                        required
                    />
                </div>
                <div className={s.form__linewrapper}>
                    <div className={s.form__wrapper}>
                        <label htmlFor="city" className={s.form__label}>
                            Город:
                        </label>
                        <input
                            type="text"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className={s.form__input}
                            placeholder="Введите ваш город"
                            required
                        />
                    </div>

                    <div className={s.form__wrapper}>
                        <label htmlFor="address" className={s.form__label}>
                            Точный адрес:
                        </label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={s.form__input}
                            placeholder="Улица, дом, квартира"
                            required
                        />
                    </div>
                    <button type="submit" className={s.submitBtn}>
                        Создать заявку
                    </button>
                </div>

            </form>
        </div>
    );
};

const Bid = ({bid, bidType}) =>{
    return(
        <div className={s.bid}>
            <div className={s.bid__header}>
                <h3 className={s.bid__status}>{bid.status}</h3>
                <h3 className={s.bid__fate}>{bid.createdAt}</h3>
            </div>
            <div className={s.bid__info}>
                <div className={s.bid__info__wrapper}>
                    <h4>Тип помощи</h4>
                    <h4 className={s.bid__info__wrapper__data}>{bid.type}</h4>    
                </div>
                <div className={s.bid__info__wrapper}>
                    <h4>Описание</h4>
                    <h4 className={s.bid__info__wrapper__data}>{bid.description}</h4>    
                </div>
                <div className={s.bid__info__wrapper}>
                    <h4>Адрес</h4>
                    <h4 className={s.bid__info__wrapper__data}>{bid.from}</h4>    
                </div>

            </div>
            
            {bid.status != "Завершена" && bidType == "veteran" && (
                <div className={s.bid__btns}>
                    <button className={s.bid__cancelBtn + ' ' + s.bid__btn}>Отозвать заявку</button>
                    <button className={s.bid__endBtn + ' ' + s.bid__btn}>Завершить</button>
                </div>
            )}
            
            {bid.status == "Новая" && bidType == "volunteer" && (
                <div className={s.bid__btns}>
                    <button className={s.bid__endBtn + ' ' + s.bid__btn}>Откликнуться</button>
                </div>
            )}
        </div>
    )
}

const LkVeteran = () =>{

    //Флаг ветеран или волонтер
    const location = useLocation();
    const userType = location.state?.userType;
    const userTypeRu = userType == "veteran" ? "ветерана" : "волонтера"

    const veteran = {
        firstName: "Сергей",
        lastName: "Петров",
        login: "petrov_sergey",
        phone: "88005553535",
        city: "Псков"
    }

    const volunteer = {
        firstName: "Иван",
        lastName: "Иванов",
        login: "ivan_123",
        phone: "88005553510",
        city: "Псков"
    }

    let user = {}
    if(userType == "veteran"){
        user = veteran
    }else if(userType == "volunteer"){
        user = volunteer
    }

    const bids = [
        {
            type: 'Медицинская помощь',
            description: 'Не могу ходить, нужна помощь врачей',
            from: 'Псков, ул Ленина д 5 кв 10',
            status: 'Завершена',
            createdAt: '01-04-2025',
        },
        {
            type: 'Помощь с транспортом',
            description: 'Хочу навестить родственников из Москвы, но в связи с болезнью не могу поехать на поезде, требуется специальный автомобиль.',
            from: 'Псков, ул Ленина д 5 кв 1488',
            status: 'Выполняется',
            createdAt: '10-04-2025',
        },
        {
            type: 'Психологическая поддержка',
            description: 'Скучно одному, приходите расскажу интересные истории',
            from: 'Псков, ул Ленина д 5 кв 1488',
            status: 'Новая',
            createdAt: '01-04-2025',
        },
        {
            type: 'Другое',
            description: 'Нужна помощь с поиском друга-ветерана',
            from: 'Тула, ул Ленина д 5 кв 1488',
            status: 'Новая',
            createdAt: '10-04-2025',
        }
    ]


    return(
        <section className={s.container}>
            <h1>
                Личный кабинет {userTypeRu}
            </h1>

            <div className={s.info}>
                <h4 className={s.fio}>
                    {user.lastName + " " + user.firstName}
                </h4>
                <h5 className={s.phone}>{user.phone}</h5>
                <h5 className={s.city}>{user.city}</h5>
            </div>
            {userType == "veteran" &&(
            <>
                <CreateBid />
                <h2>История заявок</h2>
                <div className={s.bids}>
                    {bids.map((item, key) =>(
                        <Bid bid={item} key={key} bidType={userType}/>
                    ))}
                </div>
                </>
            )}
            {userType == "volunteer" && (
                <>
                    <h2>Доступные заявки</h2>
                    <div className={s.bids}>
                        {bids.map((item, key) =>{
                            if(item.status == 'Новая'){
                                return(<Bid bid={item} key={key} bidType={userType}/>)
                            } 
                        })}
                    </div>
                </>
            )}
        </section>
    )
}

export default LkVeteran