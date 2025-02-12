import { createRspackConfig } from './rspack';
import path from 'path';
import { rspack } from '@rspack/core';

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
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    plugins: [],
    sourceMaps: true
});

async function runBuild() {
    try {
        const compiler = rspack(config);
        await new Promise((resolve, reject) => {
            compiler.run((err, stats) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (stats?.hasErrors()) {
                    reject(new Error(stats.toString({ colors: true })));
                    return;
                }
                console.log(stats?.toString({ colors: true }));
                resolve(stats);
            });
        });
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

runBuild(); 