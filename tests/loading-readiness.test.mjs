import test from 'node:test';
import assert from 'node:assert/strict';
import { waitForOpeningAssets, markBlackHoleReady } from '../lib/loading-readiness.ts';

const flush = async () => { for(let i=0;i<12;i++) await Promise.resolve(); };
function setup(t, fonts=Promise.resolve()) {
  t.mock.timers.enable({apis:['setTimeout']});
  const previous=globalThis.document;
  const image={loading:'lazy',decode:()=>Promise.resolve()};
  const fakeDocument={fonts:{ready:fonts},querySelectorAll:()=>[image],querySelector:()=>null};
  Object.defineProperty(globalThis,'document',{value:fakeDocument,writable:true,configurable:true});
  t.after(()=>{globalThis.document=previous;});
  return image;
}

test('ready assets still allow the complete minimum opening duration',async t=>{
  const image=setup(t);
  markBlackHoleReady();
  let finished=false;
  const pending=waitForOpeningAssets(new AbortController().signal).then(()=>{finished=true;});
  await flush();
  t.mock.timers.tick(1749);
  await flush();
  assert.equal(finished,false);
  t.mock.timers.tick(1);
  await pending;
  assert.equal(image.loading,'eager');
  assert.equal(finished,true);
});

test('an asset that never resolves cannot hold the loader past four seconds',async t=>{
  setup(t,new Promise(()=>{}));
  let finished=false;
  const pending=waitForOpeningAssets(new AbortController().signal).then(()=>{finished=true;});
  t.mock.timers.tick(3999);
  await flush();
  assert.equal(finished,false);
  t.mock.timers.tick(1);
  await pending;
  assert.equal(finished,true);
});

test('unmount cancels the loading wait immediately',async t=>{
  setup(t,new Promise(()=>{}));
  const controller=new AbortController();
  const pending=waitForOpeningAssets(controller.signal);
  controller.abort();
  await pending;
});
