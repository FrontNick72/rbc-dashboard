import React from 'react';
import cn from 'classnames';
import './ThesisContainer.scss';
import { TThesis } from 'dashboards/types';
// import Conditional from '../../components/Conditional';
import Row from '../../components/Row';
import Column from '../../components/Column';
import ThesisMeta from '../../components/ThesisMeta';
import MetaScrolling from '../../components/MetaScrolling';
import { TArticle } from '../../App';
import { observer, inject } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import { Document } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import highlightString from '../../utils/highlightString';

interface IThesisContainerState {}

interface IThesisProps {
  contentData: TArticle;
  scrollTopMeta: number;
  globalStore?: GlobalStore;
}

@inject('globalStore')
@observer
class ThesisContainer extends React.Component<IThesisProps, IThesisContainerState> {
  state: IThesisContainerState = {};

  private thesisBlockRef = React.createRef<HTMLDivElement>();
  private thesisMetaRef = React.createRef<HTMLDivElement>();
  public thesisHeight: number = 0;
  public thesisBlockTopCoord: number = 0;
  public thesisMetaTopCoord: number = 0;

  updateThesisHeight() {
    setTimeout(() => {
      if (this.thesisBlockRef.current && this.thesisMetaRef.current) {
        this.thesisHeight = this.thesisBlockRef.current.clientHeight;
        this.thesisBlockTopCoord =
          this.thesisBlockRef.current.getBoundingClientRect().top - 60 + this.props.scrollTopMeta;
        this.thesisMetaTopCoord =
          this.thesisMetaRef.current.getBoundingClientRect().top - 60 + this.props.scrollTopMeta;
      }
    }, 1);
  }

  componentDidMount() {
    this.updateThesisHeight();
  }

  componentDidUpdate() {
    this.updateThesisHeight();
  }

  render() {
    const { contentData } = this.props;
    const { isBookmarkAll, currentMarket, currentSearchString } = this.props.globalStore!;
    const contentArticle = contentData.content as TThesis;
    const baseClass = 'thesis-content';
    const classes = cn(baseClass, {});
    const titleString = contentArticle.title;
    let textString = contentArticle.thezisText
      ? documentToHtmlString(contentArticle.thezisText as Document)
      : null;

    if (textString && currentSearchString) {
      textString = highlightString(textString, currentSearchString);
    }

    const illustration = contentArticle.illustration
      ? contentArticle.illustration.fields.file
      : null;
    const segmetnPath = contentData.segment ? `${contentData.segment.fields.name} /` : '';
    const subSectionPath = contentData.subSection ? `${contentData.subSection.fields.name} /` : '';
    const sectionPath = contentData.section ? `${contentData.section.fields.name} /` : '';
    const blockPath = contentData.block ? `${contentData.block.fields.name} /` : '';
    const marketPath = currentMarket ? `${currentMarket.name} /` : '';
    const pathString =
      marketPath + ' ' + segmetnPath + ' ' + blockPath + ' ' + sectionPath + ' ' + subSectionPath;
    const idBlock = contentData.block ? contentData.block.sys.id + '-' : '';
    const idSection = contentData.section ? contentData.section.sys.id + '-' : '';
    const idSubSection = contentData.subSection ? contentData.subSection.sys.id + '-' : '';

    return (
      <div className="thesis" id={`${idBlock}${idSection}${idSubSection}${contentData.id}`}>
        {isBookmarkAll ? <div className={`${baseClass}__path`}>{pathString}</div> : null}
        <div className={`${baseClass}__title`}>{titleString}</div>
        <Row>
          <Column lg={10} md={9} sm={9}>
            <div className={classes} ref={this.thesisBlockRef}>
              {textString ? (
                <div
                  className={`${baseClass}__text`}
                  dangerouslySetInnerHTML={{ __html: textString }}
                ></div>
              ) : null}
              {illustration ? (
                <img
                  src={illustration.url}
                  className={`${baseClass}__image`}
                  alt={illustration.fileName}
                />
              ) : null}
            </div>
          </Column>
          <Column lg={2} md={3} sm={3}>
            <div className="thesis-meta-content" ref={this.thesisMetaRef}>
              <MetaScrolling
                scrollTopMeta={this.props.scrollTopMeta}
                coordBlockTop={this.thesisBlockTopCoord}
                coordBlockTopMeta={this.thesisMetaTopCoord}
                generalBlockHeight={this.thesisHeight}
                titleBlock={titleString}
              >
                <ThesisMeta baseClass={'thesis-meta-content'} contentData={contentData} />
              </MetaScrolling>
            </div>
          </Column>
        </Row>
      </div>
    );
  }
}

export default ThesisContainer;
