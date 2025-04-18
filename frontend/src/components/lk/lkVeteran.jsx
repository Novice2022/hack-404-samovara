import { useState } from 'react';
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

const Bid = ({bid}) =>{
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
            {bid.status != "Выполнено" && (
                <button className={s.bid__cancelBtn}>Отозвать заявку</button>
            )}
        </div>
    )
}

const LkVeteran = () =>{

    const veteran = {
        firstName: "Сергей",
        lastName: "Залупко",
        login: "zalupko_serega",
        phone: "88005553535",
        city: "Ржежопинск"
    }

    const bids = [
        {
            type: 'Медицинская помощь',
            description: 'Оторвало нахуй палец на ноге ребята помогите',
            from: 'Тула, ул Ленина д 5 кв 1488',
            status: 'Выполнено',
            createdAt: '01-04-2025',
        },
        {
            type: 'Медицинская помощь',
            description: 'Оторвало нахуй ногу тут уже хз как поможете',
            from: 'Тула, ул Ленина д 5 кв 1488',
            status: 'В процессе',
            createdAt: '10-04-2025',
        }
    ]
    return(
        <section className={s.container}>
            <h1>
                Личный кабинет
            </h1>
            <div className={s.info}>
                <h4 className={s.fio}>
                    {veteran.lastName + " " + veteran.firstName}
                </h4>
                <h5 className={s.phone}>{veteran.phone}</h5>
                <h5 className={s.city}>{veteran.city}</h5>
            </div>
            <CreateBid />
            <h2>История заявок</h2>
            <div className={s.bids}>
                {bids.map((item, key) =>(
                    <Bid bid={item} key={key}/>
                ))}
            </div>
        </section>
    )
}

export default LkVeteran