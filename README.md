# Portfolio

My personal site, live at [agauthier.ca](https://agauthier.ca/). It shows my projects, my background and my web design offer. The site itself is in French.

A single page built with HTML, CSS and JavaScript, with Bootstrap 5. No framework.

## Features

**Two modes.** The site speaks to two audiences, recruiters and businesses that want a website. A pill switch at the top of the page changes the content based on the choice. A link can also preselect the mode with `?pour=recruteur` or `?pour=site`, and the choice is kept for the session (`assets/js/mode.js`, `assets/js/pill-switch.js`).

**Effects.** The portrait and the logos are pulled toward the cursor, and a caption follows the mouse over project images. Each effect stands on its own. Without its script, the element stays in place and the caption shows under the image (`assets/js/effects/`, `style/effects.css`).

**Loading.** The demo video only downloads when it gets close to the screen. The PDF mockup and pdf.js only load when you reach that section. Fonts and icons don't block rendering.

**Reduced motion.** If the visitor has this setting on, scrolling is not animated and the video doesn't start on its own.

## Structure

```
portfolio2/
├── index.html             the page
├── style/
│   ├── style.css          layout and site styles
│   └── effects.css        styles for the effects
└── assets/
    ├── js/
    │   ├── mode.js        recruiter or client mode
    │   ├── pill-switch.js pill switch interface
    │   ├── index.js       video, shortcut to the projects
    │   ├── pdf-viewer.js  viewer for the PDF mockup
    │   └── effects/       standalone effects
    └── img/ icons/ video/ pdf/
```

## Credits

The animated gradient at the top of the page comes from Stripe's WebGL code (`assets/js/Gradient.js`). The PDF viewer uses [pdf.js](https://mozilla.github.io/pdf.js/).

## Use of AI

I work with [Claude Code](https://claude.com/claude-code) on this site. The PDF viewer was mostly written by it. For the rest, I decide what gets built and I review the code before keeping it.
