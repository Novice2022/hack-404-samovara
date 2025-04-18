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

const LkVeteran = () =>{

    const veteran = {
        firstName: "Сергей",
        lastName: "Залупко",
        login: "zalupko_serega",
        phone: "88005553535",
        city: "Ржежопинск"
    }

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
        </section>
    )
}

export default LkVeteran