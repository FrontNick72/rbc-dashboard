import React from 'react';
import './SegmentContainer.scss';
import Button from '../../components/Button';
import { Entry } from 'contentful';
import GlobalStore from '../../store/GlobalStore';
import { inject, observer } from 'mobx-react';
import checkArticlesInSegment from '../../utils/checkArticlesInSegment';

interface ISegmentContainerState {
  segments: (Entry<any> & { checked: boolean })[];
  activeId: string;
}

interface ISegmentContainerProps {
  items: (Entry<any> & { checked: boolean })[];
  globalStore?: GlobalStore;
}

@inject('globalStore')
@observer
class SegmentContainer extends React.Component<ISegmentContainerProps, ISegmentContainerState> {
  state: ISegmentContainerState = {
    segments: this.props.items,
    activeId: 'all',
  };

  clickHandler = (id: string) => {
    const updatedSegments = [...this.state.segments];
    const { updateBlocks, currentMarket, changeCurrentSegment } = this.props.globalStore!;
    let isUpdate = false;

    updatedSegments.map((segment) => {
      if (segment.sys.id === id) {
        segment.checked = true;
        let blocks = [];

        if (segment.fields.block) {
          blocks = segment.fields.block;
          updateBlocks(blocks);
          isUpdate = true;
        } else if (currentMarket) {
          updateBlocks(currentMarket.blocks);
        }

        changeCurrentSegment({
          id: id,
          block: blocks,
          name: segment.fields.name,
        });
      } else {
        segment.checked = false;
      }

      return segment;
    });

    if (!isUpdate) {
      updateBlocks(currentMarket!.blocks);
      changeCurrentSegment(null);
    }

    this.setState({ segments: updatedSegments, activeId: id });
  };

  componentDidMount() {
    const { currentSegment } = this.props.globalStore!;

    if (!currentSegment) {
      const updatedSegments = this.props.items.filter(
        (segment: Entry<any> & { checked: boolean }) => {
          return checkArticlesInSegment(segment);
        }
      );

      if (updatedSegments && updatedSegments.length) {
        updatedSegments.map((segment: Entry<any> & { checked: boolean }, index) => {
          if (index === 0) {
            segment.checked = true;
            this.clickHandler(segment.sys.id);
          }

          return segment;
        });
      }

      this.setState({ segments: updatedSegments });
    }
  }

  componentDidUpdate(prevProps: ISegmentContainerProps) {
    if (prevProps.items[0].sys.id !== this.props.items[0].sys.id) {
      const segments = this.props.items.map((item) => {
        item.checked = false;
        return item;
      });

      this.setState({ segments: segments, activeId: 'all' });
    }
  }

  render() {
    const { currentMarket, currentSegment } = this.props.globalStore!;
    const isAllSegment =
      currentMarket && currentMarket.blocks && currentMarket.blocks.length ? true : false;

    return (
      <div className="segment-container">
        {isAllSegment ? (
          <div key={`segment-all`} className="segment-container__segment">
            <Button
              label={'Весь рынок'}
              color="yellow"
              onClick={() => this.clickHandler('all')}
              checked={currentSegment === null || this.state.activeId === 'all'}
            />
          </div>
        ) : null}
        {this.state.segments.map((segment: Entry<any> & { checked: boolean }, index: number) => {
          let checked: boolean | undefined = undefined;
          let isNotEmptySegment = false;
          checked = !!currentSegment && currentSegment.id === segment.sys.id;

          if (!currentSegment && !isAllSegment && index === 0) {
            checked = true;
          }

          if (segment && segment.fields && segment.fields.block) {
            isNotEmptySegment = checkArticlesInSegment(segment);
          }

          return isNotEmptySegment ? (
            <div key={`segment-${segment.sys.id}`} className="segment-container__segment">
              <Button
                label={segment.fields.name}
                color="yellow"
                onClick={() => this.clickHandler(segment.sys.id)}
                checked={checked}
              />
            </div>
          ) : null;
        })}
      </div>
    );
  }
}

export default SegmentContainer;
