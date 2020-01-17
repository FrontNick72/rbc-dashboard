import React from 'react';
import './SidebarContainer.scss';
import cn from 'classnames';
import Icon from '../../components/Icon';
import ColoredIcon from '../../components/ColoredIcon';
import { TColoredIconNames } from '../../utils/colored-icons';
import GlobalStore from '../../store/GlobalStore';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

interface ISidebarContainerState {
  isQuestionTooltip: boolean;
}

interface ISidebarContainerProps {
  globalStore?: GlobalStore;
}

@inject('globalStore')
@observer
class SidebarContainer extends React.Component<ISidebarContainerProps, ISidebarContainerState> {
  state = {
    isQuestionTooltip: false,
  };

  questionRef = React.createRef<HTMLDivElement>();

  toggleTooltipQuestion = () => {
    this.setState({ isQuestionTooltip: !this.state.isQuestionTooltip });
  };

  componentDidMount() {
    document.addEventListener('click', (event) => {
      const target = event.target;

      if (this.questionRef.current && !this.questionRef.current.contains(target as Node)) {
        this.setState({ isQuestionTooltip: false });
      }
    });
  }

  render() {
    const {
      markets,
      currentMarket,
      changeCurrentMarket,
      isAuthenticated,
    } = this.props.globalStore!;
    const classQuestion = cn('sidebar__question-button', {
      ['sidebar__question-button--active']: this.state.isQuestionTooltip,
    });

    return (
      <div className="sidebar">
        {isAuthenticated ? (
          <>
            <div className="sidebar__retailers-container">
              <div className="sidebar__retailers">
                {markets
                  ? markets.map((market) => {
                      let nameMarketTranslit: TColoredIconNames = 'boots';

                      if (market.name.indexOf('недвижимость') !== -1) {
                        nameMarketTranslit = 'commercial-building';
                      } else if (market.name.indexOf('Одеж') !== -1) {
                        nameMarketTranslit = 'clothes';
                      } else if (market.name.indexOf('Обув') !== -1) {
                        nameMarketTranslit = 'boots';
                      }

                      return (
                        <Link className="sidebar__retailer" key={market.id} to="/">
                          <button type="button" onClick={() => changeCurrentMarket(market.id)}>
                            <ColoredIcon
                              name={nameMarketTranslit}
                              type={market.id === currentMarket!.id ? 'normal' : 'off'}
                              selected={market.id === currentMarket!.id}
                            />
                          </button>
                        </Link>
                      );
                    })
                  : null}
              </div>
              {/* <button className="sidebar__add-retailer">
            <Icon name="plus" />
          </button> */}
            </div>
            <div className="sidebar__bottom-container">
              <Link to="/profile">
                <button className="sidebar__auth-link">
                  <Icon name="profile" />
                </button>
              </Link>

              <div className="sidebar__question-container" ref={this.questionRef}>
                <button className={classQuestion} onClick={this.toggleTooltipQuestion}>
                  <Icon name="q&a" />
                </button>
                {this.state.isQuestionTooltip ? (
                  <div className="sidebar__question-tooltip">
                    Есть вопросы? Напишите нам на{' '}
                    <a href="mailto:marketing@rbc.ru">marketing@rbc.ru</a>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    );
  }
}

export default SidebarContainer;
