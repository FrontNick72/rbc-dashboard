import React, { useState, useEffect, useRef } from 'react';
import './DigitalMeta.scss';
import { TDigital, TBookmark } from 'dashboards/types';
import Icon from '../Icon';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { inject, observer } from 'mobx-react';
import GlobalStore from '../../store/GlobalStore';
import toggleBookmark from '../../utils/toogleBookmark';
import { TArticle } from '../../App';
import Button from '../Button';
import highlightString from '../../utils/highlightString';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document } from '@contentful/rich-text-types';
import { saveAs } from 'file-saver';

interface IDigital {
  baseClass: string;
  isOpened: boolean;
  onOpen: () => void;
  contentData: TArticle;
  globalStore?: GlobalStore;
}

// const quarter_of_the_year = (date: Date) => {
//   const month = date.getMonth() + 1;

//   switch (Math.ceil(month / 3)) {
//     case 1:
//       return 'I';
//     case 2:
//       return 'II';
//     case 3:
//       return 'III';
//     case 4:
//       return 'IV';
//     default:
//       break;
//   }
// };

const DigitalMeta: React.FC<IDigital> = inject('globalStore')(
  observer((props) => {
    const { contentData, baseClass, isOpened, onOpen } = props;
    const [isDownloadTooltip, setIsDownloadTooltip] = useState(false);
    const {
      currentMarket,
      bookmarks,
      updateBookmarksApi,
      currentSearchString,
    } = props.globalStore!;
    const downloadContainerRef = useRef<HTMLDivElement>(null);
    let isSelectedBookmark = false;

    const toggleTooltipDownload = () => {
      setIsDownloadTooltip(!isDownloadTooltip);
    };
    const content = contentData.content as TDigital;

    // const startQuarter = quarter_of_the_year(new Date(content.calculationPeriodStart));
    // const endQuarter = quarter_of_the_year(new Date(content.calculationPeriodEnd));
    // const rangeString =
    //   content.calculationPeriodStart || content.calculationPeriodEnd
    //     ? `${startQuarter} квартал ${dayjs(content.calculationPeriodStart)
    //         .locale('ru')
    //         .format('YYYY')} г. - ${endQuarter} квартал ${dayjs(content.calculationPeriodEnd)
    //         .locale('ru')
    //         .format('YYYY')} г.`
    //     : null;
    const rangeString =
      content.calculationPeriodStart || content.calculationPeriodEnd
        ? `${dayjs(content.calculationPeriodStart)
            .locale('ru')
            .format('MMMM YYYY')} г. - ${dayjs(content.calculationPeriodEnd)
            .locale('ru')
            .format('MMMM YYYY')} г.`
        : null;

    let methodology = content.methodology
      ? documentToHtmlString(content.methodology as Document)
      : null;

    if (methodology && currentSearchString) {
      methodology = highlightString(methodology, currentSearchString);
    }

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
        {content.comment ? (
          <div className={`${baseClass}__toggle-button`}>
            <Button
              label={`${isOpened ? 'Свернуть всё' : 'Развернуть всё'}`}
              color="gray"
              filled={true}
              onClick={() => onOpen()}
            ></Button>
          </div>
        ) : null}
        <div className={`${baseClass}__general`}>
          <div className={`${baseClass}__field-meta`}>
            <span>Размерность:</span>
            {content.units}
          </div>
          {rangeString ? (
            <div className={`${baseClass}__field-meta`}>
              <span>Период:</span>
              {rangeString}
            </div>
          ) : null}
          <div className={`${baseClass}__field-meta`}>
            <span>Источник:</span>
            {content.digital_source}
          </div>
          <div className={`${baseClass}__field-meta`}>
            <span>Обновлено: </span>
            {dayjs(content.updatedAt)
              .locale('ru')
              .format('MMMM YYYY')}
          </div>
          {methodology ? (
            <div className={`${baseClass}__field-meta`}>
              <span>Методология расчета:</span>
              <div
                className={`${baseClass}__methodology`}
                dangerouslySetInnerHTML={{ __html: methodology }}
              ></div>
            </div>
          ) : null}
          <div className={`${baseClass}__controls`}>
            {content.data_source ? (
              <div className={`${baseClass}__download-container`} ref={downloadContainerRef}>
                <button
                  className={`${baseClass}__download`}
                  onClick={() => toggleTooltipDownload()}
                >
                  <Icon name="download" selected={isDownloadTooltip} />
                </button>
                {isDownloadTooltip ? (
                  <div className={`${baseClass}__download-tooltip`}>
                    {content.data_source ? (
                      <button
                        onClick={() =>
                          content.data_source
                            ? saveAs(
                                content.data_source.fields.file.url,
                                content.data_source.fields.file.fileName
                              )
                            : null
                        }
                      >
                        <Icon name="pdf-icon" /> {'.'}
                        {
                          content.data_source.fields.file.fileName.split('.')[
                            content.data_source.fields.file.fileName.split('.').length - 1
                          ]
                        }
                      </button>
                    ) : null}
                    {/* {contentData.source ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    download={removeAllSpaces(translate(contentData.source.fields.file.fileName).trim())}
                    href={contentData.source.fields.file.url}
                  >
                    <Icon name="doc-icon" /> .doc
                  </a>
                ) : null} */}
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

export default DigitalMeta;
