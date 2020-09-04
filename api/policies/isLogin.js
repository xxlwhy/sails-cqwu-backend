/* 权限管理策略文件 */
module.exports = async function (req, res, next) {
    if (req.session.user) {
        return next();
    }
    // 重定向到登录页
    return res.redirect('/admin/login');
};
