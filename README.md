# mpEZTrack 🏃💨

## wat? 🐠 <div  id="about"></div>

`mpEZtrack` helps you collect data from your web application as events (and users) in Mixpanel with no code. All you need is **[a single `<script>` tag](#tldr)**, deployed on your website to get up and going.

More specifically `mpEZTrack` is a hosted API that generates a "templated Mixpanel implementation" for web applications. It does this by wrapping the [mixpanel snippet](https://developer.mixpanel.com/docs/javascript-quickstart#installation-option-2-html), initializes it with [best practices](https://mixpanel.com/blog/best-practices-updated/), and adds listeners for common events like `page view`, `page exit`, `button click`, `link click`, etc... 

the "template" delivered to your end-users is configurable by [passing options](#options) as query string params within the `<script>`'s `src` attribute.

the service is hosted (and free to use) in a Google Cloud Function.

for more information see the [options + recipes](#options) to learn about customizing your implementation. 

finally, feel free to read my thoughts on [why this tool exists](#motivation), as well as some considerations for [security](#security) and [performance](#perf)
 

## tldr;  📦<div  id="tldr"></div>

include the following `<script>` tag on any page you wish to add Mixpanel to: 
```html
<script src="https://us-central1-ak-internal-tool-1613096051700.cloudfunctions.net/mp-ez-track?token=YOUR-PROJECT-TOKEN"></script>
```
 ⚠️ **important** ⚠️ change the value of `YOUR-PROJECT-TOKEN` to your **[mixpanel project's token](https://help.mixpanel.com/hc/en-us/articles/115004502806-Find-Project-Token-)** in the above snippet.

one deployed, look in your mixpanel project; you are now collecting many useful events:

![useful events!](https://aktunes.neocities.org/manyUsefulEvents.png)

curious about how this is possible? feel free to peak at the implementation for yourself:

```bash
$ curl --request GET \
  --url 'https://us-central1-ak-internal-tool-1613096051700.cloudfunctions.net/mp-ez-track?token=12345678123456781234567812345678&minify=false&superProps=false'
```

## options 🎛 <div  id="options"></div> 
the API of `mpEZTrack` uses [query string parameters](https://en.wikipedia.org/wiki/Query_string) to deliver different "implementation" templates based on your given configuration.

the general format of query parameters is:
```
https://myUrl?keyA=valueForA&keyB=valueForB
```
where  

 -  **`?`** signifies the **beginning** of a query string
 - **`=`** divides a `key` from it's `value` 
 - subsequent key:value paris  are chained together with an **`&`**

in the example above, `keyA` is an _option_ and `valueForA` is the _value_ for _that_ option

in the table below, you will find all the options provided by this module; if you wish to use a `default` value for any particular option, it does not need to be explicitly passed into the query string:

| option         | required? | expected value    | default | notes                                                       |
|----------------|-----------|-------------------|----------|-------------------------------------------------------------|
| `token`        | ✅         | --                | --       | expects a 32 character string                               |
| `superProps`   | ❌         | `true` or `false` | `true`   | adds information about the client device to all events      |
| `pageViews`    | ❌         | `true` or `false` | `true`   | tracks all page views                                       |
| `pageExits`    | ❌         | `true` or `false` | `false`  | attempts to track page exits with `duration` and `scroll %` |
| `linkClicks`   | ❌         | `true` or `false` | `true`   | tracks all clicks on `<a>` elements                         |
| `formSubmits`  | ❌         | `true` or `false` | `true`   | track all submissions on `<form>` elements                  |
| `userProfiles` | ❌         | `true` or `false` | `true`   | creates (anon) user profiles for every unique device        |
| `allClicks`    | ❌         | `true` or `false` | `false`  | tracks all clicks on any page elements                      |
| `youtube`      | ❌         | `true` or `false` | `false`  | tracks interactions with embedded youtube videos            |
| `debug`        | ❌         | `true` or `false` | `false`  | puts the `mixpanel` SDK in debug mode                       |
| `minify`       | ❌         | `true` or `false` | `true`   | optimizes the bundle for speed                              |
| `logErrors`    | ❌         | `true` or `false` | `false`  | logs tracking errors to the client console                  |



## recipes 🍳 <div  id="recipes"></div>

- track page exits
```html
<script src="https://us-central1-ak-internal-tool-1613096051700.cloudfunctions.net/mp-ez-track?token=YOUR-PROJECT-TOKEN&pageExits=true"></script>
```
- don't set super properties
```html
<script src="https://us-central1-ak-internal-tool-1613096051700.cloudfunctions.net/mp-ez-track?token=YOUR-PROJECT-TOKEN&superProps=false"></script>
```

 - don't track page views, form submissions, or create user profiles
```html
<script src="https://us-central1-ak-internal-tool-1613096051700.cloudfunctions.net/mp-ez-track?token=YOUR-PROJECT-TOKEN&pageViews=false&formSubmits=false&userProfiles=false"></script>
```

 - don't minify the payload; put everything in debug mode and log all errors to the console (client side)
```html
<script src="https://us-central1-ak-internal-tool-1613096051700.cloudfunctions.net/mp-ez-track?token=YOUR-PROJECT-TOKEN&debug=true&minify=false&logErrors=true"></script>
```

- the default settings for all options
```html
<script src="https://us-central1-ak-internal-tool-1613096051700.cloudfunctions.net/mp-ez-track?token=YOUR-PROJECT-TOKEN&superPros=true&pageViews=true&pageExists=false&linkClicks=true&formSubmits=true&userProfiles=true&allClicks=false&youtube=true&debug=false&minify=true&logErrors=false"></script>
```

## motivation 💬 <div  id="motivation"></div>
there are [many opinions](https://mixpanel.com/blog/codeless-analytics-problems/) on the `auto-capture` v.s. `precision tracking` debate; there are (valid) pros and cons to both sides, and i've had the "do-we-collect-everything-automatically-and-tag-it-later?" or "do-we-explicitly-tag-and-try-not-to-miss-anything?" conversation _many_ times in my career.

my ultimate conclusion on the topic is this:

> Regardless of your organization's chosen data collection strategy, **someone** is going to have to **manage the schema**. All data needs to be organized in order to be leveraged. Ideally, **everyone can participate in the taxonomy** so that **everyone who needs the data has _some_ familiarity with it**.

this utility aims to find a middle ground between two opposing camps. it removes some of the "gatekeeping" in event-driven analytics, and allows for non-technical users to work through a useful taxonomy in a GUI, using [Mixpanel's governance tools](https://help.mixpanel.com/hc/en-us/articles/360001307806-Lexicon-Overview). It's not _precision tracking_ ... but it's also not _auto-capture_


### what this is

 - a quick way to add mixpanel to a web app without writing code
 - prooves the thesis that -  with a few lines of code -  you can get high fidelity, actionable data ready for analysis

### who this is for
- non-engineers who wish to add "lite" event tracking to their web application
- people who want to run a simple proof-of-concept on mixpanel with minimal development effort

### what this IS NOT
- a substitute for [a tracking plan](https://help.mixpanel.com/hc/en-us/articles/115004519886-Creating-a-Tracking-Plan)
- a full implementation of mixpanel, uniquely configured for your business goals
 

### who this is NOT for
- large enterprises with millions of active users
- apps which deal with highly sensitive information (private keys, SSNs, etc...)

## performance 🤹 <div  id="perf"></div>
todo...

but basically:
```bash
$ curl --request GET \
  --url 'https://us-central1-ak-internal-tool-1613096051700.cloudfunctions.net/mp-ez-track?token=12345678123456781234567812345678&minify=false'
```
can you live with that?
## security 🔓 <div  id="security"></div>
todo...

but basically:
```bash
$ curl --request GET \
  --url 'https://us-central1-ak-internal-tool-1613096051700.cloudfunctions.net/mp-ez-track?token=12345678123456781234567812345678&minify=false'
```
can you live with that?

## benchmarks 🕰<div  id="bench"></div>
todo...

but basically:
```bash
$ curl --request GET \
  --url 'https://us-central1-ak-internal-tool-1613096051700.cloudfunctions.net/mp-ez-track?token=12345678123456781234567812345678&minify=false'
```
can you live with that?