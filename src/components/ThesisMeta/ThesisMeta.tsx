import React, { useState, useEffect, useRef } from 'react';
import './ThesisMeta.scss';
import { TThesis, TBookmark } from 'dashboards/types';
import Icon from '../Icon';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { observer, inject } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import toggleBookmark from '../../utils/toogleBookmark';
import { TArticle } from '../../App';

interface IThesis {
  baseClass: string;
  contentData: TArticle;
  globalStore?: GlobalStore;
}

const quarter_of_the_year = (date: Date) => {
  const month = date.getMonth() + 1;

  switch (Math.ceil(month / 3)) {
    case 1:
      return 'I';
    case 2:
      return 'II';
    case 3:
      return 'III';
    case 4:
      return 'IV';
    default:
      return '';
  }
};

const ThesisMeta: React.FC<IThesis> = inject('globalStore')(
  observer((props) => {
    const { contentData, baseClass } = props;
    const { currentMarket, bookmarks, updateBookmarksApi } = props.globalStore!;
    const [isDownloadTooltip, setIsDownloadTooltip] = useState(false);
    const downloadContainerRef = useRef<HTMLDivElement>(null);
    let isSelectedBookmark = false;
    const content = contentData.content as TThesis;

    const toggleTooltipDownload = () => {
      setIsDownloadTooltip(!isDownloadTooltip);
    };

    const startQuarter = content.periodStart
      ? quarter_of_the_year(new Date(content.periodStart))
      : null;
    const endQuarter = content.periodEnd ? quarter_of_the_year(new Date(content.periodEnd)) : null;

    const rangeString =
      startQuarter || endQuarter
        ? `${startQuarter} квартал ${dayjs(content.periodStart)
            .locale('ru')
            .format('YYYY')} г. - ${endQuarter} квартал ${dayjs(content.periodEnd)
            .locale('ru')
            .format('YYYY')} г.`
        : null;

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

    return (
      <>
        <div className={`${baseClass}__general`}>
          {rangeString ? (
            <div className={`${baseClass}__range`}>
              <span>Период:</span>
              {rangeString}
            </div>
          ) : null}
          {content.updatedAt ? (
            <div className={`${baseClass}__updated`}>
              <span>Обновлено: </span>
              {dayjs(content.updatedAt)
                .locale('ru')
                .format('MMMM YYYY')}
            </div>
          ) : null}
          <div className={`${baseClass}__controls`}>
            {content.illustration || content.source ? (
              <div className={`${baseClass}__download-container`} ref={downloadContainerRef}>
                <button
                  className={`${baseClass}__download`}
                  onClick={() => toggleTooltipDownload()}
                >
                  <Icon name="download" selected={isDownloadTooltip} />
                </button>
                {isDownloadTooltip ? (
                  <div className={`${baseClass}__download-tooltip`}>
                    {content.illustration ? (
                      <button
                        onClick={() =>
                          content.illustration
                            ? saveAs(
                                content.illustration.fields.file.url,
                                content.illustration.fields.file.fileName
                              )
                            : null
                        }
                      >
                        <Icon name="pdf-icon" /> {'.'}
                        {
                          content.illustration.fields.file.fileName.split('.')[
                            content.illustration.fields.file.fileName.split('.').length - 1
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
                        <Icon name="doc-icon" />
                        {'.'}
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

export default ThesisMeta;
