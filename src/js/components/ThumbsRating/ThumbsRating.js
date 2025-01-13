import React from 'react';
import { Like } from 'grommet-icons/icons/Like';
import { LikeFill } from 'grommet-icons/icons/LikeFill';
import { Dislike } from 'grommet-icons/icons/Dislike';
import { DislikeFill } from 'grommet-icons/icons/DislikeFill';
import { RadioButtonGroup } from '../RadioButtonGroup';
import { StyledRadioButtonBox } from '../RadioButton/StyledRadioButton';
import { useThemeValue } from '../../utils/useThemeValue';

const ThumbsRating = ({ ...rest }) => {
  const { theme } = useThemeValue();
  return (
    <RadioButtonGroup direction="row" options={['like', 'dislike']} {...rest}>
      {(option, { checked, focus, usingKeyboard }) => {
        if (option === 'like') {
          return (
            <StyledRadioButtonBox focus={focus && usingKeyboard}>
              {checked ? (
                <LikeFill color={theme.thumbsRating?.like?.color} />
              ) : (
                <Like color={theme.thumbsRating?.like?.color} />
              )}
            </StyledRadioButtonBox>
          );
        }
        return (
          <StyledRadioButtonBox focus={focus && usingKeyboard}>
            {checked ? (
              <DislikeFill color={theme.thumbsRating?.dislike?.color} />
            ) : (
              <Dislike color={theme.thumbsRating?.dislike?.color} />
            )}
          </StyledRadioButtonBox>
        );
      }}
    </RadioButtonGroup>
  );
};

ThumbsRating.displayName = 'ThumbsRating';
export { ThumbsRating };
