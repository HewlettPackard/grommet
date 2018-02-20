## Drop
A drop container that opens next to a target.

[![](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/grommet/grommet-sandbox?initialpath=drop&module=%2Fsrc%2FDrop.js)
## Usage

```javascript
import { Drop } from 'grommet';
<Drop control={element}>...</Drop>
```

## Properties

**align**

How to align the drop with respect to the target element. Defaults to `{
  "top": "top",
  "left": "left"
}`.

```
{
  top: 
    top
    bottom,
  bottom: 
    top
    bottom,
  right: 
    left
    right,
  left: 
    left
    right
}
```

**control**

Required. Target container where the drop will be aligned.

```
object
```

**restrictFocus**

Whether the drop should control focus.

```
boolean
```

**onClickOutside**

Function that will be invoked when the user clicks outside the drop.

```
function
```

**onEsc**

Function that will be called when the user presses the escape key inside the drop.

```
function
```

**responsive**

Whether to dynamically re-place when resized. Defaults to `true`.

```
boolean
```

**theme**

Custom styles for Drop component.

```
object
```
  