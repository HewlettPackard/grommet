import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  Fragment,
} from 'react';
import styled from 'styled-components';

import { Anchor } from '../Anchor';
import { Box } from '../Box';
import { Button } from '../Button';
import { Layer } from '../Layer';
import { Paragraph } from '../Paragraph';
import { Text } from '../Text';

import { NotificationType } from './propTypes';
import { useThemeValue } from '../../utils/useThemeValue';

const Message = ({ fill, direction, ...rest }) =>
  direction === 'row' ? (
    <Text {...rest} />
  ) : (
    <Paragraph {...rest} fill={fill || false} />
  );

const adaptThemeStyle = (value, theme) => {
  let textStyle = value;
  let closeButtonStyle = value;

  if (typeof value === 'string' && theme.global.edgeSize[value]) {
    textStyle = {
      vertical: value,
      left: value,
      right: undefined,
    };
    closeButtonStyle = { vertical: value, right: value };
  } else if (typeof value === 'object') {
    const { left, right, top, bottom, horizontal, vertical } = value;
    textStyle = {
      top: top || vertical,
      bottom: bottom || vertical,
      left: left || horizontal,
      right: undefined,
    };
    closeButtonStyle = {
      top: top || vertical,
      bottom: bottom || vertical,
      right: right || horizontal,
    };
  }

  return [textStyle, closeButtonStyle];
};

const getTextColor = (part, status, kind, theme) => {
  let color;
  if (theme.notification?.[status]?.[kind]?.[part]?.color)
    color = theme.notification?.[status]?.[kind]?.[part]?.color;
  else if (theme.notification?.[status]?.[part]?.color)
    color = theme.notification?.[status]?.[part]?.color;
  else color = theme.notification?.[part]?.color;
  return color;
};

const NotificationAnchor = styled(Anchor)`
  white-space: nowrap;
`;

const Notification = ({
  actions: actionsProp,
  message: messageProp,
  onClose,
  id,
  global,
  status = 'unknown',
  title,
  toast = false,
  icon,
  time,
  ...rest
}) => {
  const autoClose =
    toast && toast?.autoClose === undefined ? true : toast.autoClose;
  const { theme } = useThemeValue();
  const [visible, setVisible] = useState(true);

  const position = useMemo(() => (toast && toast?.position) || 'top', [toast]);

  const close = useCallback(
    (event) => {
      setVisible(false);
      if (onClose) onClose(event);
    },
    [onClose],
  );

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(
        close,
        time || theme.notification.toast.time || theme.notification.time,
      );

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [
    autoClose,
    close,
    theme.notification.toast.time,
    theme.notification.time,
    time,
  ]);

  const { icon: CloseIcon } = theme.notification.close;
  const { icon: StatusIcon, color } =
    theme.notification?.[status] || theme.notification.unknown;
  const { color: closeIconColor } = theme.notification.close;

  const kind = useMemo(() => {
    if (toast) return 'toast';
    if (global) return 'global';
    return undefined;
  }, [global, toast]);

  let direction;
  if (kind && theme.notification[kind].direction)
    direction = theme.notification[kind].direction;
  else direction = theme.notification.direction;

  let background;
  if (kind && theme.notification?.[status]?.[kind]?.background)
    background = theme.notification[status][kind].background;
  else if (theme.notification?.[status]?.background)
    background = theme.notification[status].background;
  else
    background =
      theme.notification?.[kind]?.container?.background ||
      theme.notification.container.background;

  const TextWrapper = direction === 'row' ? Text : Fragment;

  // notification is built with two child boxes that contain:
  // 1. icon + text (wrapped in button when clickable)
  // 2. close button
  // pad needs to be applied to the child boxes, but we don't want to apply
  // extra padding between the icon + text and the button.
  let pad;
  if (kind && theme.notification[kind].container.pad)
    pad = theme.notification[kind].container.pad;
  else pad = theme.notification.container.pad;
  let textPad;
  let closeButtonPad;
  if (onClose) [textPad, closeButtonPad] = adaptThemeStyle(pad, theme);
  else textPad = pad;

  let actions;
  let message = messageProp;

  const messageColor = getTextColor('message', status, kind, theme);
  const titleColor = getTextColor('title', status, kind, theme);

  if (actionsProp)
    actions = actionsProp.map((action) => (
      <Fragment key={action.label}>
        <NotificationAnchor
          // create space between first anchor and
          // text content and next anchor
          margin={{ right: 'xsmall' }}
          {...action}
          {...theme.notification.actions}
          // add a space between anchors to allow for wrapping
        />{' '}
      </Fragment>
    ));

  if (message || actions) {
    message =
      typeof message === 'string' ? (
        <Message
          {...theme.notification.message}
          color={messageColor}
          direction={direction}
        >
          <Text margin={{ right: 'xsmall' }}>{message}</Text>
          {/* include actions with message so it wraps with message */}
          {actions}
        </Message>
      ) : (
        message
      );
  }

  const iconDimension = theme.notification?.message?.size || 'medium';

  let content = (
    <Box
      {...theme.notification.container}
      {...(global ? { ...theme.notification.global.container } : {})}
      {...(toast ? { ...theme.notification.toast.container } : {})}
      background={background}
      // let internal box control pad
      pad={undefined}
      direction="row"
      gap="small"
      id={toast ? undefined : id}
      {...rest}
    >
      {/* separate from onClose button to allow "onClick" in the future and
        avoid nested interactive elements */}
      <Box direction="row" pad={textPad} flex>
        <Box {...theme.notification.iconContainer}>
          {icon || <StatusIcon color={color} height={iconDimension} />}
        </Box>
        <Box {...theme.notification.textContainer}>
          <TextWrapper>
            {title && (
              <Text {...theme.notification.title} color={titleColor}>
                {title}
              </Text>
            )}
            {message && title && direction === 'row' && <>&nbsp;</>}
            {message}
          </TextWrapper>
        </Box>
      </Box>
      {onClose && (
        // theme.notification.container and textContainer may both have pad,
        // account for both
        <Box pad={closeButtonPad}>
          <Box {...theme.notification.textContainer}>
            <Button
              icon={
                <CloseIcon
                  color={closeIconColor}
                  height={iconDimension}
                  width={iconDimension}
                />
              }
              onClick={close}
              hoverIndicator
              plain
            />
          </Box>
        </Box>
      )}
    </Box>
  );

  if (toast) {
    content = visible && (
      <Layer
        {...theme.notification.toast.layer}
        role="log"
        modal={false}
        onEsc={onClose}
        id={id}
        responsive={false}
        plain
        position={position}
      >
        {content}
      </Layer>
    );
  }

  return content;
};

Notification.displayName = 'Notification';

Notification.propTypes = NotificationType;

export { Notification };
