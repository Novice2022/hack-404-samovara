import React, { useState } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { Dropdown } from "primereact/dropdown";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

import { useLocation } from 'react-router-dom';

import s from './lk.module.scss'

const CreateBid = () => {
    const [requestType, setRequestType] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');

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

        console.log({
            requestType,
            description,
            city,
            address
        });
    };

    return (
        <div className={s.create}>
            <h2 className={s.create__title}>Создание новой заявки</h2>
            <form onSubmit={handleSubmit} className={s.form}>
                <div className={s.form__wrapper}>
                    <label htmlFor="description" className={s.form__label}>
                        Описание:
                    </label>
                    <InputTextarea
                        autoResize
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        cols={30}
                        placeholder="Ваша проблема или потребность"
                        required
                    />
                </div>
                <div className={s.form__linewrapper}>
                    <div className={s.form__wrapper}>
                        <label htmlFor="requestType" className={s.form__label}>
                            Тип заявки:
                        </label>
                        <Dropdown
                            name="requestType"
                            value={requestType}
                            onChange={(e) => setRequestType(e.value)}
                            options={requestTypes}
                            placeholder="Тип заявки"
                            required
                        />
                    </div>
                    <div className={s.form__wrapper}>
                        <label htmlFor="city" className={s.form__label}>
                            Город:
                        </label>
                        <InputText
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Ваш город"
                            required
                        />
                    </div>
                    <div className={s.form__wrapper}>
                        <label htmlFor="address" className={s.form__label}>
                            Точный адрес:
                        </label>
                        <InputText
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Улица, дом, квартира"
                            required
                        />
                    </div>
                    <Button label="Создать заявку" severity="success" raised />
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

const LkVeteran = () => {
    const location = useLocation();
    const userType = location.state?.userType;
    const userTypeRu = userType === "veteran" ? "Ветеран" : "Волонтер"

    const veteran = {
        firstName: "Сергей",
        lastName: "Петров",
        login: "petrov_sergey",
        city: "Псков"
    }

    const volunteer = {
        firstName: "Иван",
        lastName: "Иванов",
        login: "ivan_123",
        city: "Псков"
    }

    let user = {}

    if (userType === "veteran"){
        user = veteran
    } else if (userType === "volunteer"){
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
            <div className={s.info}>
                <p>{user.lastName + " " + user.firstName}</p>
                <p>{userTypeRu} из города {user.city}</p>
            </div>
            {userType == "veteran" &&(
            <>
                <CreateBid />
                <h2>История заявок</h2>
                <div className={s.bids}>
                    {bids.map((item, key) => (
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
                            if (item.status == 'Новая') {
                                return (<Bid bid={item} key={key} bidType={userType}/>)
                            } 
                        })}
                    </div>
                </>
            )}
        </section>
    )
}

export default LkVeteran
