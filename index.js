
let SPIDER_FLAG = [
    'baiduspider',
    '360spider',
    'bytespider',
    'toutiaospider',
    'yodaobot',
    'googlebot',
    'teoma',
    'msnbot',
    'gigabot',
    'sogou web spider',
    'sogou inst spider',
    'sogou spider',
    'semrushbot',
    'applebot',
    'yisouspider',
    'serpstatbot', // https://serpstatbot.com/
    'zenmen', // 不知名漏洞扫描软件ZenMen_Sec V1.0
    'python'// 主要case有Python/3.6 aiohttp/3.0.9 和 Python-urllib/2.7
];
/**
 * antispider middleware
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {Array} spider_flag, default is []
 *  - {Number} threshold, 0 - 1, default is 1
 * @return {Function} antispider middleware
 * @api public
 */
module.exports = function(options) {
    let { spider_flag = [], threshold = 1 } = options;
    Array.isArray(spider_flag) && (SPIDER_FLAG = [...SPIDER_FLAG, ...spider_flag]);
    return async function antispider(ctx, next) {
        try {
            // 按概率进行拦截
            if (Math.random() < threshold) {
                const userAgent = (ctx.headers['user-agent'] || '').toLocaleLowerCase();
                const isspider = SPIDER_FLAG.some((flag) => {
                    return userAgent.indexOf(flag) !== -1;
                });
                if (isspider && ctx.path !== '/') {
                    // console.log(`检测到爬虫, 已重定向到首页。${userAgent}`);
                    ctx.redirect('/');
                }
            }
            await next();
        } catch (e) {
            console.error(`${ctx.path}异常`, e);
        }
    };
};
