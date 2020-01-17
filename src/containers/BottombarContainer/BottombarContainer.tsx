import React from 'react';
import './BottombarContainer.scss';

class BottombarContainer extends React.Component {
  render() {
    return (
      <div className="bottombar">
        <div className="bottombar__col">
          <div className="bottombar__privacy">
            © 1995–2019 Все права защищены. АО «РОСБИЗНЕСКОНСАЛТИНГ»
          </div>
          <div className="bottombar__links">
            <a href="https://marketing.rbc.ru/terms-of-use/" className="bottombar__link">
              Пользовательское соглашение
            </a>
            <a href="https://marketing.rbc.ru/terms-of-use/" className="bottombar__link">
              Политика конфиденциальности
            </a>
          </div>
        </div>
        <div className="bottombar__contact">
          Есть вопросы? Напишите нам на <a href="mailto:marketing@rbc.ru">marketing@rbc.ru</a>
        </div>
      </div>
    );
  }
}

export default BottombarContainer;
