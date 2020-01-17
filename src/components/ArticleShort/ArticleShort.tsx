import * as React from 'react';
import cn from 'classnames';
import './ArticleShort.scss';
import { TArticle } from '../../App';
import { TInterview, TThesis, TBookmark } from 'dashboards/types';
import { inject, observer } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import highlightString from '../../utils/highlightString';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document } from '@contentful/rich-text-types';
import { Entry } from 'contentful';
import Icon from '../Icon';
import toggleBookmark from '../../utils/toogleBookmark';

interface IArticleShortProps extends React.HTMLAttributes<HTMLDivElement> {
  contentData: TArticle;
  globalStore?: GlobalStore;
  isText?: boolean;
}

const ArticleShort: React.FC<IArticleShortProps> = inject('globalStore')(
  observer((props) => {
    let { contentData, isText } = props;
    const {
      currentSearchString,
      bookmarks,
      currentMarket,
      updateBookmarksApi,
    } = props.globalStore!;

    const baseClass = 'article-short';
    const isActive = false;

    const classes = cn(baseClass, {
      [`${baseClass}--active`]: isActive,
    });

    const name =
      contentData.content && contentData.content.contentType === 'interview'
        ? `${(contentData.content as TInterview).respondentName}, ${
            (contentData.content as TInterview).companyName
          }`
        : contentData.content
        ? (contentData.content as TThesis).title
        : '';

    let textShort = '';
    currentSearchString.split(' ').forEach((searchString) => {
      for (let [key, val] of Object.entries(contentData.content)) {
        if (key === 'methodology' || key === 'thezisText' || key === 'comment') {
          val = documentToHtmlString(val as Document);
        }

        if (key === 'interviewQuestion' && val && val.length) {
          const question = val.filter(
            (interviewQuestion: Entry<any>) =>
              documentToHtmlString(interviewQuestion.fields.question)
                .toLowerCase()
                .indexOf(searchString.toLowerCase()) !== -1
          )[0];

          const answer = val.filter(
            (interviewQuestion: Entry<any>) =>
              documentToHtmlString(interviewQuestion.fields.answer)
                .toLowerCase()
                .indexOf(searchString.toLowerCase()) !== -1
          )[0];

          if (question && question.fields) {
            val = documentToHtmlString(question.fields.question);
          }
          if (answer && answer.fields) {
            val = documentToHtmlString(answer.fields.answer);
          }
        }

        if (key === 'title' || key === 'companyName' || key === 'respondentName') {
          val = '';
        }

        if (val && searchString) {
          const isString = String(val)
            .toLowerCase()
            .indexOf(searchString.toLowerCase());

          if (isString !== -1 && searchString) {
            textShort +=
              String(val).slice(
                isString - 50 <= 0 ? 0 : isString - 50,
                isString + searchString.length + 50
              ) + '...';
          }
        }
      }
    });

    if (textShort && currentSearchString) {
      textShort = '...' + highlightString(textShort.split('...')[0], currentSearchString, true);
    }

    let isSelectedBookmark = false;

    if (bookmarks) {
      isSelectedBookmark = bookmarks.some(
        (bookmark: TBookmark) =>
          bookmark.idArticle === contentData.id &&
          bookmark.idBlock === (contentData.block ? contentData.block.sys.id : '') &&
          bookmark.idSubsection === (contentData.subSection ? contentData.subSection.sys.id : '') &&
          bookmark.idSection === (contentData.section ? contentData.section.sys.id : '') &&
          bookmark.idMarket === currentMarket!.id
      );
    }

    const classesBookmark = cn(`${baseClass}__bookmark-button`, {
      [`${baseClass}__bookmark-button--selected`]: isSelectedBookmark,
    });

    return (
      <div className={classes}>
        <div className={baseClass + '__path'}>{contentData ? contentData.path : ''}</div>
        <div className={baseClass + '__title'}>{name}</div>
        <button
          className={classesBookmark}
          onClick={(event) => {
            event.stopPropagation();

            const updatedBookmarks = toggleBookmark(
              contentData,
              contentData.block!.sys.id,
              currentMarket!.id,
              bookmarks
            );

            if (updatedBookmarks.deletedBookmark) {
              updateBookmarksApi(updatedBookmarks.items, updatedBookmarks.deletedBookmark);
            } else {
              updateBookmarksApi(updatedBookmarks.items);
            }
          }}
        >
          <Icon name="bookmark" selected={isSelectedBookmark} />
        </button>
        {isText && textShort ? (
          <div
            className={baseClass + '__text'}
            dangerouslySetInnerHTML={{ __html: textShort }}
          ></div>
        ) : null}
      </div>
    );
  })
);

export default ArticleShort;
