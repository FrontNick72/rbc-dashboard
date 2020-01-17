import React from 'react';
import cn from 'classnames';
import './DigitalContainer.scss';
import { TDigital } from 'dashboards/types';
import Conditional from '../../components/Conditional';
import Row from '../../components/Row';
import Column from '../../components/Column';
import DigitalMeta from '../../components/DigitalMeta';
import MetaScrolling from '../../components/MetaScrolling';
import { TArticle } from '../../App';
import { observer, inject } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import { Document } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import highlightString from '../../utils/highlightString';

interface IDigitalContainerState {
  openedComment: boolean;
}

interface IDigitalProps {
  contentData: TArticle;
  openedComment: boolean;
  scrollTopMeta: number;
  globalStore?: GlobalStore;
}

@inject('globalStore')
@observer
class DigitalContainer extends React.Component<IDigitalProps, IDigitalContainerState> {
  state: IDigitalContainerState = {
    openedComment: this.props.openedComment,
  };

  private digitalBlockRef = React.createRef<HTMLDivElement>();
  private digitalMetaRef = React.createRef<HTMLDivElement>();
  public digitalHeight: number = 0;
  public digitalBlockTopCoord: number = 0;
  public digitalMetaTopCoord: number = 0;

  updateDigitalHeight() {
    setTimeout(() => {
      if (this.digitalBlockRef.current && this.digitalMetaRef.current) {
        this.digitalHeight = this.digitalBlockRef.current.clientHeight;
        this.digitalBlockTopCoord =
          this.digitalBlockRef.current.getBoundingClientRect().top - 60 + this.props.scrollTopMeta;
        this.digitalMetaTopCoord =
          this.digitalMetaRef.current.getBoundingClientRect().top - 60 + this.props.scrollTopMeta;
      }
    }, 1);
  }

  toggleCommentHandler = () => {
    this.setState({
      openedComment: !this.state.openedComment,
    });
  };

  componentDidMount() {
    this.updateDigitalHeight();
  }

  componentDidUpdate() {
    this.updateDigitalHeight();
  }

  render() {
    const { contentData } = this.props;
    const {
      isBookmarkAll,
      currentMarket,
      currentSearchString,
    } = this.props.globalStore!;
    const { openedComment } = this.state;
    const contentArtice = contentData.content as TDigital;
    const baseClass = 'digital-content';
    const classes = cn(baseClass, {});
    const titleString = contentArtice.title;

    let comment = contentArtice.comment
      ? documentToHtmlString(contentArtice.comment as Document)
      : null;

    if (comment && currentSearchString) {
      comment = highlightString(comment, currentSearchString);
    }

    const illustration = contentArtice.image ? contentArtice.image.fields.file : null;
    const illustrationTitle =
      contentArtice.image && contentArtice.image.fields.title
        ? contentArtice.image.fields.title
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
      <div className="digital" id={`${idBlock}${idSection}${idSubSection}${contentData.id}`}>
        {isBookmarkAll ? <div className={`${baseClass}__path`}>{pathString}</div> : null}
        <div className={`${baseClass}__title`}>
          {illustrationTitle ? illustrationTitle : titleString}
        </div>
        <Row>
          <Column lg={10} md={9} sm={9}>
            <div className={classes} ref={this.digitalBlockRef}>
              {illustration ? (
                <img
                  src={illustration.url}
                  className={`${baseClass}__image`}
                  alt={illustration.fileName}
                />
              ) : null}
              <div className={`${baseClass}__comment`}>
                {comment ? (
                  <div className={`${baseClass}__comment-container`}>
                    <div className="comment-block">
                      <div className="comment-block__comment-sign">Комментарий к данным</div>
                      <Conditional render={openedComment}>
                        <div
                          className="comment-block__comment"
                          dangerouslySetInnerHTML={{ __html: comment }}
                        ></div>
                      </Conditional>
                      <button
                        onClick={() => this.toggleCommentHandler()}
                        className="comment-block__toggle-button"
                      >
                        {openedComment ? 'Свернуть' : 'Развернуть'}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </Column>
          <Column lg={2} md={3} sm={3}>
            <div className="digital-meta-content" ref={this.digitalMetaRef}>
              <MetaScrolling
                scrollTopMeta={this.props.scrollTopMeta}
                coordBlockTop={this.digitalBlockTopCoord}
                coordBlockTopMeta={this.digitalMetaTopCoord}
                generalBlockHeight={this.digitalHeight}
                titleBlock={titleString}
              >
                <DigitalMeta
                  baseClass={'digital-meta-content'}
                  contentData={contentData}
                  onOpen={this.toggleCommentHandler}
                  isOpened={openedComment}
                ></DigitalMeta>
              </MetaScrolling>
            </div>
          </Column>
        </Row>
      </div>
    );
  }
}

export default DigitalContainer;
