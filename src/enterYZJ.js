const puppeteer = require('puppeteer');
const CREDS = require('../creds');
const ACCOUNTSIGNIN = 'body > div.yun-wrapper > div.ui-container-bg > div > div > div.login-padding-12 > h3 > span.login-switch.user-name';
const PHONE = '#email';
const PASSWORD = '#password';
const SIGNIN = '#log-btn';
const ADD = 'body > div.bd.c1 > div > div > div > div.main > div > div.im-sidebar.clearfix.kcmp.narrow > div.im-sidebar-title.kcmp > div.join-item > a';
const WORKCONSOLE = 'body > div.hd.top-nav.clearfix > div > div.hd-c > ul > li.top_menu_app.menu-dropdown-hover > a';
const BULLETINLOGO = 'body > div.bd.c1 > div > div.bd-main.clearfix > div > div.main > div > div.apps.apps-list.space-apps.clearfix > div:nth-child(1) > div > div:nth-child(10) > a';
const BULLETIN = '#app > div > ul > a:nth-child(1) > li';
    
(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://www.yunzhijia.com/home/?m=open&a=login');
    await page.click(ACCOUNTSIGNIN);
    await page.click(PHONE);
    await page.type(PHONE,CREDS.phone);
        
    await page.click(PASSWORD);
    await page.type(PASSWORD, CREDS.password);
    
    await page.click(SIGNIN);    
    // await page.goto('https://www.yunzhijia.com/space/c/app');
    // await page.click(WORKCONSOLE);
    // await page.click(BULLETINLOGO);
    // await page.click(BULLETIN);    
    await page.waitForNavigation();
})()
