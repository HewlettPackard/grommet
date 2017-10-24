## Select
An select-like field with optional search capability.

[![](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/grommet/grommet-site?initialpath=select&amp;module=%2Fscreens%2FSelect.js)
## Usage

```javascript
import { Select } from 'grommet';
<Select />
```

## Properties

**a11yTitle**

Custom title to be used by screen readers.

```
string
```

**activeOptionIndex**

Highlight a given option at the provided index.

```
number
```

**background**

Background color when drop is active

```
string
{
  color: string,
  opacity: 
    weak
    medium
    strong
    boolean
}
```

**children**

Function that will be called when each option is rendered.

```
function
```

**dropSize**

Size of the options container inside the Select drop.

```
string
```

**onChange**

Function that will be called when the user selects an option.

```
function
```

**onClose**

Function that will be called when the Select drop closes.

```
function
```

**onSearch**

Function that will be called when the user types in the search input.
If this property is not provided, no search field will be rendered.

```
function
```

**open**

Whether the Select drop should be open or not.

```
boolean
```

**options**

Required. Options can be either a string or an object. If an object is used, use children callback
in order to render anything based on the current item.

```
[
  string
  element
  object
]
```

**placeholder**

Placeholder text to use when no value is provided.

```
string
```

**plain**

Whether this is a plain Select input with no border or padding.

```
boolean
```

**searchPlaceholder**

Placeholder text to use in the search box when the search input is empty.

```
string
```

**value**

Currently selected value.

```
string
element
object
```
  