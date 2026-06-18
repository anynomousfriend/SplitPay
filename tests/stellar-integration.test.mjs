/**
 * Stellar Integration Test
 * 
 * Automated end-to-end test that verifies:
 * 1. Account creation & funding via Friendbot
 * 2. Balance fetching
 * 3. XLM payment between two accounts
 * 4. Transaction history retrieval
 * 
 * Run: node tests/stellar-integration.test.mjs
 */

import * as StellarSdk from '@stellar/stellar-sdk';

const HORIZON = 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON);
const NETWORK = StellarSdk.Networks.TESTNET;

// ── Helpers ──────────────────────────────────────────────

async function fundAccount(publicKey) {
  const res = await fetch(`https://friendbot.stellar.org/?addr=${publicKey}`);
  const json = await res.json();
  if (!res.ok && json.status !== 400) {
    throw new Error(`Friendbot failed: ${JSON.stringify(json)}`);
  }
  // status 400 = already funded, that's fine
  return json;
}

async function getBalance(publicKey) {
  const account = await server.loadAccount(publicKey);
  const xlm = account.balances.find(b => b.asset_type === 'native');
  return parseFloat(xlm?.balance ?? '0');
}

async function sendPayment(senderKeypair, recipientPublicKey, amount, memo) {
  const account = await server.loadAccount(senderKeypair.publicKey());

  const txBuilder = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: recipientPublicKey,
        asset: StellarSdk.Asset.native(),
        amount: amount,
      })
    )
    .setTimeout(180);

  if (memo) {
    txBuilder.addMemo(StellarSdk.Memo.text(memo));
  }

  const tx = txBuilder.build();
  tx.sign(senderKeypair);

  const result = await server.submitTransaction(tx);
  return { hash: result.hash, success: result.successful };
}

async function getRecentPayments(publicKey, limit = 5) {
  const payments = await server
    .payments()
    .forAccount(publicKey)
    .order('desc')
    .limit(limit)
    .call();

  return payments.records.map(p => ({
    type: p.type,
    amount: p.amount,
    from: p.from,
    to: p.to,
    hash: p.transaction_hash,
  }));
}

// ── Test Runner ──────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}`);
    failed++;
  }
}

async function run() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Stellar Integration Test (Testnet)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 1. Generate two fresh keypairs
  const sender = StellarSdk.Keypair.random();
  const recipient = StellarSdk.Keypair.random();

  console.log(`  Sender:    ${sender.publicKey()}`);
  console.log(`  Recipient: ${recipient.publicKey()}\n`);

  // ── Test 1: Fund accounts ─────────────────────────────
  console.log('▸ Test 1: Fund accounts via Friendbot');
  try {
    await fundAccount(sender.publicKey());
    assert(true, 'Sender funded');
  } catch (e) {
    assert(false, `Sender funding failed: ${e.message}`);
    return;
  }

  try {
    await fundAccount(recipient.publicKey());
    assert(true, 'Recipient funded');
  } catch (e) {
    assert(false, `Recipient funding failed: ${e.message}`);
    return;
  }

  // ── Test 2: Fetch balances ────────────────────────────
  console.log('\n▸ Test 2: Fetch balances');
  const senderBal = await getBalance(sender.publicKey());
  const recipientBal = await getBalance(recipient.publicKey());
  console.log(`    Sender balance:    ${senderBal} XLM`);
  console.log(`    Recipient balance: ${recipientBal} XLM`);
  assert(senderBal >= 10000, 'Sender has starting balance (≥10,000 XLM)');
  assert(recipientBal >= 10000, 'Recipient has starting balance (≥10,000 XLM)');

  // ── Test 3: Send payment ──────────────────────────────
  console.log('\n▸ Test 3: Send 25 XLM payment with memo');
  const SEND_AMOUNT = '25';
  let txResult;
  try {
    txResult = await sendPayment(sender, recipient.publicKey(), SEND_AMOUNT, 'SplitPay: Test');
    assert(txResult.success, `Payment successful (hash: ${txResult.hash.slice(0, 12)}…)`);
  } catch (e) {
    assert(false, `Payment failed: ${e.message}`);
    return;
  }

  // ── Test 4: Verify balances after payment ─────────────
  console.log('\n▸ Test 4: Verify balances after payment');
  const senderBalAfter = await getBalance(sender.publicKey());
  const recipientBalAfter = await getBalance(recipient.publicKey());
  console.log(`    Sender balance:    ${senderBalAfter} XLM (was ${senderBal})`);
  console.log(`    Recipient balance: ${recipientBalAfter} XLM (was ${recipientBal})`);

  const senderDiff = senderBal - senderBalAfter;
  const recipientDiff = recipientBalAfter - recipientBal;

  assert(senderDiff >= 25, `Sender debited ≥25 XLM (actual: ${senderDiff.toFixed(4)})`);
  assert(recipientDiff === 25, `Recipient credited exactly 25 XLM (actual: ${recipientDiff.toFixed(4)})`);

  // ── Test 5: Transaction history ───────────────────────
  console.log('\n▸ Test 5: Transaction history');
  const history = await getRecentPayments(sender.publicKey());
  assert(history.length > 0, `History has ${history.length} entries`);

  const ourTx = history.find(h => h.hash === txResult.hash);
  assert(!!ourTx, 'Our payment appears in transaction history');
  assert(ourTx?.amount === '25.0000000', `Amount is correct (${ourTx?.amount})`);
  assert(ourTx?.to === recipient.publicKey(), 'Recipient address matches');

  // ── Summary ───────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (failed > 0) process.exit(1);
}

run().catch(err => {
  console.error('\n💥 Unexpected error:', err.message);
  process.exit(1);
});
