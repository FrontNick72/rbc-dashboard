import { Entry } from 'contentful';

const checkArticlesInSegment = (
  segment: Entry<any> & {
    checked: boolean;
  }
) => {
  if (segment && segment.fields && segment.fields.block) {
    return segment.fields.block.some((block: Entry<any>) => {
      if (block && block.fields && block.fields.sections) {
        return block.fields.sections.some((section: Entry<any>) => {
          if (section && section.fields && section.fields.items) {
            return true;
          } else {
            return false;
          }
        });
      } else {
        return false;
      }
    });
  } else {
    return false;
  }
};

export default checkArticlesInSegment;
