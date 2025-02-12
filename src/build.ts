import { createRspackConfig } from './rspack';
import path from 'path';
import { rspack } from '@rspack/core';
import fs from 'fs';

const context = path.resolve(__dirname, '..');
const distPath = path.resolve(context, 'dist');
const statsPath = path.resolve(distPath, 'stats.json');
const performancePath = path.resolve(distPath, 'build-performance.json');

// Track build performance
const startTime = Date.now();
let lastStep = startTime;

function logBuildStep(step: string) {
    const currentTime = Date.now();
    const stepDuration = currentTime - lastStep;
    const totalDuration = currentTime - startTime;
    
    const performanceData = {
        step,
        stepDuration,
        totalDuration,
        timestamp: new Date().toISOString(),
    };

    // Ensure dist directory exists
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
    }

    // Append to performance log
    const existingData = fs.existsSync(performancePath) 
        ? JSON.parse(fs.readFileSync(performancePath, 'utf-8'))
        : [];
    
    existingData.push(performanceData);
    fs.writeFileSync(performancePath, JSON.stringify(existingData, null, 2));

    lastStep = currentTime;
    console.log(`[Build Step] ${step}: ${stepDuration}ms (Total: ${totalDuration}ms)`);
}

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

logBuildStep('Configuration created');

async function runBuild() {
    try {
        const compiler = rspack(config);
        logBuildStep('Compiler created');

        await new Promise((resolve, reject) => {
            compiler.run((err, stats) => {
                if (err) {
                    logBuildStep('Build failed');
                    reject(err);
                    return;
                }
                if (stats?.hasErrors()) {
                    logBuildStep('Build has errors');
                    reject(new Error(stats.toString({ colors: true })));
                    return;
                }

                // Output detailed stats
                if (stats) {
                    logBuildStep('Compilation completed');

                    const jsonStats = stats.toJson({
                        assets: true,
                        modules: true,
                        chunks: true,
                        reasons: true,
                        usedExports: true,
                        providedExports: true,
                        optimizationBailout: true,
                        source: true
                    });

                    // Write stats to file
                    fs.writeFileSync(
                        statsPath,
                        JSON.stringify(jsonStats, null, 2)
                    );

                    logBuildStep('Stats generated');

                    console.log(stats.toString({ colors: true }));
                    console.log('\nStats file generated at:', statsPath);
                    console.log('\nBundle analysis:');
                    console.log('- Used exports:', jsonStats.usedExports);
                    console.log('- Optimization bailout reasons:', jsonStats.optimizationBailout);
                    
                    logBuildStep('Build completed');
                }
                resolve(stats);
            });
        });
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

runBuild(); 