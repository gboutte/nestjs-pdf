
import * as puppeteerBrowser from '@puppeteer/browsers';

import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import * as fs from 'node:fs';
import * as path from 'node:path';


async function fetchAndParseXML(url: string): Promise<any> {
  try {
    // Fetch XML as plain text
    const response = await axios.get(url, { responseType: 'text' });
    // Parse XML to JS object
    const result = await parseStringPromise(response.data);
    return result;
  } catch (error) {
    console.error('Error fetching or parsing XML:', error);
    throw error;
  }
}


function saveResultToFile(data: any, filePath: string): void{

  const jsonContent = JSON.stringify(data, null, 2);
  const currentPath = __dirname;
  console.log(`Current working directory: ${currentPath}`);
  const outputPath = path.join(currentPath,'output',filePath);

  fs.writeFileSync(outputPath, jsonContent, 'utf8');
  console.log(`Browser versions saved to ${outputPath}`);
}


(async () => {
  //const browserPlatform = puppeteerBrowser.detectBrowserPlatform();
  const browserPlatform = 'linux_lacros';
  const browserPlatformCapitalized = 'linux_lacros';
  //const browserPlatformCapitalized = browserPlatform.charAt(0).toUpperCase() + browserPlatform.slice(1);
  const url = 'https://commondatastorage.googleapis.com/chromium-browser-snapshots/?prefix='+browserPlatformCapitalized+'/';
  const parsed = await fetchAndParseXML(url);

  const versions = parsed['ListBucketResult']['Contents'];


  const filteredVersions = versions.map((version: any) => {
    // Key = '<browserPlatform>/123456/REVISIONS'

    const match = version['Key'][0].match(/^([a-zA-Z]+)\/(\d+)\/REVISIONS$/);

    if (!match) {
      return null; // Ignore non-matching entries
    }
    // Return an object with the browser platform and revision number
    return {
      browserPlatform: match[1],
      revision: match[2],
      key: version['Key'][0]
    };

  }). filter((version: any) => version !== null);

  saveResultToFile(filteredVersions, browserPlatform+'_browsers.json');

})().catch(console.error);