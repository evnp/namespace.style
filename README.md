The missing, well-typed link between HTML and CSS.

```
 __   __    ______    ______
/\ `./\ \  /\  ___\  /\  ___\
\ \ .`.` \ \ \___  \ \ \___  \
 \ \_\ `._\ \/\_____\ \/\_____\
  \/_/ \/_/  \/_____/  \/_____/  namespace.style
```

[![npm package](https://img.shields.io/npm/v/namespace.style.svg)](https://www.npmjs.com/package/namespace.style)

- Make element class names type-safe, typo-free, and autocompletable.
- Make debugging DOM a dream – give everything a name you can actually understand. No generated hex soup.
- Make UI code testable by default, by inherently building in element identifiers for test code with no extra work.
- Make magic-string composition utils for DOM classes a thing of your past.
- Make miles-long class-atom strings begone from your templates.
- Make the intersection of HTML and CSS something that's finally understood by your static-code-analysis tooling.

> Namespaces are one honking great idea – let's do more of those!

*– Tim Peters*

Setup
-----
```sh
npm install --save namespace.style
```

Usage
-----

A component is worth a thousand words. In this example, we'll use a Vue component paired with [Astroturf](https://github.com/astroturfcss/astroturf) for zero-runtime-cost CSS-in-JS. However, these tools are independent from NSS — it can be easily used with any frontend framework that accepts class strings on DOM elements.

```typescript
// SpecialList.tsx

import nss from "namespace.style";
import { css } from "astroturf";
import { defineComponent, computed } from "vue";

// Enums define available NSS elememt classes, and provide a "map" of component
// elements and conditional states that's useful as a reference at top of file:
enum Name {
  SpecialList,
}
enum Elem {
  Item,
}
enum Cond {
  Ordered,
  Inline,
}

export default defineComponent({
  name: nss.getName(Name), // get the component name without repetition / magic string
  props: {
    items: { type: Array, default: [] },
    ordered: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
  },
  setup(props) {
    const Tag = computed(() => props.ordered ? "ol" : "ul");
    return () => (
      <Tag.value class={n.Ordered(props.ordered).Inline(props.inline).c}>
        {props.items.map((item) => (
          <li class={n.Item.c}>{item}</li>
        ))}
      </Tag.value>
    );
  }
});

export const n = nss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond, () => {
  const Ordered = css`
    padding-left: 0.5rem;
  `;
  const Inline = css`
    display: inline;
  `;
  const Item = css``; // it's fine to leave these empty; used below within selectors
  const SpecialList = css`
    margin: 1rem;
    &${Inline} ${Item} {
      display: inline;
    }
    &:not(${Inline}) ${Item} {
      margin: 0.5rem;
    }
    @media screen and (max-width: 600px) {
      margin-left: 0;
      margin-right: 0;
    }
  `;
  // Each Astroturf var holds a unique class string which is mapped to NSS entities.
  // Type warnings will be raised if the right vars are not returned here.
  return { SpecialList, Item, Ordered, Inline };
});
```

Let's break down the anatomy of NSS usage above, piece by piece.

```typescript
import nss from "namespace.style";
import { css } from "astroturf";
import { defineComponent, computed } from "vue";
```

First we import the `nss` module as well as necessary [Astroturf](https://github.com/astroturfcss/astroturf) and Vue functions.

```typescript
// Enums define available NSS elememt classes, and provide a "map" of component
// elements and conditional states that's useful as a reference at top of file:
enum Name {
  SpecialList,
}
enum Elem {
  Item,
}
enum Cond {
  Ordered,
  Inline,
}
```
Next we define 3 enums. These are used by NSS to understand the structure of your component and CSS classes, but they also serve as an "at a glance" map of your component's UI structure.
- **Name:** This enum always contains a single member which is the name of the component. This singular name string is wrapped in an enum for typing purposes
- **Elem:** This enum contains members which correspond with sub-elements of your component, eg. `Item`s in a list, in this case.
- **Cond:** This enum contains members which correspond with conditional states your component or its sub-elements may have.

**Note:** Typescript enums provide a convenient syntax for the data above, but the same could be done with plain JS objects – NSS doesn't care and the typings work the same either way. The object equivalents would look like
```typescript
const Name = { SpecialList: true };
const Elem = { Item: true };
const Cond = { Ordered: true, Inline: true };
```
and will operate in the exact same way as the enums above.

```typescript
export default defineComponent({
  name: nss.getName(Name), // get the component name without repetition / magic string
```
Now we define our component. Vue convention is to provide the component name as a string, which we can get from the `Name` enum using NSS, keeping the value in a single location.

```typescript
  props: {
    items: { type: Array, default: [] },
    ordered: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
  },
```
These are standard Vue prop declarations.

```typescript
  setup(props) {
    const Tag = computed(() => props.ordered ? "ol" : "ul");
    return () => (
      <Tag.value class={n.Ordered(props.ordered).Inline(props.inline).c}>
        {props.items.map((item) => (
          <li class={n.item.c}>{item}</li>
        ))}
      </Tag.value>
    );
  }
});
```
This is a TSX Vue template. Within it, we have two kinds of element class declarations:
```typescript
          <li class={n.Item.c}>{item}</li>
```
For our list items, this will give them the class `"SpecialList-Item"`. The component name is used as a prefix on all NSS classes. The `.c` suffix here is necessary to convert the NSS object into the final class string that will be passed to Vue.
```typescript
      <Tag class={n.Ordered(props.ordered).Inline(props.inline).c}>
```
For our list container – the component root element – we use a more complex class declaration. This is because we want to include our two conditional classes _only_ when the corresponding props were passed to the component. `Ordered` and `Inline` are both functions which accept a boolean value, and only set a class if the value is truthy. Based on this logic, the NSS class declaration here can produce one of 4 different values depending on whether `props.ordered` and/or `props.inline` are true:
```typescript
ordered=false, inline=false  =>  "SpecialList"
ordered=true,  inline=false  =>  "SpecialList SpecialList--Ordered"
ordered=false, inline=true   =>  "SpecialList SpecialList--Inline"
ordered=true,  inline=true   =>  "SpecialList SpecialList--Ordered SpecialList--Inline"
```
This scheme allows CSS styling and test code to easily target elements only when the desired conditions are true.

```typescript
export const n = nss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond, () => {
  const Ordered = css`
    padding-left: 0.5rem;
  `;
  const Inline = css`
    display: inline;
  `;
  const Item = css``; // it's fine to leave these empty; used below within selectors
  const SpecialList = css`
    margin: 1rem;
    &${Inline} ${Item} {
      display: inline;
    }
    &:not(${Inline}) ${Item} {
      margin: 0.5rem;
    }
    @media screen and (max-width: 600px) {
      margin-left: 0;
      margin-right: 0;
    }
  `;
  // Each Astroturf var holds a unique class string which is mapped to NSS entities.
  // Type warnings will be raised if the right vars are not returned here.
  return { SpecialList, Item, Ordered, Inline };
});
```
Finally, we have our CSS-in-JS setup using [Astroturf](https://github.com/astroturfcss/astroturf). The NSS class management system can be used _without_ CSS-in-JS, in which case the NSS declaration would look much simpler:
```typescript
export const n = nss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond);
```
You'd use the `n` object in the exact same way in your template code. In this shorter case, it would probably make sense to place `const n` at the top of the file, next to the NSS enums. In the CSS-in-JS case however, it's ergonomic to place all component styles at the end of the file. `const n` is hoisted to the top in both cases, so it doesn't actually matter – you'll be able to use `n` in your templates wherever you put `const nss`.

We `export const n` here so that it can be imported in test code as a type-aware source of element selectors. The export is only necessary if you want to use NSS externally from the component though.

There are many ways to map styles to NSS elements. The function which we're passing to `nss` above is one way – [Astroturf](https://github.com/astroturfcss/astroturf) generates vars containing unique class strings within it, and we return a mapping of NSS keys to these unique class strings. Instead of a function, you could also pass a simple object mapping here, or you could just use NSS classes directly within your styles – they're extremely human-readable.

More docs are coming soon, until then please refer to NSS's extensive test cases for more usage examples:
https://github.com/evnp/namespace.style/blob/main/test/nss.test.ts

NSS also has a playground which you can use for experimentation by cloning the repository and then running an NPM command:
```sh
$ git clone git@github.com:evnp/namespace.style.git
$ cd namespace.style
$ npm run repl

> namespace.style repl
> node nss.repl.js

> const n = nss({ Hello: true }, { World: true })
undefined

> n.Hello.World.c
'Hello-World'
```

License
-------
MIT
