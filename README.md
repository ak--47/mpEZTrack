

# mpEZTrack 🏃💨

## wat? 🐠 <div  id="about"></div>

`mpEZtrack` helps you collect data from your web application as events (and users) in Mixpanel with **no code**. All you need is to  **[copy/modify/paste a `<script>` tag](#tldr)** and deploy it on your website to get up and going.

more specifically `mpEZTrack` is a javascript bundle that wraps the [mixpanel JS SDK](https://github.com/mixpanel/mixpanel-js), initializes it with [best practices](https://mixpanel.com/blog/best-practices-updated/), and adds listeners for common events like `page view`, `page exit`, `button click`, `link click`, etc... 

you can customize the behavior or your implementation by [passing options](#options) to  `mpEZTrack.init()`

the bundle is hosted in a multi-region Google Cloud Storage bucket; it is free to use.

for more information see the [options + recipes](#options) to learn about customizing your implementation. 

finally, feel free to read my thoughts on [why this tool exists](#motivation), as well as some considerations for [testing](#test), [user profiles](#profiles), [security](#security), and [performance](#perf)
 

## tldr;  📦<div  id="tldr"></div>

include the following two `<script>` tags **before the closing `</body>` HTML tag** on any page to use `mpEZTrack`.

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

## options 🎛 <div  id="options"></div> 
you can choose to add a second `options` object to `.init()` to customize your implementation

in the table below, you will find all the options exposed by this module; if you wish to use a `default` value for any particular option, it does not need to be explicitly passed:

| option                 | expected type    | default | notes                                                       |
|------------------------|-------------------|----------|-------------------------------------------------------------|
|`location`	|	 `boolean` | `true`	| use mixpanel to resolve geo-location                              |
| `superProps`           | `boolean` | `true`   | adds information about the client device to all events      |
| `pageView`            | `boolean` | `true`   | tracks all page views as `page enter`                                       |
| `pageExit`            | `boolean` | `true`  | track all pages exits as `page exit` including `duration` and `scroll %` |
| `links`           | `boolean` | `true`   | tracks all clicks on `<a>` elements as `link click`                         
| `buttons`           | `boolean` | `true`   | tracks all clicks on `<button>`-like elements as `button click`                         
| `forms`          | `boolean` | `true`   | track all submissions on `<form>` elements as `form submit`                 |
| `selectors`          | `boolean` | `true`   | track all changes to `<select>` and `<datalist>` elements as `user selection`                  |
| `profiles`         | `boolean` | `true`   | creates user profiles for every unique device [(see note)](#profiles)        |
| `inputs`          | `boolean` | `false`   | track all user generated/user entered content as `user entered text` [(see note)](#security)                 |
| `clicks`            | `boolean` | `false`  | tracks all clicks on any _other_ page elements as `page click` [(see note)](#clicks)                     |
| `youtube`              | `boolean` | `false`  | tracks interactions with embedded youtube videos [(see note)](#youtube)            |
| `window`              | `boolean` | `false`  | tracks interactions with the browser window (`resize`, `print`, etc... )             |
| `error`              | `boolean` | `false`  | tracks any javascript errors thrown             |
| `firstPage`              | `boolean` | `false`  | on each page, determine if it is the first page in the user's history (uses `localStorage`)           |
| `clipboard`              | `boolean` | `false`  | tracks interactions with the clipboard (`cut`, `copy`, `paste`)         |
|`debug`	| `boolean` 	| `false`	| puts the `mixpanel` SDK in debug mode                          
|`extend`	| `boolean` 	|`false`	| exposes the `mixpanel` object as a global and `EZTrack` as `mixpanel.ez`                              |
|`refresh`	| `integer` 	| `5000`	| the frequency (ms) in which the `.track()` queue will be flushed                             |


## `init()` recipes 🍳 <div  id="recipes"></div>

- track embedded youtube videos
```javascript
mpEZTrack.init('YOUR-PROJECT-TOKEN', {youtube: true})
```
- track all clicks (in addition to defaults)
```javascript
mpEZTrack.init('YOUR-PROJECT-TOKEN', {clicks: true})
```
- use `mixpanel` debug mode, flush queue every second, expose implementation as `mixpanel.ez` 
```javascript
mpEZTrack.init('YOUR-PROJECT-TOKEN', {debug: true, refresh: 1000, expose: true})
```

- don't set super properties or make user profiles
```javascript
mpEZTrack.init('YOUR-PROJECT-TOKEN', { superProps: false, profiles: false})
```

- the default settings for all options
```javascript
mpEZTrack.init('YOUR-PROJECT-TOKEN', { debug: false, extend: false,  refresh: 5000, location: true, superProps: true, pageView: true, pageExit: true, links: true, buttons: true, forms: true, profiles: true, clicks: false, youtube: false})
```

## a note on user profiles 👥 <div  id="profiles"></div>
one of the biggest drawbacks to purely codeless analytics SDKs, is that they lose the ability to properly resolve the end-user's identity. while `mpEZTrack` will happily persist a user's identity across sessions on a single device, without a signal (at run time) from your app, it is not possible to identify the same user across multiple devices.

if you are using the `{ profiles : true }`  option (or the defaults), you may notice that all of your user profiles show users as `anonymous`:

<img src="https://aktunes.neocities.org/anon.png" alt="ez track user profile" width=150/>

this is expected behavior.

if your application can supply a **canonical unique user identifier** you can `extend` the `EZTrack` implementation and call _any_ [Mixpanel SDK methods](https://developer.mixpanel.com/docs/javascript-full-api-reference) under the `ez` namespace. when doing this, it is recommended to turn `profiles` off... 

an example implementation of custom identity management might look like this:
```javascript
mpEZTrack.init('token', { extend: true, profiles: false });	// expose the mixpanel object
mixpanel.ez.identify(currentUser.id); 		// tell mixpanel who the user is
mixpanel.ez.track('log in');			// precision-track any events

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

future versions of this module may improve upon this API. please [submit an enhancement](https://github.com/ak--47/mpEZTrack/issues) if you have (an idea or suggestion) about how this should work.

## motivation 💬 <div  id="motivation"></div>
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
 

### who this is NOT for
- large enterprises with millions of active users
- sites with strict [`CORS` policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- SPAs that are rendered purely client-side (though i hope this will change soon)

## testing 🧪 <div id="test"></div>
you may wish to test `mpEZTrack` before putting it into production. for this reason, this repo also includes **[a chrome extension](https://github.com/ak--47/mpEZTrack/tree/main/chromeExtension)** to make that painless

### Steps to Install:

 - clone the repo: `git clone https://github.com/ak--47/mpEZTrack.git`
 - go to [chrome://extensions/](https://www.notion.so/Chrome-extension-to-link-old-gerrit-changeset-ids-in-GH-11a36b47a65a4d84882694d2a02bad0f) in your browser. Click **load unpacked** in the top left
 - point the pop-up at the directory in this repo `/mpEZTrack/chromeExtension`; you should see the extension get installed
 - click the chrome puzzle icon 🧩 (top right) to pin the extension to your start bar
 - click the extension. you will scee a screen that lets you inject `mpEZTrack` into your current tab, or into all tabs
 	- for one single tab injection: open the developer console on your current tab and type `mpEZTrack.init("your-project-token", {debug: true})` replacing  `your-project-token` with your  [mixpanel project token](https://help.mixpanel.com/hc/en-us/articles/115004502806-Find-Project-Token-)
 	- for all tab injection: plug in your token and press save; `mpEZTrack` is now streaming all of your clicks/actions on all tabs to your mixpanel project. press `reset` to turn this off
 - now preform some actions on the webpage, and you'll see the events in your console (and in your mixpanel project!)

🥳 celebrate! you just implemented `mpEZTrack` locally! 

## performance 🤹 <div  id="perf"></div>
`mpEZTrack` is served as a minified script from a multi-region GCP-hosted CDN. it also bundles the `mixpanel` Javascript SDK and is ~70KB (uncompressed) and ~30KB compressed.

all outgoing requests are implemented as **non-blocking asynchronous network calls** are therefore adds no latency to the user experience of your app. the `mixpanel` SDK will batch network requests (by default) further decreasing the network overhead.

adding `mpEZTrack` at the bottom of your HTML (before the closing `</body>` tag) helps ensure that it is parsed and interpreted _after_ all user-facing content is rendered, and therefore has **no observable impact on the user experience**.

under the hood, `mpEZTrack` attaches event listeners to DOM elements (by reference) based on the [options passed to `init()`](#options). all listeners are attached in `passive` mode, which is a [well known best-practice](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners) to prevent any interference with the end users' scrolling experience. 

please feel free to [review the selectors and fields](https://github.com/ak--47/mpEZTrack/blob/main/src/attributes.js) used to identify DOM elements in your application. you may also peak into the `mpEZTrack.domElements` property in your browser's console to see which elements `mpEZTrack` has identified as "trackable" on your application.

## embedded youtube videos 📹 <div id="youtube"></div>
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

## tracking all clicks 🐁 <div id="clicks"></div>
when tracking "every click on every element" on any webpage, in combination with some of the other options it is _possible_ to end up with 2 distinct click events in mixpanel that represent actually represent a single user click

for example, consider the following HTML, which represents a button styled by an SVG:
```html
<button class="more-info">
        <svg width="24" height="24" viewBox="0 0 24 24" class="feather feather-more-horizontal">
        </svg>
</button>
```
if the `buttons` _and_ `clicks` options were passed to `.init()`, `mpEZTrack` recognizes these as two separate elements and in certain cases a single click from a user may result in a `button click` event AND a `page click` event getting sent to Mixpanel as part of the same interaction.

`mpEZTrack` does attempt to avoid this type of collision by employing the following filters on general `click` tracking:
```javascript
let  allThings  =  this.query(ALL_SELECTOR)
.filter(node  =>  node.children.length ===  0) //most specific element (no children)
.filter(node  =>  !this.domElements.some(el  =>  el  ===  node)) //not already tracked node
.filter(node  =>  !this.domElements.some(el  =>  el.contains(node))) //not a child of already tracked node
``` 
however, i thought that this was a potentially common enough occurrence that i wanted to call it out here.

for these reasons, "tracking all clicks" with the `clicks` option is **disabled by default**.

## security 🔓 <div  id="security"></div>
many web applications may handle user-entered secrets (passwords, tokens, private keys). while all network requests are encrypted over HTTPS and mixpanel encrypts all user data in transit and at rest, **it's never a good idea to send or store secrets in plain text**

`mpEZTrack` employs the following strategies to "ignore" sensitive fields:

- *do not track* DOM elements of `<input type="password" />`
```javascript
this.query(INPUT_SELECTOR)
	.filter(node  => (node.tagName ===  'INPUT') ? (node.type ===  "password"  ?  false  :  true) :  true);
	// ^^^ not a standard password field;
```
- *guard against sensitive user input* when tracking clicks and clipboard activity on general `<input />` fields:
```javascript
export  const  ANY_TAG_FIELDS  = (ev, guard = true) => ({
"ELEM → text": guard  ?  "******"  :  ev.target.textContent ||  ev.target.value,
});
```
while this covers most common cases, it is not a silver-bullet. if your web application _frequently_ displays highly sensitive data, `mpEZTrack` (or any other auto-capture product analytics tool) is probably not appropriate for your organization.

