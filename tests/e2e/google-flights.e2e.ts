import assert from 'node:assert/strict';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import puppeteer from 'puppeteer';

// Use Firefox's actual URL matcher and the packaged extension, not a reimplementation
// of match patterns. Intercept documents so this test never depends on Google's UI.
const browser = await puppeteer.launch({ browser: 'firefox', headless: true });
let failures = 0;

try {
  await browser.installExtension(path.resolve(process.argv[2] || 'dist'));
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    void request.respond({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><title>Media fixture</title><body><video controls width="640" height="360"></video></body>',
    });
  });

  const cases: [string, boolean][] = [
    ['https://www.example.com/watch', true],
    ['https://flights.google.com/', false],
    ['http://flights.google.com/search?q=JFK', false],
    ['https://www.google.com/travel/flights', false],
    ['https://www.google.com/travel/flights?hl=en#search', false],
    ['https://www.google.com/travel/flights/search?tfs=example', false],
    ['https://google.com/travel/flights?hl=de', false],
    ['https://www.google.com/travel/hotels', true],
    ['https://www.google.com/search?q=flights', true],
    ['https://www.google.com/travel/flights-guide', true],
    ['https://www.example.com/?next=https://flights.google.com/', true],
    ['https://flights.google.com.example.com/', true],
  ];

  for (const [url, enabled] of cases) {
    try {
      await page.goto(url, { waitUntil: 'load' });
      // Wait beyond the runtime's deferred startup; mutate the DOM afterwards
      // to exercise media discovery on dynamically rendered applications.
      await delay(1000);
      await page.evaluate(async () => {
        const video = document.querySelector('video')!;
        const canvas = document.createElement('canvas');
        const stream = canvas.captureStream();
        // A live MediaStream ignores playbackRate in Firefox. Record a tiny
        // local clip so the positive controls exercise real speed changes.
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        const clip = await new Promise<Blob>((resolve) => {
          recorder.ondataavailable = (event) => resolve(event.data);
          recorder.start();
          canvas.getContext('2d')!.fillRect(0, 0, canvas.width, canvas.height);
          setTimeout(() => recorder.stop(), 200);
        });
        stream.getTracks().forEach((track) => track.stop());
        video.muted = true;
        video.loop = true;
        video.src = URL.createObjectURL(clip);
        await video.play();
        document.body.append(document.createElement('section'));
      });

      if (enabled) {
        await page.waitForSelector('vsc-controller', { timeout: 5000 });
        const previousSpeed = await page.$eval('video', (video) => video.playbackRate);
        await page.keyboard.press('d');
        await page.waitForFunction(
          (speed) => document.querySelector('video')!.playbackRate > speed,
          { timeout: 5000 },
          previousSpeed
        );
      } else {
        await delay(500);
        assert.equal(await page.evaluate(() => typeof window.VSC), 'undefined');
        assert.equal(await page.$('vsc-controller'), null);
        await page.keyboard.press('d');
        assert.equal(await page.$eval('video', (video) => video.playbackRate), 1);
      }
      console.log(`PASS ${enabled ? 'enabled' : 'excluded'} ${url}`);
    } catch (error) {
      failures++;
      console.error(`FAIL ${url}`, error);
    }
  }
} finally {
  await browser.close();
}

assert.equal(failures, 0, `${failures} Firefox URL exclusion checks failed`);
