module.exports = ({ env }) => ({
  // defaultConnection: 'default',
//   connection: {
//     default: {
//       // connector: 'bookshelf',
//       settings: {
//         client:'postgres',
//         host: env('DATABASE_HOST', process.env.DATABASE_HOST),
//         // srv: env.bool('DATABASE_SRV', process.env.DATABASE_SRV),
//         port: env.int('DATABASE_PORT', 5432),
//         database: env('DATABASE_NAME', process.env.DATABASE_NAME),
//         username: env('DATABASE_USERNAME', process.env.DATABASE_USERNAME),
//         password: env('DATABASE_PASSWORD', process.env.DATABASE_PASSWORD),
//       },
//       // options: {
//       //   // authenticationDatabase: env('AUTHENTICATION_DATABASE', process.env.AUTHENTICATION_DATABASE),
//       //   // ssl: env.bool('DATABASE_SSL', process.env.DATABASE_SSL),
//       // },
//     },
//     debug:false,
//   },
  connection:{
    client:'postgres',
    connection:{
      host:env('DATABASE_HOST', process.env.DATABASE_HOST),
      port:env.int('DATABASE_PORT', 5432),
      database:env('DATABASE_NAME', process.env.DATABASE_NAME),
      user:env('DATABASE_USERNAME', process.env.DATABASE_USERNAME),
      password:env('DATABASE_PASSWORD', process.env.DATABASE_PASSWORD),
    },
    debug:false,
  },
});
