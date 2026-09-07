import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContact } from '../lib/contact.ts';

const origin = 'https://qozyd.example';
const config = { origins:[origin], apiKey:'test-key', sender:'QOZYD <hello@qozyd.example>', recipient:'owner@example.com', turnstileSecret:'test-secret' };
const payload = { name:'Test Visitor', email:'visitor@example.com', service:'Marketing', message:'Please tell me more about your marketing services.', consent:true, website:'', token:'test-token' };
function request(body=payload, requestOrigin=origin) {
  return new Request(`${origin}/api/contact`, {method:'POST',headers:{origin:requestOrigin,'content-type':'application/json'},body:JSON.stringify(body)});
}
const noNetwork = async () => { throw new Error('Unexpected external request'); };

test('rejects cross-origin submissions before any provider call', async () => {
  assert.equal((await handleContact(request(payload,'https://attacker.example'),config,noNetwork)).status,403);
});
test('rejects invalid email and consent before any provider call', async () => {
  for (const changes of [{email:'bad\r\nBcc:someone@example.com'},{consent:false},{message:'x'},{token:''}]) {
    assert.equal((await handleContact(request({...payload,...changes}),config,noNetwork)).status,400);
  }
});
test('never reports delivery when service configuration is absent', async () => {
  assert.equal((await handleContact(request(),{...config,apiKey:''},noNetwork)).status,503);
});
test('bounds oversized bodies and rejects honeypot submissions', async () => {
  assert.equal((await handleContact(request({...payload,message:'x'.repeat(17000)}),config,noNetwork)).status,413);
  assert.equal((await handleContact(request({...payload,website:'spam.example'}),config,noNetwork)).status,400);
});
test('rejects failed challenges and challenges from another hostname or action', async () => {
  for (const result of [{success:false},{success:true,hostname:'attacker.example',action:'contact'},{success:true,hostname:'qozyd.example',action:'login'}]) {
    let calls=0;
    const response=await handleContact(request(),config,async()=>{calls++;return Response.json(result);});
    assert.equal(response.status,400);assert.equal(calls,1);
  }
});
test('sends plain text only to the configured recipient after verification', async () => {
  const calls=[];
  const response=await handleContact(request(),config,async(url,options)=>{
    calls.push([url,options]);
    return calls.length===1 ? Response.json({success:true,hostname:'qozyd.example',action:'contact'}) : Response.json({id:'accepted-email'});
  });
  assert.equal(response.status,200);
  const email=JSON.parse(calls[1][1].body);
  assert.deepEqual(email.to,['owner@example.com']);assert.equal(email.reply_to,payload.email);
  assert.equal(email.html,undefined);assert.ok(email.text.includes(payload.message));
  assert.ok(calls[1][1].headers['Idempotency-Key']);
});
test('provider failures return a recoverable error rather than false success', async () => {
  let calls=0;
  const response=await handleContact(request(),config,async()=>++calls===1 ? Response.json({success:true,hostname:'qozyd.example',action:'contact'}) : Response.json({error:'provider'}, {status:500}));
  assert.equal(response.status,502);
});
