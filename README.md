# Bluegg MEGAnav

This is a **MEGA**nav. It is **MEGA** opinionated. We **MEGA** don't care what you think.

[Obligatory Codepen **MEGA** Demo](https://codepen.io/matthewbeta/details/KJaJLP)

## Installation

NPM that **MEGA** suckah:

```shell
npm i -D bluegg-meganav
```

Then:

```js
import meganav from "bluegg-meganav";
// with optional arguments
meganav(Nav:selector, Toggle:selector, HoverClass:string, ActiveClass:string, Hover:bool);
```

## HTML
This is **MEGA** opinionated about your HTML structure. If you want to use it you will need to **MEGA** use Nav > ul > li > a pattern. You will need to add some **MEGA** buttons for the mobile experience. Something like this:

```html
<!-- Your Main Nav Container -->
<nav class="meganav" data-meganav>
  <!-- You Hamburger Button -->
  <button type="button" aria-haspopup="true" aria-expanded="false" data-meganav-toggle>Toggle Nav</button>
  <!-- The top level menu -->
  <ul class="meganav__menu">
    <!-- An item -->
    <li class="meganav__item">
			<!-- a link -->
      <a href="/some-page" class="meganav__link" aria-haspopup="true" aria-expanded="false">Link 1</a>
			<!-- A submenu -->
      <ul class="meganav__menu meganav__menu--sub">
				<!-- A sub item for the back button - probably mobile only, hide on larger screens -->
        <li class="meganav__item meganav__item--back">
					<!-- A back button - this'll shut the submenu that we're in-->
          <button type="button" class="meganav__link meganav__link--back">&lt; Link 1</button>
        </li>
				<!-- A normal sub item -->
        <li class="meganav__item">
					<!-- A link - yay -->
          <a href="/another-page" class="meganav__link" aria-haspopup="true" aria-expanded="false">Link 1-1</a>
        </li>
      </ul>
    </li>
  </ul>
</nav>
```

Nest at infinitum. Included in the `templates` folder are a couple of **MEGA** twig templates to get you started 😇.

## Arguments

You can override some **MEGA** defaults/options by passing them in as **MEGA** args:

### Nav 
Default: `[data-meganav]`,
This is the selector for your **MEGA**nav container (uses `querySelector` under the hood)

### Toggle 
Default: `[data-meganav-toggle]`,
This is the selector for the *mobile* toggle. (e.g. Your hamburgr button) - (uses `querySelector` under the hood)

### ActiveClass
Default: `is-active`
This is the class that will be added to the links (with nested **MEGA**nav lists) when clicked

### Hover
Default: `false`
Do you want the **MEGA**nav submenus to activate on hover? Set this to **MEGA** true.

### Hover Class
Default: `is-hover`,
This is the class that will be added to the **MEGA** list itms (with nested **MEGA**nav lists) when hovered

## Accessibility
We've tried to make this as **MEGA** accessible as possible by followin the [W3 Guidance for Flyout Menus](https://www.w3.org/WAI/tutorials/menus/flyout/) as best we can. This stuff is hard, so if you notice anything glaring, or broken, please let us know and we'll do our best to fix it.
