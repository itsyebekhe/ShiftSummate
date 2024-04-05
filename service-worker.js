self.addEventListener('install', event => {
	event.waitUntil(
		caches.open('v1').then(cache => {
			cache.addAll([
                '/',
				'/index.html',
				'/styles.css',
				'/app.js',
				'/ic_launcher/android/mipmap-ldpi/ic_launcher.png',
				'/ic_launcher/android/mipmap-hdpi/ic_launcher.png',
				'/ic_launcher/android/mipmap-xhdpi/ic_launcher.png',
				'/ic_launcher/android/mipmap-xxhdpi/ic_launcher.png',
				'/ic_launcher/android/mipmap-xxxhdpi/ic_launcher.png',
				'/ic_launcher/android/ic_launcher-web.png'
			]);
		})
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(response => {
			return response || fetch(event.request);
		})
	);
});