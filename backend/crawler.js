const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function getStateUrls(browser) {
    const page = await browser.newPage();
    const url = 'https://www.companydetails.in/';

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

        const stateUrls = await page.evaluate(() => {
            const result = [];
            const items = document.querySelectorAll('a');
            items.forEach(item => {
                const href = item.getAttribute('href');
                if (href && href.startsWith('https://www.companydetails.in/')) {
                    result.push(href);
                }
            });
            return result;
        });

        await page.close();

        const fileContent = `const stateUrl = ${JSON.stringify(stateUrls, null, 2)};\nmodule.exports = stateUrl;\n`;
        await fs.writeFile('stateUrl.js', fileContent, 'utf8');
        console.log('URLs have been written to stateUrl.js');

        return stateUrls;
    } catch (error) {
        console.error(`Error fetching state URLs: ${error}`);
        await page.close();
        throw error;
    }
}

async function getCompanyUrls(browser, stateUrl) {
    const page = await browser.newPage();

    try {
        await page.goto(stateUrl, { waitUntil: 'networkidle2', timeout: 0 });

        const companyUrls = await page.evaluate(() => {
            const result = [];
            const items = document.querySelectorAll('a.fs-6.text-uppercase');
            items.forEach(item => {
                const href = item.getAttribute('href');
                if (href) {
                    const companyUrl = 'https://www.companydetails.in' + href;
                    result.push(companyUrl);
                }
            });
            return result;
        });

        await page.close();
        return companyUrls;
    } catch (error) {
        console.error(`Error fetching company URLs for ${stateUrl}: ${error}`);
        await page.close();
        throw error;
    }
}

async function scrapeCompanyData(browser, url) {
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'load', timeout: 0 });

        const companyData = await page.evaluate(() => {
            const result = {};
            const rows = document.querySelectorAll('div.row');
            rows.forEach(row => {
                const companyLink = row.querySelector('div.col-xl-3.col-6 a');
                const companyName = row.querySelector('div.col-xl-9.col-6 h6');
                const authorisedCapitalLink = row.querySelector('div.col-xl-6.col-6 a');
                const authorisedCapitalValue = row.querySelector('div.col-xl-6.col-6 h6');
                const pincodeLink = row.querySelector('div.col-xl-4.col-6 a');
                const pincodeValue = row.querySelector('div.col-xl-8.col-6 h6');

                if (companyLink && companyName) {
                    result[companyLink.innerText.trim()]=companyName.innerText.trim() ;
                } else if (authorisedCapitalLink && authorisedCapitalValue) {
                    result[authorisedCapitalLink.innerText.trim()]=  authorisedCapitalValue.innerText.trim() || null ;
                } else if (pincodeLink && pincodeValue) {
                    result[pincodeLink.innerText.trim()]=  pincodeValue.innerText.trim() || null;
                }
            });
            return result;
        });

        await page.close();
        return companyData;
    } catch (error) {
        console.error(`Error scraping company data from ${url}: ${error}`);
        await page.close();
        throw error;
    }
}

async function scrapeAndWriteData() {
    const browser = await puppeteer.launch({
        timeout: 0, // Disable timeout for puppeteer operations
       
    });

    try {
        const stateUrls = await getStateUrls(browser);

        const batchSize = 10;
        let allCompanyUrls = [];

        // Process each state URL batch sequentially
        for (let i = 0; i < stateUrls.length; i += batchSize) {
            const batch = stateUrls.slice(i, i + batchSize);
            for (const url of batch) {
                try {
                    const companyUrls = await getCompanyUrls(browser, url);
                    allCompanyUrls = allCompanyUrls.concat(companyUrls);
                } catch (error) {
                    console.error(`Error processing company URLs for ${url}: ${error}`);
                    // Optionally retry this batch item or log and skip
                }
            }
        }

        const companyUrlsFileContent = `const companyUrl = ${JSON.stringify(allCompanyUrls, null, 2)};\nmodule.exports = companyUrl;\n`;
        await fs.writeFile('companyUrl.js', companyUrlsFileContent, 'utf8');
        console.log('Company URLs have been written to companyUrl.js');

        // Process each company URL sequentially
        let allCompanyData = [];
        for (const url of allCompanyUrls) {
            try {
                const companyData = await scrapeCompanyData(browser, url);
                console.log(companyData);
                allCompanyData.push(companyData);
            } catch (error) {
                console.error(`Error scraping company data from ${url}: ${error}`);
                // Optionally retry this company URL or log and skip
            }
        }

        const companyDataFileContent = `const companyData = ${JSON.stringify(allCompanyData, null, 2)};\nmodule.exports = companyData;\n`;
        await fs.writeFile('companyData.js', companyDataFileContent, 'utf8');
        console.log('Company data have been written to companyData.js');
    } catch (error) {
        console.error(error);
    } finally {
        await browser.close();
    }
}

scrapeAndWriteData();
