export const environment = {
    production: true,
    emulator: false,
    firebase: {
        apiKey: '{{ FIREBASE_API_KEY }}',
        authDomain: '{{ FIREBASE_AUTH_DOMAIN }}',
        projectId: '{{ FIREBASE_PROJECT_ID }}',
        storageBucket: '{{ FIREBASE_STORAGE_BUCKET }}',
        messagingSenderId: '{{ FIREBASE_MESSAGE_SENDER_ID }',
        appId: '{{ FIREBASE_APP_ID }}',
        measurementId: '{{ FIREBASE_MEASUREMENT_ID }}',
    },
    sendgridDomain: '{{ SENDGRID_DOMAIN }}'
};
