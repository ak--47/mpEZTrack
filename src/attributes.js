export const superProperties = {
	path: window.location.pathname, 
	pixelRatio: window.devicePixelRatio,
	pageHeight: window.innerHeight,
	pageWidth: window.innerWidth,
	pageNum : window.history.length,
	language: window.navigator.language,	
	pageTitle: document.title,
	connection: window.navigator.connection ? window.navigator.connection.effectiveType : "unknown",
	memory: window.navigator.deviceMemory ? window.navigator.deviceMemory : "unknown",
	platform : window.navigator.userAgentData ? window.navigator.userAgentData.platform : "unknown",
	mobile : window.navigator.userAgentData ? window.navigator.userAgentData.mobile : "unknown",
	$source: "ezTrack"
}