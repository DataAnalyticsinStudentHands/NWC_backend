module.exports = ({ env }) => (
  {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    //v4 optional
    app:{
      keys:env.array('APP_KEYS')
    }
    //v3
    // admin: {
    //   auth: {
    //     secret: env('ADMIN_JWT_SECRET', process.env.ADMIN_JWT_SECRET),
    //   },
    // },
  });