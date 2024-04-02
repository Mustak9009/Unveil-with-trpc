/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias.canvas = false
        config.resolve.alias.encoding = false
        return config
      },
      images:{
        remotePatterns:[
          {
            protocol:"https",
            hostname:'lh3.googleusercontent.com'
          }
        ]
      }
};

export default nextConfig;

/**
 * For this error:
 * ./node_modules/canvas/build/Release/canvas.node
    Module parse failed: Unexpected character '�' (1:2)
    You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
    (Source code omitted for this binary file)
    .
    .
    We need -> Webpack config
 */