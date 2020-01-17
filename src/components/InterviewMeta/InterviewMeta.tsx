import React, { useState, useEffect, useRef } from 'react';
import './InterviewMeta.scss';
import { TInterview, TBookmark } from 'dashboards/types';
import Button from '../Button';
import Icon from '../Icon';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { observer, inject } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import toggleBookmark from '../../utils/toogleBookmark';
import { TArticle } from '../../App';
import highlightString from '../../utils/highlightString';

interface IInterview {
  baseClass: string;
  contentData: TArticle;
  isOpened: boolean;
  onOpen: () => void;
  globalStore?: GlobalStore;
}

const InterviewMeta: React.FC<IInterview> = inject('globalStore')(
  observer((props) => {
    const { contentData, isOpened, onOpen, baseClass } = props;
    const [isDownloadTooltip, setIsDownloadTooltip] = useState(false);
    const downloadContainerRef = useRef<HTMLDivElement>(null);
    const {
      currentMarket,
      bookmarks,
      updateBookmarksApi,
      currentSearchString,
    } = props.globalStore!;
    let isSelectedBookmark = false;
    const content = contentData.content as TInterview;

    const toggleTooltipDownload = () => {
      setIsDownloadTooltip(!isDownloadTooltip);
    };

    useEffect(() => {
      document.addEventListener('click', (event) => {
        const target = event.target;

        if (
          downloadContainerRef.current &&
          !downloadContainerRef.current.contains(target as Node)
        ) {
          setIsDownloadTooltip(false);
        }
      });
    }, [isDownloadTooltip]);

    if (bookmarks) {
      isSelectedBookmark = bookmarks.some(
        (bookmark: TBookmark) =>
          bookmark.idArticle === contentData.id &&
          bookmark.idBlock === contentData.block!.sys.id &&
          bookmark.idSubsection === (contentData.subSection ? contentData.subSection.sys.id : '') &&
          bookmark.idSection === contentData.section!.sys.id &&
          bookmark.idMarket === currentMarket!.id
      );
    }

    let respondentName = content.respondentName ? content.respondentName : null;

    if (currentSearchString && respondentName) {
      respondentName = highlightString(respondentName, currentSearchString);
    }

    return (
      <>
        <div className={`${baseClass}__toggle-button`}>
          <Button
            label={`${isOpened ? 'Свернуть все вопросы' : 'Развернуть все вопросы'}`}
            color="gray"
            filled={true}
            onClick={() => onOpen()}
          ></Button>
        </div>
        <div className={`${baseClass}__general`}>
          {content.respondentPhoto ? (
            <img
              className={`${baseClass}__photo`}
              src={content.respondentPhoto.fields.file.url}
              alt={content.respondentName}
            />
          ) : null}
          {respondentName ? (
            <div
              className={`${baseClass}__name`}
              dangerouslySetInnerHTML={{ __html: respondentName }}
            ></div>
          ) : null}
          {content.updatedAt ? (
            <div className={`${baseClass}__field-meta`}>
              <span>Обновлено: </span>
              {dayjs(content.updatedAt)
                .locale('ru')
                .format('MMMM YYYY')}
            </div>
          ) : null}
          <div className={`${baseClass}__controls`}>
            {content.sourceImage || content.source ? (
              <div className={`${baseClass}__download-container`} ref={downloadContainerRef}>
                <button
                  className={`${baseClass}__download`}
                  onClick={() => toggleTooltipDownload()}
                >
                  <Icon name="download" selected={isDownloadTooltip} />
                </button>
                {isDownloadTooltip ? (
                  <div className={`${baseClass}__download-tooltip`}>
                    {content.sourceImage ? (
                      <button
                        onClick={() =>
                          content.sourceImage
                            ? saveAs(
                                content.sourceImage.fields.file.url,
                                content.sourceImage.fields.file.fileName
                              )
                            : null
                        }
                      >
                        <Icon name="pdf-icon" /> {'.'}
                        {
                          content.sourceImage.fields.file.fileName.split('.')[
                            content.sourceImage.fields.file.fileName.split('.').length - 1
                          ]
                        }
                      </button>
                    ) : null}
                    {content.source ? (
                      <button
                        onClick={() =>
                          content.source
                            ? saveAs(
                                content.source.fields.file.url,
                                content.source.fields.file.fileName
                              )
                            : null
                        }
                      >
                        <Icon name="doc-icon" /> {'.'}
                        {
                          content.source.fields.file.fileName.split('.')[
                            content.source.fields.file.fileName.split('.').length - 1
                          ]
                        }
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
            <button
              className={`${baseClass}__bookmark`}
              onClick={() => {
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
            {/* <button className={`${baseClass}__notification`}>
              <Icon name="notification" />
            </button> */}
          </div>
        </div>
      </>
    );
  })
);

export default InterviewMeta;
