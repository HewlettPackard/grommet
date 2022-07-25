const POST_DECIMAL_DIGITS = 10;

export const baseUnit = 24;

export const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const arcSweepControl = (startA, endA, reverse) => {
  if (reverse) {
    return endA - startA <= 180 ? '1' : '0';
  }
  return endA - startA <= 180 ? '0' : '1';
};

export const arcCommands = (
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
  reverse,
) => {
  // handle that we can't draw a complete circle
  let normalizedEndAngle = endAngle;
  /* 
   added endAngle - startAngle >= 360 
   for SemiCircle the endAngle will never be greater then startAngle 
   since it starts with a startAngle of 270.
 */
  if (endAngle > startAngle && endAngle - startAngle >= 360) {
    normalizedEndAngle = startAngle + 359.99;
  }
  const start = polarToCartesian(centerX, centerY, radius, normalizedEndAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);

  const arcSweep = arcSweepControl(startAngle, normalizedEndAngle, reverse);
  const sweepFlag = reverse ? '1' : '0';
  const d = [
    'M',
    start.x.toFixed(POST_DECIMAL_DIGITS),
    start.y.toFixed(POST_DECIMAL_DIGITS),
    'A',
    radius.toFixed(POST_DECIMAL_DIGITS),
    radius.toFixed(POST_DECIMAL_DIGITS),
    0,
    arcSweep,
    sweepFlag,
    end.x.toFixed(POST_DECIMAL_DIGITS),
    end.y.toFixed(POST_DECIMAL_DIGITS),
  ].join(' ');
  return d;
};

/* TranslatedEngAngle will now take the value of the
startAngle + anglePer * value and mod by 360. This was added
to take account the startAngle not being 0. So no matter the
value it will be % 360 to get the correct angle. 
*/
export const translateEndAngle = (startAngle, anglePer, value, reverse) =>
  reverse
    ? 360 - (Math.max(0, startAngle + anglePer * value) % 360)
    : Math.max(0, startAngle + anglePer * value) % 360;
