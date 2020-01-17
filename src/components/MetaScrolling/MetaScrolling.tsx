import React from 'react';
import cn from 'classnames';
import './MetaScrolling.scss';

interface IMetaScrollingProps {
  scrollTopMeta: number;
  generalBlockHeight: number;
  coordBlockTop: number;
  coordBlockTopMeta: number;
  titleBlock: string;
  children: React.ReactChild;
}

interface IMetaScrollingState {
  beginScrollTopMeta: number;
  heightMeta: number;
  isFixedMeta: boolean;
}

class MetaScrolling extends React.Component<IMetaScrollingProps, IMetaScrollingState> {
  state: IMetaScrollingState = {
    beginScrollTopMeta: 0,
    heightMeta: 0,
    isFixedMeta: false,
  };

  generalMetaRef = React.createRef<HTMLDivElement>();
  titleRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const { beginScrollTopMeta } = this.state;
    const { scrollTopMeta } = this.props;
    const node = this.generalMetaRef.current;

    if (
      node !== null &&
      beginScrollTopMeta !== node.getBoundingClientRect().top - 60 + scrollTopMeta
    ) {
      this.setState({
        beginScrollTopMeta: node.getBoundingClientRect().top - 60 + scrollTopMeta,
        heightMeta: node.scrollHeight,
      });
    }
  }

  componentDidUpdate() {
    const { beginScrollTopMeta, heightMeta, isFixedMeta } = this.state;
    const { scrollTopMeta, coordBlockTop, generalBlockHeight } = this.props;
    const cond = scrollTopMeta > coordBlockTop && generalBlockHeight - (heightMeta + 200) > 300;

    if (scrollTopMeta && beginScrollTopMeta && isFixedMeta && !cond) {
      this.setState({
        isFixedMeta: false,
      });
    }

    if (scrollTopMeta && beginScrollTopMeta && !isFixedMeta && cond) {
      this.setState({
        isFixedMeta: true,
      });
    }
  }

  render() {
    const { isFixedMeta, heightMeta } = this.state;
    const { titleBlock, scrollTopMeta, children, generalBlockHeight, coordBlockTop } = this.props;
    const classesMeta = cn(`meta-scroll`, {
      [`meta-scroll--fixed`]: isFixedMeta,
    });
    let topScroll: number = 0;
    const titleNode = this.titleRef.current;
    let titleHeight = 0;

    if (titleNode) {
      titleHeight = titleNode.scrollHeight + 12;
    }

    if (
      isFixedMeta &&
      scrollTopMeta &&
      generalBlockHeight &&
      scrollTopMeta + heightMeta + titleHeight + 60 <= generalBlockHeight + coordBlockTop
    ) {
      const value = scrollTopMeta - coordBlockTop + 14;

      topScroll = coordBlockTop > 0 ? value : scrollTopMeta + 20;
    } else if (generalBlockHeight) {
      topScroll = generalBlockHeight - heightMeta - titleHeight;
    }

    return (
      <>
        <div className={classesMeta} ref={this.generalMetaRef} style={{ top: topScroll }}>
          {isFixedMeta ? (
            <div
              ref={this.titleRef}
              className={`meta-scroll__title`}
              dangerouslySetInnerHTML={{ __html: titleBlock }}
            ></div>
          ) : null}
          {children}
        </div>
      </>
    );
  }
}

export default MetaScrolling;
