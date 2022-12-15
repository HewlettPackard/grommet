import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Like, LikeFill, Dislike, DislikeFill } from 'grommet-icons';
import { RadioButtonGroup } from '../RadioButtonGroup';

const ThumbsRating = ({ ...rest }) => {
  const theme = useContext(ThemeContext);
  return (
    <RadioButtonGroup direction="row" options={['like', 'dislike']} {...rest}>
      {(option, { checked }) => {
        if (option === 'like') {
          return checked ? (
            <LikeFill
              color={
                theme.thumbsRating?.like?.color ||
                theme.thumbsRating?.like?.color?.fill
              }
            />
          ) : (
            <Like
              color={
                theme.thumbsRating?.like?.color ||
                theme.thumbsRating?.like?.color?.outline
              }
            />
          );
        }
        return checked ? (
          <DislikeFill
            color={
              theme.thumbsRating?.dislike?.color ||
              theme.thumbsRating?.dislike?.color?.fill
            }
          />
        ) : (
          <Dislike
            color={
              theme.thumbsRating?.dislike?.color ||
              theme.thumbsRating?.dislike?.color?.fill
            }
          />
        );
      }}
    </RadioButtonGroup>
  );
};

ThumbsRating.displayName = 'ThumbsRating';
export { ThumbsRating };
