/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  '*': 'allow',
  AdminController: {
    // admin下的所有路由都需要isLogin
    '*': 'isLogin',
    // 排除=>允许
    'login': true,
    'loginS': true,
    'register': true,
    'captcha': true
  }
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // '*': true,

};
