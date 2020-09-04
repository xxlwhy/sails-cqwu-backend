/**
 * Default model settings
 * (sails.config.models)
 *
 * Your default, project-wide model settings. Can also be overridden on a
 * per-model basis by setting a top-level properties in the model definition.
 *
 * For details about all available model settings, see:
 * https://sailsjs.com/config/models
 *
 * For more general background on Sails model settings, and how to configure
 * them on a project-wide or per-model basis, see:
 * https://sailsjs.com/docs/concepts/models-and-orm/model-settings
 */

module.exports.models = {


  /***************************************************************************
  *                                                                          *
  * Whether model methods like `.create()` and `.update()` should ignore     *
  * (and refuse to persist) unrecognized data-- i.e. properties other than   *
  * those explicitly defined by attributes in the model definition.          *
  *                                                                          *
  * To ease future maintenance of your code base, it is usually a good idea  *
  * to set this to `true`.                                                   *
  *                                                                          *
  * > Note that `schema: false` is not supported by every database.          *
  * > For example, if you are using a SQL database, then relevant models     *
  * > are always effectively `schema: true`.  And if no `schema` setting is  *
  * > provided whatsoever, the behavior is left up to the database adapter.  *
  * >                                                                        *
  * > For more info, see:                                                    *
  * > https://sailsjs.com/docs/concepts/orm/model-settings#?schema           *
  *                                                                          *
  ***************************************************************************/
  // schema: true,//严格匹配数据表的模式,
  schema: false,
  /***************************************************************************
  *                                                                          *
  * How and whether Sails will attempt to automatically rebuild the          *
  * tables/collections/etc. in your schema.                                  *
  *                                                                          *
  * > Note that, when running in a production environment, this will be      *
  * > automatically set to `migrate: 'safe'`, no matter what you configure   *
  * > here.  This is a failsafe to prevent Sails from accidentally running   *
  * > auto-migrations on your production database.                           *
  * >                                                                        *
  * > For more info, see:                                                    *
  * > https://sailsjs.com/docs/concepts/orm/model-settings#?migrate          *
  *                                                                          *
  ***************************************************************************/
  migrate: 'alter',
  /***************************************************************************
  *                                                                          *
  * Base attributes that are included in all of your models by default.      *
  * By convention, this is your primary key attribute (`id`), as well as two *
  * other timestamp attributes for tracking when records were last created   *
  * or updated.                                                              *
  *                                                                          *
  * > For more info, see:                                                    *
  * > https://sailsjs.com/docs/concepts/orm/model-settings#?attributes       *
  *                                                                          *
  ***************************************************************************/
  attributes: {
    id: { type: 'number', autoIncrement: true },
    createdAt: { type: 'number', autoCreatedAt: true, },
    updatedAt: { type: 'number', autoUpdatedAt: true, },
  },

  dataEncryptionKeys: {
    default: 'bjN0a2iRQjr6vFZ1DXaXBUipyE5jV5+zOcFfdjtjBVw='
  },
  cascadeOnDestroy: true


};
