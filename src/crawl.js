const puppeteer = require('puppeteer');
const userToSearch = 'john';
const searchUrl = 'https://github.com/search?q=' + userToSearch + '&type=Users&utf8=%E2%9C%93';
const USER_LIST_INFO_SELECTOR = '.user-list-item';
const USER_LIST_USERNAME_SELECTOR = '.user-list-info>a:nth-child(1)';
const mongoose = require('mongoose');
const User = require('./model/user');


async function getNumPages(page) {
    const NUM_USER_SELECTOR = '#js-pjax-container > div.container > div > div.column.three-fourths.codesearch-results.pr-6 > div.d-flex.flex-justify-between.border-bottom.pb-3 > h3';
    let inner = await page.evaluate((sel) => {
        return document.querySelector(sel).innerHTML;
    }, NUM_USER_SELECTOR);
    // 格式是: "69,803 users"
    inner = inner.replace(',', '').replace(' users', '');
    const numUsers = parseInt(inner);
    console.log('numUsers: ', numUsers);
    /*
     * GitHub 每页显示 10 个结果
     */
    const numPages = Math.ceil(numUsers / 10);
    return numPages;
}

function upsertUser(userObj) {
    const DB_URL = 'mongodb://localhost/thal';
    if (mongoose.connection.readyState == 0) {
        mongoose.connect(DB_URL);
    }
    const conditions = {
        username: userObj.username
    };
    const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    };
    User.findOneAndUpdate(conditions, userObj, options, (err, result) => {
        if (err) {
            throw err;
        }
    });
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto(searchUrl);
    await page.waitFor(2 * 1000);
    const numPages = await getNumPages(page);
    console.log('Numpages: ', numPages);
    for (let h = 1; h <= numPages; h++) {
        // 跳转到指定页码
        await page.goto(`${searchUrl}&p=${h}`);
        // 执行爬取
        const users = await page.evaluate((sInfo, sName) => {
            return Array.prototype.slice.apply(document.querySelectorAll(sInfo))
                .map($userListItem => {
                    // 用户名
                    const username = $userListItem.querySelector(sName).innerText;
                    return {
                        username
                    };
                })
        }, USER_LIST_INFO_SELECTOR, USER_LIST_USERNAME_SELECTOR);
        users.map(({ username }) => {
            upsertUser({
                username: username,
                dateCrawled: new Date()
              });
            console.log(username);
        });
    }
})();   