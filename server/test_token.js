var http = require("http")

const keycloakHost = 'keycloak';
const keycloakPort = '8080';
const realmName = 'master';
const keycloakKeyPath = '/auth/realms/master/protocol/openid-connect/userinfo';

http.get({
    hostname: `${keycloakHost}`,
    port: `${keycloakPort}`,
    path: `${keycloakKeyPath}`,
    agent: false,  // Create a new agent just for this one request
    headers: {
        Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0ODZkblNwQ2h0TlkwUGE1clNCdXdaSzY3WFp5MGpzZEh6VWpQN1EweVlVIn0.eyJleHAiOjE2MTk3ODY2NjAsImlhdCI6MTYxOTcwMDI2MCwiYXV0aF90aW1lIjoxNjE5Njk2NTIwLCJqdGkiOiI2NmE3YmEwYS1iN2U1LTQ4NDItODkwZC02YmU2YTM1NDc5MjMiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvbWFzdGVyIiwiYXVkIjpbIm1hc3Rlci1yZWFsbSIsImFjY291bnQiXSwic3ViIjoiNzU4YzA5NWQtZGM4MC00Y2FkLTliYTctOTMwZjJlN2Y5NTYyIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibWVhbi1hcHAtbG9jYWwiLCJub25jZSI6ImU3ZTkxMzU0LTdlODItNGZkMy04NDg1LWY3YTJlMGQ1YTc5NyIsInNlc3Npb25fc3RhdGUiOiJkNjZiOWM5NC04M2EwLTRhYmYtYWJhYS04YTY3ZDMwNDAzNjEiLCJhY3IiOiIwIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiY3JlYXRlLXJlYWxtIiwib2ZmbGluZV9hY2Nlc3MiLCJhZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsibWFzdGVyLXJlYWxtIjp7InJvbGVzIjpbInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwidmlldy1yZWFsbSIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiJ9.r0tj4lkLxwS7581Z7F4lLEoJ9fPJi7b336wYbMqmrxPjjuh81rN1WgSZq5BRhRjeFhhpTaw_1XqDJZcCyHRY8NkTmADReX01LGmTwPgJ6KrJyPV4gJqXpBO93-kEYBw5FADsSFfUjksnCTgu0-dxB8dZIxKE1iQUQy_874tzkkwRWy_zl6a2tCiCtMp70MP2Bhr7MSORmYXQxxKHNXZZXWY4XHrkPeVHMIAvtw-CpKeXrx7J3fu1kEEdMKxmtV5IvNzyyiuAj0ZLcMmASP4kW4Tx4npIX8DOLS_N0xRdk6HJNDPDU4TwtuqNIAplUalBeogi7OOlZTAVismdWaW_kQ'
    }
    }, (response) => {

    let data = '';

    // a data chunk has been received.
    response.on('data', (chunk) => {
       data += chunk;
    });

    // complete response has been received.
    response.on('end', () => {
        console.log('data: ' + data);
        console.log('JSON: ' + JSON.parse(data).keys);
    });

    if (response.statusCode !== 200) {
        console.log("Response code: " + response.statusCode);
    } else {
        console.log("Success!")
    }
    }).on("error", (err) => {
        console.log("Error uh oh: " + err.message);
    });    