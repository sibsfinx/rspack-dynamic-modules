import { createRspackConfig } from './rspack';
import path from 'path';
import { rspack } from '@rspack/core';
import { RspackDevServer } from '@rspack/dev-server';

const context = path.resolve(__dirname, '..');
const distPath = path.resolve(context, 'dist');

const config = createRspackConfig({
    context,
    entry: {
        scripts: './src/index.ts'
    },
    publicPath: '/',
    distPath,
    tscontext: context,
    mode: 'development',
    plugins: [],
    sourceMaps: true
});

async function startDevServer() {
    try {
        const compiler = rspack(config);
        const server = new RspackDevServer(
            {
                port: 3000,
                host: 'localhost',
                hot: true,
                open: true,
                historyApiFallback: true,
                static: {
                    directory: context,
                    publicPath: '/'
                }
            },
            compiler
        );

        await server.start();
        console.log('Dev server started on http://localhost:3000');
    } catch (error) {
        console.error('Failed to start dev server:', error);
        process.exit(1);
    }
}

startDevServer(); 