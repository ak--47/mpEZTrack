


# mpEZTrack 🏃💨

<div  id="about"></div>
## wat? 🐠

`mpEZtrack` helps you collect data from your web application as events (and users) in Mixpanel with **no code**. All you need is to  **[copy/modify/paste a `<script>` tag](#tldr)** and deploy it on your website to get up and going.

more specifically `mpEZTrack` is a javascript bundle that wraps the [mixpanel JS SDK](https://github.com/mixpanel/mixpanel-js), initializes it with [best practices](https://mixpanel.com/blog/best-practices-updated/), and adds listeners for common events like `page view`, `page exit`, `button click`, `link click`, etc... 

you can customize the behavior or your implementation by [passing options](#options) to  `mpEZTrack.init()`

the bundle is hosted in a multi-region Google Cloud Storage bucket; it is free to use.

for more information see the [options + recipes](#options) to learn about customizing your implementation. 

finally, feel free to read my thoughts on [why this tool exists](#motivation), as well as some considerations for [testing](#test), [user profiles](#profiles), [security](#security), and [performance](#perf)
 
<div  id="tldr"></div>
## tldr;  📦

you will need:
- a (free) [mixpanel account](https://mixpanel.com/register)
- a new [mixpanel project](https://help.mixpanel.com/hc/en-us/articles/115004505106-Create-and-Manage-Projects#creating-projects) 
- a website / web application you can deploy a code snippet on
 
to install, include the following two `<script>` tags **before the closing `</body>` HTML tag** on any page to use `mpEZTrack`.

 customize the second tag with your [mixpanel project token](https://help.mixpanel.com/hc/en-us/articles/115004502806-Find-Project-Token-): 
```html
<script src="https://storage.googleapis.com/ez-track/v0.1b/eztrack.min.js" type="text/javascript"></script>
<script>
mpEZTrack.init("YOUR-PROJECT-TOKEN") //change me 🤗
</script>
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ⚠️ **important** ⚠️ 

you MUST change the value of `YOUR-PROJECT-TOKEN` in the above snippet to your **[mixpanel project's token](https://help.mixpanel.com/hc/en-us/articles/115004502806-Find-Project-Token-)**

one deployed on your website, look in your mixpanel project; you are now collecting many useful events:

<img src="https://aktunes.neocities.org/manyUsefulEvents.png" alt="many useful events" width=500/>

 <div  id="options"></div> 
## options 🎛
you can choose to add a second `options` object `{}` to `.init()` to customize your implementation

in the table below, you will find all the options exposed by this module; **if you wish to use a `default` value for any particular option, it does not need to be explicitly passed**:

| option                 | expected type    | default | notes                                                       |
|------------------------|-------------------|----------|-------------------------------------------------------------|
|`refresh`  | `integer`   | `5000`  | the frequency (ms) in which the queue will be flushed (sending events to mixpanel)                             |
|`location` |  `boolean` | `true` | resolve the end-user's geo-location (country/region/state/city)                              |
| `deviceProps`           | `boolean` | `true`   | add device information (extending [mixpanel defaults](https://help.mixpanel.com/hc/en-us/articles/115004613766-Default-Properties-Collected-by-Mixpanel)) about the client device      |
| `pageView`            | `boolean` | `true`   | tracks all page views as `page enter`                                       |
| `pageExit`            | `boolean` | `true`  | track all pages exits as `page exit` including `duration` and `scroll %` |
| `links`           | `boolean` | `true`   | tracks all clicks on `<a>` elements as `link click` or `navigation click`                        
| `buttons`           | `boolean` | `true`   | tracks all clicks on `<button>`-like elements as `button click`                         
| `forms`          | `boolean` | `true`   | track all submissions on `<form>` elements as `form submit`                 |
| `selectors`          | `boolean` | `true`   | track all changes to `<select>`, `[type=radio]`, `[type=checkbox]`, and other drop-down elements as `user selection`
| `profiles`         | `boolean` | `true`   | creates user profiles for every unique device [(see note)](#profiles)        |
| `spa`	|`boolean`	| `true` | **for single page applications** where page elements are rendered dynamically [(see note)](#spa)
| -----------	| --------	| ----		| --------------------------------------	|
| `inputs`          | `boolean` | `false`   | track all `<input>` text fields as `user entered text` [(see note)](#security)                 |
| `clicks`            | `boolean` | `false`  | track all clicks on  _other_ page elements as `page click` [(see note)](#clicks)                     |
| `youtube`              | `boolean` | `false`  | track interactions with embedded youtube videos [(see note)](#youtube)            |
| `window`              | `boolean` | `false`  | track visibility of page (`page lost/regained focus`, `full screen: on/off`, `resize`, `print`, etc... )             |
| `error`              | `boolean` | `false`  | tracks any javascript errors thrown as `page error`            |
| `clipboard`              | `boolean` | `false`  | tracks interactions with the clipboard (`cut`, `copy`, `paste`)         |
| `tabs`              | `boolean` | `false`  | generate a unique tabId for each window (note: uses `sessionStorage`)|
| `firstPage`              | `boolean` | `false`  | determine if it is the first page in the user's history (note: uses `localStorage`)           |
|`debug`  | `boolean`   | `false` | puts the `mixpanel` SDK in debug mode                          
|`extend` | `boolean`   |`false`  | exposes the `mixpanel` object as a global under the namespace `mixpanel.ez`                              |


<div  id="recipes"></div>
## `init()` recipes 🍳 

- track embedded youtube videos; don't track button clicks or profiles
```javascript
mpEZTrack.init('YOUR-PROJECT-TOKEN', {youtube: true, buttons: false, profiles: false})
```
- track user input fields; also track page visibility and identify unique browsing "tabs"
```javascript
mpEZTrack.init('YOUR-PROJECT-TOKEN', {inputs: true, window: true, tabs: true})
```
- use `mixpanel` debug mode, flush queue every second, expose `mixpanel` as `mixpanel.ez` 
```javascript
mpEZTrack.init('YOUR-PROJECT-TOKEN', {debug: true, refresh: 1000, expose: true})
```
- don't set device properties or make user profiles
```javascript
mpEZTrack.init('YOUR-PROJECT-TOKEN', { deviceProps: false, profiles: false})
```
- use [spa mode](#spa) (react, angular, vue, svelte, ember, etc...) and enable "first page, first visit" tracking
```javascript
mpEZTrack.init('YOUR-PROJECT-TOKEN', { spa: true, firstPage: true})
```

- the default settings for all options
```javascript
mpEZTrack.init('YOUR-PROJECT-TOKEN', {debug: false, extend: false, refresh: 5000, location: true, superProps: true, pageView: true, pageExit: true, links: true, buttons: true, forms: true, profiles: true, selectors: true, inputs: false, clicks: false, youtube: false, window: false, clipboard: false, firstPage: false, error: false, spa: false, tabs: false})
```
<div  id="motivation"></div>
## motivation 💬 
there are [many opinions](https://mixpanel.com/blog/codeless-analytics-problems/) on the `auto-capture` v.s. `precision tracking` debate; there are (valid) pros and cons to both sides, and i've had the "do-we-collect-everything-automatically-and-tag-it-later?" or "do-we-explicitly-tag-and-try-not-to-miss-anything?" conversation _many_ times in my career. having that conversation is (in part) what led me to make this.

my ultimate conclusion on the topic is this:

> Regardless of your organization's chosen data collection strategy, **someone** is going to have to **manage the schema**.  **Someone** is going to need to define **what the events and props mean**. And _ideally_ it's not just one person who holds that knowledge... 
> 
> Data must be organized in order to be leveraged. And if **everyone can participate in the taxonomy** then **everyone who needs the data has _some_ familiarity with it**.

this utility aims to find a middle ground between two opposing camps. it removes some of the "gatekeeping" in event-driven analytics, and allows for non-technical users to work through a useful taxonomy in a GUI, using [Mixpanel's governance tools](https://help.mixpanel.com/hc/en-us/articles/360001307806-Lexicon-Overview). It's not _precision tracking_ ... but it's also not _auto-capture_ ... it's `mpEZTrack` 🥳

### what this is
 - a quick way to add mixpanel to a web app without writing code
 - a tool for non-engineers to get high fidelity, actionable behavioral data, ready for analysis
 - a templated and wrapped implementation for the [mixpanel-js SDK](https://github.com/mixpanel/mixpanel-js), that will work on most websites + browsers

### who this is for
- anyone who needs "lite" event tracking on their web application
- anyone who want to run a simple proof-of-concept on mixpanel with minimal development effort

### what this IS NOT
- a substitute for [a tracking plan](https://help.mixpanel.com/hc/en-us/articles/115004519886-Creating-a-Tracking-Plan)
- a full implementation of mixpanel, uniquely configured for specific KPIs and business goals
 
### who this IS NOT for
- large enterprises with millions of active users
- sites with strict [`CORS` policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- experimental web applications that do not use standard HTML elements and attributes to construct UIs

<div id="test"></div>
## testing 🧪 
you may wish to test `mpEZTrack` before putting it into production. 

for this reason, this repo also includes **[a chrome extension](https://github.com/ak--47/mpEZTrack/tree/main/chromeExtension)** to make it painless and fun to test an `mpEZTrack` implementation

### Steps to Install:

 - clone the repo: `git clone https://github.com/ak--47/mpEZTrack.git` or **[download and extract this zip archive](https://github.com/ak--47/mpEZTrack/releases/download/chromeExtension/mpEZTrack.chromeExt.zip)**
 - go to [chrome://extensions/](chrome://extensions/) in your browser. 
 - turn on developer mode (top right)
 <img src="https://aktunes.neocities.org/ezTrack/dev_mode.png" />
 - Click **load unpacked** in the top left
 <img src="https://aktunes.neocities.org/ezTrack/load_unpacked.png" />
 - point the folder-picker pop-up at the directory in this repo `/mpEZTrack/chromeExtension` (or the extracted contents of the [zip archive](https://github.com/ak--47/mpEZTrack/releases/download/chromeExtension/mpEZTrack.chromeExt.zip)); you'll see the extension was installed
 <img src="https://aktunes.neocities.org/ezTrack/extInstalled.png" />
 - click the chrome puzzle icon 🧩 (top right) to pin the extension to your start bar
 <img src="https://aktunes.neocities.org/ezTrack/pinToBrowser.png" />
 - click the extension. you will scee a screen that lets you inject `mpEZTrack` into your **current tab**, or into **all tabs**

<img src="https://aktunes.neocities.org/ezTrack/extUi.png" />

- **for one single tab injection**: open the developer console on your current tab and type `mpEZTrack.init("your-project-token", {debug: true})` replacing  `your-project-token` with your  [mixpanel project token](https://help.mixpanel.com/hc/en-us/articles/115004502806-Find-Project-Token-)
	  
- **for all tab injection**: plug in your token and press save; `mpEZTrack` is now streaming all of your clicks/actions on all tabs to your mixpanel project. the icon has turned into a ⚠️ to let you know. press `reset` to turn this off

 - now preform some actions on the webpage, and you'll see the events in your console (and in your mixpanel project!)

<img src="https://aktunes.neocities.org/ezTrack/see%20props%20in%20console.png" />

🥳 celebrate! you just implemented `mpEZTrack` locally! 

<div id="spa"></div>
## single page applications (SPAs) 🧖 
`mpEZTrack` queries the DOM _once_ for trackable elements when the page is fully loaded. this is not feasible for client-rendered single page applications (SPAs) like react, vue, angular, etc... which construct the DOM reactively, as an end-user navigates through an application.

by default, `mpEZTrack`  uses **`{ spa : true} `** in order to track UI elements which are constructed _after_ the page has fully loaded.

in **SPA mode**, `mpEZTrack` will listen to _all page clicks_ and preform introspection to conclude which element on the page was clicked:

```javascript
function singlePageAppTracking(mp, opts) {
	window.addEventListener("click", (ev) => {
	introspectElement(ev.target, ev, mp, opts);
}
```

if that element is "trackable" based on [your configuration](#options), `mpEZTrack` will send an event to mixpanel.

SPA mode is an appropriate choice for any apps which construct their UI components _dynamically_; since many web apps will do this, it is enabled by default.

if you wish to turn this off, you can:

```javascript
mpEZTrack.init('YOUR-PROJECT-TOKEN', {spa: false})
```

<div  id="profiles"></div>
## user profiles 👥 
one of the biggest drawbacks to purely codeless analytics SDKs, is that they lose the ability to properly resolve the end-user's identity. while `mpEZTrack` will happily persist a user's identity across sessions on a single device, without a signal (at run time) from your app, it is not possible to identify the same user across multiple devices.

if you are using the `{ profiles : true }`  option (or the defaults), you may notice that all of your user profiles show users as `anonymous`:

<img src="https://aktunes.neocities.org/anon.png" alt="ez track user profile" width=150/>

this is **expected behavior**.

if your application can supply a **canonical unique user identifier** you can `extend` the `EZTrack` implementation and call _any_ [Mixpanel SDK methods](https://developer.mixpanel.com/docs/javascript-full-api-reference) under the `mixpanel.ez` namespace. when doing this, it is recommended to turn `profiles` off... 

an example implementation of custom identity management might look like this:
```javascript
mpEZTrack.init('project-token', { extend: true, profiles: false }); // expose the mixpanel object
mixpanel.ez.identify(currentUser.id);    // tell mixpanel who the user is
mixpanel.ez.track('log in');      		// precision-track any events

//set any other props on the user
mixpanel.ez.people.set({$name: currentUser.name, $email: currentUser.name, plan: currentUser.planType})
```

where `currentUser` has the following shape:

```javascript
{ 
  id: "3cd1e0f8-2366-42d7-b302-3c70f827fd51",
  name: "AK",
  email: "ak@notmixpanel.com",
  plan: "blue"
}
```
when using the `{extend: true}` configuration, `mpEZTrack` will also broadcast a `mpEZTrackLoaded` event on the window; this makes it possible to "listen" for completion of the library's `init()` method in other script files:

```javascript
// analytics.js
mpEZTrack.init('project-token', { extend: true });


// someOtherFile.js
window.addEvenetListener('mpEZTrackLoaded', ()=>{
	// mixpanel.ez is always available in this scope
	mixpanel.ez.people.set({$name: currentUser.name})
})
```

future versions of this module may improve upon this API. please [submit an enhancement](https://github.com/ak--47/mpEZTrack/issues) if you have (an idea or suggestion) about how this should work.

<div id="youtube"></div>
## embedded youtube videos 📹 
youtube makes it possible (through an [officially supported iframe API](https://developers.google.com/youtube/iframe_api_reference)) to track video play actions on videos you embed within your web application using youtube's generated embed code:

<img src="https://aktunes.neocities.org/yotube.png"  alt="ez track user profile" width=300/>

in order to "enable" video tracking, the `src` attribute of each embedded video [must have a URL parameter of `enablejsapi=1`](https://developers.google.com/youtube/iframe_api_reference#Examples):
```html
<iframe id="existing-iframe-example" src="https://www.youtube.com/embed/V9rPJ-kBb5s?enablejsapi=1"></iframe>
```
if you **do not include an `enablejsapi=1`** URL param on your video embed _and_ you **enable `{ youtube: true }`** when calling `mpEZTrack.init()`, `mpEZTrack` will **automatically enable the `enablejsapi` parameter on all embedded videos on your page**. when this occurs, you may see a small "flicker" on the video player as the content is reloaded. 

this is expected behavior, and if you don't wish to see it, add `?enablejsapi=1` to the `src` param of your videos.

`mpEZTrack` will send the following events for embedded youtube videos:

 - `youtube player load`
 - `youtube video play`
 - `youtube video pause`
 - `youtube video finish`

these video events will contain event properties which describe the video being played, as well as the "watch time":
```
'VIDEO → quality': STRING
'VIDEO → length (sec)': NUMBER
'VIDEO → ellapsed (sec)': NUMBER
'VIDEO → url': URL
'VIDEO → title': STRING
'VIDEO → id': STRING
'VIDEO → author': STRING
"VIDEO → fullscreen": BOOL
```

<div id="clicks"></div>
## tracking all clicks 🐁 
when tracking "every click on every element" on any webpage, in combination with some of the other options it is _possible_ to end up with 2 distinct click events in mixpanel that represent actually represent a single user click

for example, consider the following HTML, which represents an invisible button styled by an SVG:
```html
<button class="more-info">
        <svg width="24" height="24" viewBox="0 0 24 24" class="feather feather-more-horizontal">
        </svg>
</button>
```
if the `buttons` _and_ `clicks` options were passed to `.init()`, `mpEZTrack` recognizes these as two separate elements and in certain cases a single click from a user may result in a `button click` event AND a `page click` event getting sent to Mixpanel as part of the same interaction.

`mpEZTrack`  attempt to avoid such collisions by employing the following filters on general `click` tracking:
```javascript
let  allThings  =  this.query(ALL_SELECTOR)
.filter(node  =>  node.children.length ===  0) //most specific element (no children)
.filter(node  =>  !this.domElements.some(el  =>  el  ===  node)) //not already tracked node
.filter(node  =>  !this.domElements.some(el  =>  el.contains(node))) //not a child of already tracked node
``` 
the above-mention HTML catches the `<svg>` inside a  `<button>` case, which would _not_ result in duplicated click events, however, since it is not feasible to anticipate all possible combinations of the DOM's structure in every application, it seems prudent to explicitly state this limitation.

if you find that `mpEZTrack` is double-tracking certain elements on your page, please [submit an enhancement request](https://github.com/ak--47/mpEZTrack/issues) and include a URL to the page in question, as well as the element(s) you observe such behavior on.

for these reasons, "tracking all clicks" with the `clicks` option is **disabled by default**.

<div  id="perf"></div>
## performance 🤹 
`mpEZTrack` is served as a minified script from a multi-region GCP-hosted CDN. it also bundles the `mixpanel` Javascript SDK and is ~70KB (uncompressed) and ~30KB compressed.

all outgoing requests are implemented as **non-blocking asynchronous network calls** are therefore adds no latency to the user experience of your app. the `mixpanel` SDK will batch network requests (by default) further decreasing the network overhead.

adding `mpEZTrack` at the bottom of your HTML (before the closing `</body>` tag) helps ensure that it is parsed and interpreted _after_ all user-facing content is rendered, and therefore has **no observable impact on the user experience**.

under the hood, `mpEZTrack` attaches event listeners to DOM elements (by reference) based on the [options passed to `init()`](#options). all listeners are attached in `passive` mode, which is a [well known best-practice](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners) to prevent any interference with the end users' scrolling experience. 

please feel free to [review the selectors and fields](https://github.com/ak--47/mpEZTrack/blob/main/src/attributes.js) used to identify DOM elements in your application. you may also peak into the `mpEZTrack.domElements` property in your browser's console to see which elements `mpEZTrack` has identified as "trackable" on your application.

<div  id="security"></div>
## security + sensitive fields 🔓 
many web applications may handle user-entered secrets (passwords, tokens, private keys, etc...). while all network requests made by `mixpanel-js` are encrypted in transit and at rest, **it's never a good idea to send or store secrets in plain text**

`mpEZTrack` employs several strategies to "detect and ignore" sensitive fields:

- *do not track* (blacklist) DOM elements of selectors matching `<input type="password" />` and other well-known sensitive fields:
```javascript
const BLACKLIST_ELEMENTS  =  `*[type="password"], *[type="hidden"], *.sensitive, *.pendo-ignore, *[data-heap-redact-text], *[data-heap-redact-attributes]`;
```
- *redact clipboard text* when tracking clipboard activity:
```javascript
const  CLIPBOARD_TEXT  = (ev, guard = true) => ({
"ELEM → text": guard  ?  "******"  :  ev.target.textContent ||  ev.target.value,
});
```
- *redact fields where values appear to be sensitive data* such as credit card numbers or social security numbers:
```javascript
const  INPUT_TEXT_FIELDS  = (el) => 
({ "CONTENT → user content": isSensitiveData(el.value) ?  "******"  :  el.value })
```
- *do not* collect HTML attributes *that include `passw`*
```javascript
if (HTMLAttr?.toLowerCase()?.includes('passw')) continue loopAttributes;
```

this library is open source so you are free to review the [attribute selectors & sensitive data classifications](https://github.com/ak--47/mpEZTrack/blob/main/src/attributes.js) to feel confident that all cases are covered. if you have a concern in this area, please [submit an issue](https://github.com/ak--47/mpEZTrack/issues).

while these heuristics are appropriate for most applications,  if your web application _frequently_ displays highly sensitive data in non-standard ways, `mpEZTrack`, or any other auto-capture analytics tools, are probably not viable for your product.

