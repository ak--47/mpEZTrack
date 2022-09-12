
# mpEZTrack 🏃💨

## wat? 🐠 <div  id="about"></div>

`mpEZtrack` helps you collect data from your web application as events (and users) in Mixpanel with **no code**. All you need is to  **[copy/modify/paste a `<script>` tag](#tldr)** and deploy it on your website to get up and going.

more specifically `mpEZTrack` is a javascript bundle that wraps the [mixpanel JS SDK](https://github.com/mixpanel/mixpanel-js), initializes it with [best practices](https://mixpanel.com/blog/best-practices-updated/), and adds listeners for common events like `page view`, `page exit`, `button click`, `link click`, etc... 

you can customize the behavior or your implementation by [passing options](#options) to  `mpEZTrack.init()`

the bundle is hosted in a multi-region Google Cloud Storage bucket; it is free to use.

for more information see the [options + recipes](#options) to learn about customizing your implementation. 

finally, feel free to read my thoughts on [why this tool exists](#motivation), as well as some considerations for [user profiles](#profiles), [security](#security), and [performance](#perf)
 

## tldr;  📦<div  id="tldr"></div>

include the following two `<script>` tags on any page to use `mpEZTrack`; customize the second one: 
```html
<script src="https://storage.googleapis.com/ez-track/v0.1b/eztrack.min.js"></script>
<script defer>
mpEZTrack.init("YOUR-PROJECT-TOKEN") //change me 🤗
</script>
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ⚠️ **important** ⚠️ 

change the value of `YOUR-PROJECT-TOKEN` in the above snippet to your **[mixpanel project's token](https://help.mixpanel.com/hc/en-us/articles/115004502806-Find-Project-Token-)** in the above snippet.

one deployed on your website, look in your mixpanel project; you are now collecting many useful events:

![useful events!](https://aktunes.neocities.org/manyUsefulEvents.png)

## options 🎛 <div  id="options"></div> 
you can choose to add a second `options` object to `.init()` to customize your implementation

in the table below, you will find all the options exposed by this module; if you wish to use a `default` value for any particular option, it does not need to be explicitly passed:

| option                 | expected type    | default | notes                                                       |
|------------------------|-------------------|----------|-------------------------------------------------------------|
| `token` **(required)** | `string`                | --       | expects a 32 character string |
|`debug`	| `boolean` 	| `false`	| puts the `mixpanel` SDK in debug mode                          
|`extend`	| `boolean` 	|`false`	| exposes the `mixpanel` object as a global and `EZTrack` as `mixpanel.ez`                              |
|`refresh`	| `integer` 	| `5000`	| the frequency (ms) in which the `.track()` queue will be flushed                             |
|`location`	|	 `boolean` | `true`	| use mixpanel to resolve geo-location                              |
| `superProps`           | `boolean` | `true`   | adds information about the client device to all events      |
| `pageView`            | `boolean` | `true`   | tracks all page views                                       |
| `pageExit`            | `boolean` | `false`  | attempts to track page exits with `duration` and `scroll %` |
| `links`           | `boolean` | `true`   | tracks all clicks on `<a>` elements                         
| `buttons`           | `boolean` | `true`   | tracks all clicks on `<a>` elements                         
| `forms`          | `boolean` | `true`   | track all submissions on `<form>` elements                  |
| `profiles`         | `boolean` | `true`   | creates user profiles for every unique device [(see note)](#profiles)        |
| `clicks`            | `boolean` | `false`  | tracks all clicks on any page elements                      |
| `youtube`              | `boolean` | `false`  | tracks interactions with embedded youtube videos            |


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
one of the biggest drawbacks to purely codeless analytics SDKs, is that they lose the ability to properly resolve the end-user's identity. while `mpEZTrack` will happily persist a user's identity across sessions on a single device, without a run-time signal from your app, it is not possible to identify the same user across multiple devices.

if you are using the `{ profiles : true }`  option (or the defaults), you may notice that all of your user profiles show users as `anonymous`:

![eztrack user profile](https://aktunes.neocities.org/anon.png)

this is expected behavior.

if your application can supply a **canonical unique user identifier** you can `extend` the `EZTrack` implementation and call _any_ [Mixpanel SDK methods](https://developer.mixpanel.com/docs/javascript-full-api-reference) under the `ez` namespace.

an example implementation of custom identity management might look like this:
```javascript
mpEZTrack.init('token', { extend: true});	// expose the mixpanel object
mixpanel.ez.identify(currentUser.id); 		// tell mp who the user is
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

future versions of this module may improve upon this API. please submit an idea or suggestion if you have (an idea or suggestion) about how this should work.

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

## performance 🤹 <div  id="perf"></div>
todo...

but basically, review the implementation...

## security 🔓 <div  id="security"></div>
todo...

but basically, review the fields, selectors, and attributes bound

## benchmarks 🕰<div  id="bench"></div>
todo...

but basically, the minified script, which bundles the `mixpanel` SDK is ~70KB and compresses to ~30KB

