import { Organization, Organizations, OrgsAPI } from '@influxdata/influxdb-client-apis';
import { webAgent } from './webAgent';
import fetch from 'node-fetch';
import { InfluxDbTopError } from './error';

export async function readAllOrganizations(influxUrl: string, token: string): Promise<Organization[]> {
    let url: string | null = influxUrl + '/api/v2/orgs';
    console.log(url);
    let organizations: Organization[] = [];
    while (url != null) {
        const response = await fetch(url, {
            agent: webAgent,
            method: 'GET',
            headers: {
                Authorization: 'Token ' + token
            }
        });
        if (!response.ok)
            throw new InfluxDbTopError(response.statusText + '\n' + await response.text());
        const responseText = await response.text();
        let data: Organizations;
        try {
            data = JSON.parse(responseText);
        } catch {
            throw new InfluxDbTopError(url + '\n' + responseText);
        }
        organizations.push(...(data.orgs || []));
        url = data.links?.next ? influxUrl + data.links.next : null;
    }
    return organizations;
}
