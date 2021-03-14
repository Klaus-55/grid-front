// const path = require('path')
// const webpack = require('webpack')
//
// const resolve = dir => {
//   return path.join(__dirname, dir);
// };
//
// module.exports = {
//   devServer: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:9000/grid-server/api/',
//         changeOrigin: true,
//         ws: true,
//         secure: false,
//         pathRewrite: {
//           '^/api': ''
//         }
//       }
//     }
//   }
// }