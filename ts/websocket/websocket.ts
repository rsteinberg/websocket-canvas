export function getWebsocketUrl(): string {
    let scheme = 'ws';

    if (document.location.protocol === 'https:') {
        scheme += 's';
    }

    return scheme + '://' + document.location.hostname + ':8081';
}
