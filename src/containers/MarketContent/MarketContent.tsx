import React from 'react';
import Header from '../../components/Header';
import SubHeader from '../../components/SubHeader';
import Scrollbar from '../../components/Scrollbar';

import './MarketContent.scss';
import { Entry } from 'contentful';
import GlobalStore from '../../store/GlobalStore';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

interface IMarketContentProps {
  globalStore?: GlobalStore;
}

@inject('globalStore')
@observer
class MarketContent extends React.Component<IMarketContentProps, {}> {
  public buildBlocks = () => {
    const { blocks, linkToContent } = this.props.globalStore!;

    return blocks.map((block: Entry<any>) => {
      if (!block.fields) return null;

      const lengthNameBlock = block.fields.name.length;
      const isBigName = lengthNameBlock > 40;
      const addition = isBigName ? '...' : '';
      let sectionsArray: Entry<any>[] = [];

      if (block.fields.sections) {
        block.fields.sections.forEach((section: Entry<any>) => {
          if (section.fields.items) {
            sectionsArray.push(section);
          }
        });
      }

      const firstSection: Entry<any> | null =
        sectionsArray && sectionsArray.length ? sectionsArray[0] : null;

      if (!sectionsArray || !sectionsArray.length) return null;

      return (
        <div key={block.sys.id} className="market-content__item">
          <SubHeader link={'/content'} clickedHandler={() => linkToContent(firstSection, block)}>
            {block.fields.name.substr(0, 40) + addition}
          </SubHeader>
          <div className="market-content__categories">
            {this.buildSections(sectionsArray, block)}
          </div>
        </div>
      );
    });
  };

  public buildSections = (sectionsArray: Entry<any>[], block: Entry<any>) => {
    const { linkToContent } = this.props.globalStore!;

    return sectionsArray.map((section: Entry<any>) => {
      const lengthNameSection = section.fields.name.length;
      const isBigName = lengthNameSection > 80;
      const addition = isBigName ? '...' : '';

      return (
        <Link
          key={section.sys.id}
          to={'/content'}
          className="market-content__category"
          onClick={(event) => {
            event.stopPropagation();
            linkToContent(section, block);
          }}
        >
          {section.fields.name.substr(0, 80) + addition}
        </Link>
      );
    });
  };

  render() {
    return (
      <Scrollbar>
        <div className="market-content">
          <Header>Содержание рынка</Header>
          <div className="market-content__items">{this.buildBlocks()}</div>
        </div>
      </Scrollbar>
    );
  }
}

export default MarketContent;
