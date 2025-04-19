import React, { useState, useRef, useEffect } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { Dropdown } from "primereact/dropdown";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { createVeteranRequest, getVeteranRequests, getVolunteerRequests } from '../../api/api';
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

const Bid = ({bid, bidType}) => {
    return (
        <div className={s.bid}>
            <div className={s.bid_status}>
                <span>Статус: <span className={s.status}>{bid.status}</span></span>
                <span>{bid.createdAt}</span>
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
            {
                bidType === 'veteran' && bid.status !== 'Завершена' && (
                    <div className={s.form_controllers}>
                        <Button label="Отозвать заявку" severity="danger" raised />
                        <Button label="Завершить" severity="success" raised />
                    </div>
                )
            }
            {
                bidType == "volunteer" && bid.status == "Новая" && (
                    <Button label="Откликнуться" severity="success" raised />
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
    
    useEffect(() => {
        const fetchRequestsVeteran = async () => {
          try {
            const data = await getVeteranRequests(); // Вызываем метод для получения заявок
            console.log(data.requests)
            const formattedBids = data.requests.map(request => ({
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
              createdAt: request.createAt
            }));
            setBidsVeteran(formattedBids); // Обновляем состояние
          } catch (error) {
            console.error('Не удалось загрузить заявки:', error);
          }
        };
    
        const fetchRequestsVolunteer = async () => {
            try {
              const data2 = await getVolunteerRequests(); // Вызываем метод для получения заявок
                console.log(data2)

              const formattedBids = data2.map(request => ({
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
              console.log(formattedBids)
              setBidsVolunteer(formattedBids); // Обновляем состояние
            } catch (error) {
              console.error('Не удалось загрузить заявки:', error);
            }
          };

           userType === "veteran" ? fetchRequestsVeteran() : fetchRequestsVolunteer() 

      }, []);

    // const veteran = {
    //     firstName: "Сергей",
    //     lastName: "Петров",
    //     login: "petrov_sergey",
    //     city: "Псков"
    // }

    // const volunteer = {
    //     firstName: "Иван",
    //     lastName: "Иванов",
    //     login: "ivan_123",
    //     city: "Псков"
    // }

    // let user = {};

    // if (userType === "veteran"){
    //     user = veteran;
    // } else if (userType === "volunteer"){
    //     user = volunteer;
    // }

    // const bids = [
    //     {
    //         type: 'Медицинская помощь',
    //         description: 'Не могу ходить, нужна помощь врачей',
    //         from: 'Псков, ул Ленина д 5 кв 10',
    //         status: 'Завершена',
    //         createdAt: '01-04-2025',
    //     },
    //     {
    //         type: 'Помощь с транспортом',
    //         description: 'Хочу навестить родственников из Москвы, но в связи с болезнью не могу поехать на поезде, требуется специальный автомобиль.',
    //         from: 'Псков, ул Ленина д 5 кв 1488',
    //         status: 'Выполняется',
    //         createdAt: '10-04-2025',
    //     },
    //     {
    //         type: 'Психологическая поддержка',
    //         description: 'Скучно одному, приходите расскажу интересные истории',
    //         from: 'Псков, ул Ленина д 5 кв 1488',
    //         status: 'Новая',
    //         createdAt: '01-04-2025',
    //     },
    //     {
    //         type: 'Другое',
    //         description: 'Нужна помощь с поиском друга-ветерана',
    //         from: 'Тула, ул Ленина д 5 кв 1488',
    //         status: 'Новая',
    //         createdAt: '10-04-2025',
    //     }
    // ]

    return (
        <section className={s.container}>
            <div className={s.info}>
                <p>{userData.lastName + " " + userData.firstName}</p>
                <p>{userTypeRu} из города {userData.city}</p>
            </div>
            {userType == "veteran" &&(
            <>
                <CreateBid />
                <h2>История заявок</h2>
                <div className={s.bids}>
                    {bidsVeteran.map((item, key) => (
                        <Bid bid={item} key={key} bidType={userType}/>
                    ))}
                </div>
                </>
            )}
            {userType == "volunteer" && (
                <>
                    <h2>Доступные заявки</h2>
                    <div className={s.bids}>
                        {bidsVolunteer.map((item, key) =>{
                            if (item.status == 'Новая') {
                                return (<Bid bid={item} key={key} bidType={userType}/>)
                            } 
                        })}
                    </div>
                </>
            )}
        </section>
    );
}

export default LkVeteran;
