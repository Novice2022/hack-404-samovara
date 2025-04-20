import React, { useState, useRef, useEffect } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { Dropdown } from "primereact/dropdown";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { createVeteranRequest, getVeteranRequests, getVolunteerRequests, respondToRequest, selectVolunteer, cancelRequest, getVolunteerResponses, finishRequest } from '../../api/api';
import s from './lk.module.scss'

const CreateBid = () => {
    const [requestType, setRequestType] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const requestTypes = [
        { label: 'Медицинская помощь', value: 1 },
        { label: 'Юридическая консультация', value: 2 },
        { label: 'Помощь с транспортом', value: 3 },
        { label: 'Психологическая поддержка', value: 4 },
        { label: 'Финансовая помощь', value: 5 },
        { label: 'Помощь с пропитанием', value: 6 },
        { label: 'Другое', value: 7 }
    ];

    const resetForm = () => {
        setRequestType('');
        setDescription('');
        setCity('');
        setAddress('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const requestData = {
                type: requestType,
                description,
                city,
                locationText: address
            };

            const response = await createVeteranRequest(requestData);

            console.log('Заявка создана:', requestData);

            resetForm();
        } catch (err) {
            console.error('Ошибка создания заявки:', err);
            setError(err.message || 'Произошла ошибка при создании заявки');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={s.create}>
            <h2 className={s.create__title}>Создание новой заявки</h2>
            {error && <div className={s.error}>{error}</div>}

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
                            value={requestType}
                            onChange={(e) => setRequestType(e.value)}
                            options={requestTypes}
                            optionLabel="label"
                            placeholder="Выберите тип заявки"
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

                    <Button
                        label={isLoading ? 'Создание...' : 'Создать заявку'}
                        severity="success"
                        raised
                        type="submit"
                        disabled={isLoading}
                    />
                </div>
            </form>
        </div>
    );
};

const Bid = ({ bid, bidType, user, itResponse }) => {

    // Функция для выбора исполнителя
    const handleSelectVolunteer = async (responseId) => {
        try {
            // Передаем ID отклика
            await selectVolunteer(responseId);

            // Выводим сообщение об успехе
            alert('Исполнитель успешно выбран!');
        } catch (error) {
            console.error('Ошибка при выборе исполнителя:', error);
            alert('Не удалось выбрать исполнителя. Попробуйте позже.');
        }
    };

    const handleRespond = async () => {
        try {
            const volunteerInfo = {
                firstNameVolonteer: user.firstName,
                lastNameVolonteer: user.lastName,
                contactInfo: user.phoneNumber
            };

            // Отправляем отклик на сервер
            await respondToRequest(bid.id, volunteerInfo);

            // Выводим сообщение об успехе (можно заменить на обновление состояния родительского компонента)
            alert('Вы успешно откликнулись на заявку!');
        } catch (error) {
            console.error('Ошибка при отправке отклика:', error);
            alert('Не удалось отправить отклик. Попробуйте позже.');
        }
    };

    const handleCancelRequest = async () => {
        try {
            // Передаем ID заявки
            await cancelRequest(bid.id);

            // Выводим сообщение об успехе
            alert('Заявка успешно отозвана!');
        } catch (error) {
            console.error('Ошибка при отзыве заявки:', error);
            alert('Не удалось отозвать заявку. Попробуйте позже.');
        }
    };

    // Функция для завершения заявки
    const handleFinishRequest = async () => {
        try {
            await finishRequest(bid.id);
            alert('Заявка успешно завершена!');
        } catch (error) {
            console.error('Ошибка при завершении заявки:', error);
            alert('Не удалось завершить заявку. Попробуйте позже.');
        }
    };

    //форматирование даты
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Используем 24-часовой формат
        };
        return date.toLocaleString('ru-RU', options).replace(',', ''); // Убираем запятую
    };
    return (
        <div className={s.bid}>
            <div className={s.bid_status}>
                <span>Статус: <span className={s.status}>{bid.status}</span></span>
                <span>{formatDate(bid.createdAt)}</span>
            </div>
            <div className={s.bid_info}>
                <div className={s.info_atom}>
                    <span className={s.info_atom_title}>Тип помощи</span>
                    <span>{bid.type}</span>
                </div>
                <div className={s.info_atom}>
                    <span className={s.info_atom_title}>Описание</span>
                    <span>{bid.description}</span>
                </div>
                <div className={s.info_atom}>
                    <span className={s.info_atom_title}>Адрес</span>
                    <span>{bid.from}</span>
                </div>
            </div>

            {/* игорь вот эту темку поправишь */}
            {bidType == 'veteran' && !bid.volunteerSelect && (
                bid.responses.map((item, key) => (
                    <>
                        <div key={key}>{item.firstName} {item.lastName} {item.contactInfo} {item.id}</div>
                        <Button label="Выбрать исполнителя" onClick={() => handleSelectVolunteer(item.id)} />
                    </>
                
            )))}
            {
                bidType === 'veteran' && !(['Завершена', 'Отменена'].includes(bid.status)) && (
                    <div className={s.form_controllers}>
                        <Button label="Отозвать заявку" severity="danger" raised onClick={handleCancelRequest} />
                        <Button label="Завершить" severity="success" raised onClick={handleFinishRequest} />
                    </div>
                )
            }
            {
                bidType == "volunteer" && bid.status == "Новая" && !itResponse && (
                    <>
                        <Button label="Откликнуться" severity="success" onClick={handleRespond} />
                        <div>{bid.veteran.firstName} {bid.veteran.lastName} {bid.veteran.phoneNumber}</div>
                    </>
                )   
            }

        </div>
    );
}

const LkVeteran = () => {
    const location = useLocation();
    const userType = location.state?.userType;
    const userData = location.state?.userInfo;
    const userTypeRu = userType === "veteran" ? "Ветеран" : "Волонтер"

    const [bidsVeteran, setBidsVeteran] = useState([]);
    const [bidsVolunteer, setBidsVolunteer] = useState([]);


    //получение активных заявок у волонтера
    const [responses, setResponses] = useState([]); // Состояние для хранения откликов
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(null); // Состояние ошибки

    useEffect(() => {
        const fetchRequestsVeteran = async () => {
            try {
                const data = await getVeteranRequests(); // Вызываем метод для получения заявок

                const formattedBids = data.requests.map(request => ({
                    id: request.guid,
                    type: request.type === 1 ? 'Медицинская помощь' :
                        request.type === 2 ? 'Помощь с транспортом' :
                            request.type === 3 ? 'Психологическая поддержка' :
                                request.type === 4 ? 'Другое' : 'Неизвестный тип',
                    description: request.description,
                    from: request.city + " " + request.locationText,
                    status: request.status === 1 ? 'Новая' :
                        request.status === 2 ? 'Выполняется' :
                            request.status === 3 ? 'Завершена' :
                                request.status === 4 ? 'Отменена' : 'Неизвестный статус',
                    createdAt: request.createAt,
                    responses: request.responses,
                    volunteerSelect: request.selectedExecutorId

                }));


                setBidsVeteran(formattedBids); // Обновляем состояние
            } catch (error) {
                console.error('Не удалось загрузить заявки:', error);
            }
        };

        const fetchRequestsVolunteer = async () => {
            try {
                const data2 = await getVolunteerRequests(); // Вызываем метод для получения заявок

                const formattedBids = data2.map(request => ({
                    id: request.guid,
                    type: request.type === 1 ? 'Медицинская помощь' :
                        request.type === 2 ? 'Помощь с транспортом' :
                            request.type === 3 ? 'Психологическая поддержка' :
                                request.type === 4 ? 'Другое' : 'Неизвестный тип',
                    description: request.description,
                    from: request.city + " " + request.locationText,
                    status: request.status === 1 ? 'Новая' :
                        request.status === 2 ? 'Выполняется' :
                            request.status === 3 ? 'Завершена' :
                                request.status === 4 ? 'Отменена' : 'Неизвестный статус',
                    createdAt: request.createAt,
                    veteran: request.veteran
                }));

                setBidsVolunteer(formattedBids); // Обновляем состояние
            } catch (error) {
                console.error('Не удалось загрузить заявки:', error);
            }
        };
        const fetchResponses = async () => {
            try {
                setLoading(true);
                const data = await getVolunteerResponses();
                const formattedData = data.map(request => ({
                    id: request.guid,
                    type: request.type === 1 ? 'Медицинская помощь' :
                        request.type === 2 ? 'Помощь с транспортом' :
                            request.type === 3 ? 'Психологическая поддержка' :
                                request.type === 4 ? 'Другое' : 'Неизвестный тип',
                    description: request.description,
                    from: request.city + " " + request.locationText,
                    status: request.status === 1 ? 'Новая' :
                        request.status === 2 ? 'Выполняется' :
                            request.status === 3 ? 'Завершена' :
                                request.status === 4 ? 'Отменена' : 'Неизвестный статус',
                    createdAt: request.createAt,
                    veteran: request.veteran
                }));
                console.log(formattedData)
                setResponses(formattedData); // Сохраняем данные в состояние
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при загрузке откликов:', error);
                setError('Не удалось загрузить отклики. Попробуйте позже.');
                setLoading(false);
            }

        };

        userType === "veteran" ? fetchRequestsVeteran() : fetchRequestsVolunteer(), fetchResponses()

    }, []);


   


    return (
        <section className={s.container}>
            <div className={s.info}>
                <p>{userData.lastName + " " + userData.firstName}</p>
                <p>{userTypeRu} из города {userData.cityResidence}</p>
            </div>
            {userType == "veteran" && (
                <>
                    <CreateBid />
                    <div className={s.bids}>
                        <h2>История заявок</h2>
                        {bidsVeteran.map((item, key) => (
                            <Bid bid={item} key={key} bidType={userType} user={userData} />
                        ))}
                    </div>
                </>
            )}
            {userType == "volunteer" && (
                <>
                    <div className={s.bids}>
                        <h2>Доступные заявки</h2>
                        {bidsVolunteer.filter(
                            bid => !responses.some(response => response.id === bid.id)
                        ).map((item, key) => {
                            if (item.status == 'Новая') {
                                return (<Bid bid={item} key={key} bidType={userType} user={userData} />)
                            }
                        })}
                    </div>
                </>
            )}
            {userType == "volunteer" && responses && (
                <>
                    <h2>Мои отклики</h2>
                    <div className={s.bids}>
                        {responses.map((item, key) => {
                            if (item.status == 'Новая') {
                                return (<Bid bid={item} key={key} bidType={userType} user={userData} itResponse={true} />)
                            }
                        })}
                    </div>
                </>
            )}
        </section>
    );
}

export default LkVeteran;
