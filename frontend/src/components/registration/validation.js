// Правила для формы входа
export const loginValidationRules = {
    login: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
      message: 'Только латиница, цифры и _',
    },
    pass: {
      required: true,
      minLength: 6,
      message: 'Минимум 6 символов',
    },
  };
  
  // Правила для формы регистрации
  export const registerValidationRules = {
    firstName: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Zа-яА-ЯёЁ]+$/,
      message: 'Только буквы',
    },
    lastName: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Zа-яА-ЯёЁ]+$/,
      message: 'Только буквы',
    },
    login: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
      message: 'Только латиница, цифры и _',
    },
    pass: {
      required: true,
      minLength: 6,
      message: 'Минимум 6 символов',
    },
    pass2: {
      required: true,
      message: 'Пароли должны совпадать',
    },
    phone: {
      required: true,
      pattern: /^\+?[0-9]{10,15}$/,
      message: 'Некорректный формат телефона',
    },
    city: {
      required: true,
      minLength: 2,
      message: 'Укажите город',
    },
  };
  
  // Проверка одного поля
  export const validateField = (name, value, rules, formData = {}) => {
    if (rules.required && !value.trim()) {
      return rules.message || 'Обязательное поле';
    }
    if (rules.minLength && value.length < rules.minLength) {
      return rules.message || `Минимум ${rules.minLength} символа`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Максимум ${rules.maxLength} символов`;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message || 'Некорректный формат';
    }
    if (name === 'pass2' && value !== formData.pass?.value) {
      return 'Пароли не совпадают';
    }
    return '';
  };
  
  // Проверка всей формы
  export const validateForm = (formData, isRegister) => {
    const rules = isRegister ? registerValidationRules : loginValidationRules;
    const errors = {};
    let isValid = true;
  
    Object.keys(rules).forEach((key) => {
      const error = validateField(key, formData[key]?.value || '', rules[key], formData);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });
  
    return { errors, isValid };
  };