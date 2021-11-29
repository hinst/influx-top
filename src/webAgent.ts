import http from 'http';
import https from 'https';

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });
export const webAgent = (_parsedURL: URL) => _parsedURL.protocol == 'https:' ? httpsAgent : httpAgent;
