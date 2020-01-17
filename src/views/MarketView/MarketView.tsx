import React from 'react';
import MarketContent from '../../containers/MarketContent';
import AnonsContainer from '../../containers/AnonsContainer';
import './MarketView.scss';
import SegmentContainer from '../../containers/SegmentContainer';
import Row from '../../components/Row';
import Column from '../../components/Column';
import GlobalStore from '../../store/GlobalStore';
import { observer, inject } from 'mobx-react';
import BottombarContainer from '../../containers/BottombarContainer';
import Preloader from '../../components/Preloader';

interface IMarketViewState {
  activeSegmentId: string;
}

interface IMarketViewProps {
  globalStore?: GlobalStore;
}

@inject('globalStore')
@observer
class MarketView extends React.Component<IMarketViewProps, IMarketViewState> {
  state = {
    activeSegmentId: 'all',
  };

  render() {
    const { blocks, currentMarket, loading } = this.props.globalStore!;
    const segments = currentMarket ? currentMarket.segments : null;

    return (
      <>
        <div className="market-view">
          {loading ? (
            <Preloader></Preloader>
          ) : (
            <>
              {segments ? (
                <div className="market-view__segments">
                  <SegmentContainer items={segments}></SegmentContainer>
                </div>
              ) : null}
              <div className="market-view__content">
                <Row>
                  <Column sm={6} md={6}>
                    {blocks ? <MarketContent></MarketContent> : null}
                  </Column>
                  <Column sm={6} md={6}>
                    <AnonsContainer></AnonsContainer>
                  </Column>
                </Row>
              </div>
            </>
          )}
        </div>
        <BottombarContainer></BottombarContainer>
      </>
    );
  }
}

export default MarketView;
