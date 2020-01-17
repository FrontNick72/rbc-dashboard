import React from 'react';
import cn from 'classnames';
import './InterviewContainer.scss';
import { TInterview } from 'dashboards/types';
import Conditional from '../../components/Conditional';
import Row from '../../components/Row';
import Column from '../../components/Column';
import InterviewMeta from '../../components/InterviewMeta';
import MetaScrolling from '../../components/MetaScrolling';
import { TArticle } from '../../App';
import { observer, inject } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import highlightString from '../../utils/highlightString';

interface IInterviewContainerState {
  openedQuestion: number[];
}

interface IInterviewProps {
  contentData: TArticle;
  openedQuestion: number[];
  scrollTopMeta: number;
  globalStore?: GlobalStore;
}

@inject('globalStore')
@observer
class InterviewContainer extends React.Component<IInterviewProps, IInterviewContainerState> {
  state: IInterviewContainerState = {
    openedQuestion: this.props.openedQuestion,
  };

  private interviewBlockRef = React.createRef<HTMLDivElement>();
  private interviewMetaRef = React.createRef<HTMLDivElement>();
  public interviewHeight: number = 0;
  public interviewBlockTopCoord: number = 0;
  public interviewMetaTopCoord: number = 0;

  updateInterviewHeight() {
    setTimeout(() => {
      if (this.interviewBlockRef.current && this.interviewMetaRef.current) {
        this.interviewHeight = this.interviewBlockRef.current.clientHeight;
        this.interviewBlockTopCoord =
          this.interviewBlockRef.current.getBoundingClientRect().top -
          60 +
          this.props.scrollTopMeta;
        this.interviewMetaTopCoord =
          this.interviewMetaRef.current.getBoundingClientRect().top - 60 + this.props.scrollTopMeta;
      }
    }, 1);
  }

  openQuestionsHandler(index: number) {
    const { openedQuestion } = this.state;
    if (openedQuestion.indexOf(index) !== -1) {
      this.setState({ openedQuestion: openedQuestion.filter((el) => el !== index) });
      return;
    }
    this.setState({ openedQuestion: [...openedQuestion, index] });
  }

  openAllQuestionsHandler = () => {
    const { openedQuestion } = this.state;
    const { contentData } = this.props;
    const questionArray = (contentData.content as TInterview).interviewQuestion;

    if (questionArray) {
      if (openedQuestion.length === questionArray.length) {
        this.setState({ openedQuestion: [] });
        return;
      }

      this.setState({ openedQuestion: [...questionArray.map((question, index) => index)] });
    }
  };

  componentDidMount() {
    this.updateInterviewHeight();
  }

  componentDidUpdate() {
    this.updateInterviewHeight();
  }

  render() {
    const { contentData } = this.props;
    const { openedQuestion } = this.state;
    const {
      isBookmarkAll,
      currentMarket,
      currentSearchString,
    } = this.props.globalStore!;
    const contentArticle = contentData.content as TInterview;
    const baseClass = 'interview-content';
    const classes = cn(baseClass, {});
    let titleString = `Интервью ${contentArticle.companyName}`;

    if (currentSearchString && titleString) {
      titleString = highlightString(titleString, currentSearchString);
    }

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
      <div className="interview" id={`${idBlock}${idSection}${idSubSection}${contentData.id}`}>
        {isBookmarkAll ? <div className={`${baseClass}__path`}>{pathString}</div> : null}
        <div
          className={`${baseClass}__title`}
          dangerouslySetInnerHTML={{ __html: titleString }}
        ></div>
        <Row>
          <Column lg={10} md={9} sm={9}>
            <div className={classes} ref={this.interviewBlockRef}>
              <div className={`${baseClass}__questions`}>
                {contentArticle.interviewQuestion
                  ? contentArticle.interviewQuestion.map((question, index) => {
                      const isOpenedQuestion = openedQuestion.indexOf(index) !== -1;
                      let questionString = question.fields.question.content[0].content[0].value;
                      let answerString = question.fields.answer.content[0].content[0].value;

                      if (currentSearchString) {
                        if (questionString) {
                          questionString = highlightString(questionString, currentSearchString);
                        }

                        if (answerString) {
                          answerString = highlightString(answerString, currentSearchString);
                        }
                      }

                      return (
                        <div
                          key={`${index}-question`}
                          className={`${baseClass}__question-container`}
                        >
                          <div className="question-block">
                            <div
                              className="question-block__question"
                              dangerouslySetInnerHTML={{ __html: questionString }}
                            ></div>
                            <Conditional render={isOpenedQuestion}>
                              <div
                                className="question-block__answer"
                                dangerouslySetInnerHTML={{ __html: answerString }}
                              ></div>
                            </Conditional>
                            <button
                              onClick={() => this.openQuestionsHandler(index)}
                              className="question-block__toggle-button"
                            >
                              {isOpenedQuestion ? 'Свернуть' : 'Развернуть'}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          </Column>
          <Column lg={2} md={3} sm={3}>
            <div className="interview-meta-content" ref={this.interviewMetaRef}>
              <MetaScrolling
                scrollTopMeta={this.props.scrollTopMeta}
                coordBlockTop={this.interviewBlockTopCoord}
                coordBlockTopMeta={this.interviewMetaTopCoord}
                generalBlockHeight={this.interviewHeight}
                titleBlock={titleString}
              >
                <InterviewMeta
                  baseClass={'interview-meta-content'}
                  contentData={contentData}
                  onOpen={this.openAllQuestionsHandler}
                  isOpened={
                    openedQuestion.length !== 0 &&
                    contentArticle.interviewQuestion !== undefined &&
                    openedQuestion.length === contentArticle.interviewQuestion.length
                  }
                ></InterviewMeta>
              </MetaScrolling>
            </div>
          </Column>
        </Row>
      </div>
    );
  }
}

export default InterviewContainer;
