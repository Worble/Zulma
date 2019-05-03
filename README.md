# Zulma

## Contents

- [Zulma](#zulma)
  - [Contents](#contents)
  - [Installation](#installation)
  - [Options](#options)
    - [Pagination](#pagination)
    - [Taxonomies](#taxonomies)
    - [Menu Links](#menu-links)
    - [Brand](#brand)
    - [Search](#search)
    - [Title](#title)
  - [Original](#original)

## Installation
First download this theme to your `themes` directory:

```bash
$ cd themes
$ git clone {GITHUB_LINK}
```
and then enable it in your `config.toml`:

```toml
theme = "zulma"
```

That's it! No more configuration should be required, however keep reading to see what options you can set for more customizability.

## Options

### Pagination
Zulma makes no assumptions about your project. You can freely paginate your content folder or your taxonomies and it will adapt accordingly. For example, editing or creating section (`content/_index.md`) and setting pagination:
```toml
paginate_by = 5
```
This is handled internally, no input is needed from the user.

### Taxonomies
Zulma has 3 taxonomies already set internally: `tags`, `cateogories` and `authors`. Setting of any these three in your config.toml like so:

```toml
taxonomies = [
    {name = "categories"},
    {name = "tags", paginate_by = 5, rss = true},
    {name = "authors", rss = true},
]
```

and setting any of them in a content file:

```toml
[taxonomies]
categories = ["Hello world"]
tags = ["rust", "ssg", "other", "test"]
authors = ["Joe Bloggs"]
```

will cause that metadata to appear on the post, either on the header for the name, or at the bottom for tags and categories, and enable those pages.

Making your own taxonomies is also designed to be as easy as possible, however it does seem to require adding files directly to the theme (someone please let me know if this isn't the case!). First, add it to your cargo.tml

```toml
taxonomies = [
    {name = "links"},
]
```

and make the corrosponding folder in the theme templates, in this case: `themes\zulma\templates\links`, and the necessary files: `themes\zulma\templates\links\list.html` and `themes\zulma\templates\links\single.html`

And then for each, just inherit the master page, render the block `content`, and set a variable called `title` for the hero to display on that page.

In `list.html`:
```handlebars
{% extends "taxonomy_list.html" %}

{% block content %}
{% set title = "All Links"%}
{{ super() }}
{% endblock content %}
```

In `single.html`:
```handlebars
{% extends "taxonomy_single.html" %}

{% block content %}
{% set title = "Link: " ~ term.name %}
{{ super() }}
{% endblock content %}
```

### Menu Links
In extra, setting `zulma_menu` with a list of items will cause them to render to the top menu bar. It has two paramers, `url` and `name`. These *must* be set. If you put $BASE_URL in a url, it will automatically be replaced by the actual site URL. This is the easiest way to allow users to navigate to your taxonomies:

```toml
[extra]
zulma_menu = [
    {url = "$BASE_URL/categories", name = "Categories"},
    {url = "$BASE_URL/tags", name = "Tags"},
    {url = "$BASE_URL/authors", name = "Authors"}
]
```

On mobile, a dropdown burger is rendered using javascript. If the page detects javascript is disabled on the clients machine, it will gracefully degrade to always showing the menu (which isn't pretty, but keeps the site functional).

### Brand
In extra, setting `zulma_brand` will cause a brand image to display in the upper left of the top menu bar. This link will always lead back to the homepage. It has two parameters, `image`(optional) and `text`(required). `image` will set the brand to an image at the location specified, and `text` will provide the alt text for this image. If you put $BASE_URL in a url, it will automatically be replaced by the actual site URL. If `image` is not set, the brand will simply be the text specified.

```toml
[extra]
zulma_brand = {image = "$BASE_URL/images/bulma.png", text = "Home"}
```

### Search
Zulma provides search built in. So long as `build_search_index` is set to `true` in `config.toml` then a search input will appear on the top navigation bar. This requires javascript to be enabled to function; if the page detects javascript is disabled on the clients machine, it will hide itself.

The search is shamefully stolen from [Zola's site](https://github.com/getzola/zola/blob/master/docs/static/search.js). Thanks, Vincent!

### Title
In extra, setting `zulma_title` will set a hero banner on the index page to appear with that title inside.

```toml
[extra]
zulma_title = "Blog"
```

If you want to get fancy with it, you can set an image behind using sass like so:
```scss
.index .hero-body {
    background-image: url(https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Plum_trees_Kitano_Tenmangu.jpg/1200px-Plum_trees_Kitano_Tenmangu.jpg);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: rgba(0, 0, 0, 0.6);
    background-blend-mode: overlay;
}
```
This will set the image behind the hero, and darken it so the main text can still be easily read.

### Theming
In extra, setting `zulma_theme` to a valid value will change the current colour scheme to that one. All themes were taken from [Bulmaswatch](https://jenil.github.io/bulmaswatch/). Valid theme values are:

- default
- darkly
- flatly
- pulse
- simplex

Choosing no theme will set default as the theme. Setting an invalid theme value will cause the site to render improperly.

```toml
[extra]
zulma_theme = "darkly"
```

## Original
This template is based on the [blog template](https://dansup.github.io/bulma-templates/templates/blog.html) over at [Free Bulma Templates](https://dansup.github.io/bulma-templates/). The code behind from adapted from the [after-dark](https://github.com/getzola/after-dark/blob/master/README.md) zola template.