// Mailify Service Worker
// Handles Push Notifications

self.addEventListener("install", (event) => {
    console.log("Mailify Service Worker installed.");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Mailify Service Worker activated.");
    event.waitUntil(clients.claim());
});

// Receive Push Notifications
self.addEventListener("push", (event) => {
    let data = {};

    if (event.data) {
        try {
            data = event.data.json();
        } catch {
            data = {
                title: "Mailify",
                body: event.data.text()
            };
        }
    }

    const options = {
        body: data.body || "You have a new email.",
        icon: "/icon-192.png",
        badge: "/badge.png",
        image: data.image || undefined,
        vibrate: [200, 100, 200],

        data: {
            url: data.url || "/"
        },

        actions: [
            {
                action: "open",
                title: "Open Mailify"
            },
            {
                action: "dismiss",
                title: "Dismiss"
            }
        ],

        requireInteraction: false,
        renotify: true,
        tag: data.tag || "new-email"
    };

    event.waitUntil(
        self.registration.showNotification(
            data.title || "📧 New Email",
            options
        )
    );
});

// Handle Notification Click
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    if (event.action === "dismiss") {
        return;
    }

    const url = event.notification.data.url || "/";

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then((clientList) => {

            // Focus an existing Mailify tab
            for (const client of clientList) {
                if ("focus" in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }

            // Otherwise open a new one
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

// Notification Closed
self.addEventListener("notificationclose", (event) => {
    console.log("Notification dismissed.");
});
