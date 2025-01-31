/* Create an `environment.local.ts` file in the same folder as this file.
 * Copy the contents of this file into your local one.
 * For the Firebase App Configuration
 *   - Goto console.firebase.google.com
 *   - Create a new or use an existing project
 *   - Goto Project Overview and Add a "Web App" call this as you please.
 *   - This will provide the required settings you can copy into your local environment file.
 **/

export const environment = {
    production: false,
    emulator: false,
    firebase: {
        apiKey: 'apiKey',
        authDomain: 'authDomain',
        projectId: 'projectId',
        storageBucket: 'storageBucket',
        messagingSenderId: 'messagingSenderId',
        appId: 'appId',
        measurementId: 'measurementId',
    },
    sendgridDomain: 'sendgridDomain'
};
