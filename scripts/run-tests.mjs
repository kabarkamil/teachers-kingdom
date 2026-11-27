import { createServer } from 'vite';

async function main() {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
  });

  try {
    const suite = await server.ssrLoadModule('/tests/infrastructure.regression.ts');
    const summary = await suite.runInfrastructureRegressionTests();

    console.log('');
    for (const item of summary.results) {
      const prefix = item.passed ? 'PASS' : 'FAIL';
      console.log(`  [${prefix}] ${item.name} (${item.durationMs}ms)`);
      if (!item.passed && item.error) {
        console.error(`         ${item.error}`);
      }
    }
    console.log('');
    console.log(
      `Regression suite finished: ${summary.passed}/${summary.total} passed, ${summary.failed} failed.`
    );

    if (summary.failed > 0) {
      process.exitCode = 1;
    }
  } finally {
    await server.close();
  }
}

main().catch((err) => {
  console.error('Regression test runner crashed:', err);
  process.exitCode = 1;
});
