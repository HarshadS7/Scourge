# 🧪 Testing Guide - Scourge Frontend & Contracts

## ✅ Setup Complete!

Your frontend is now connected to the deployed contracts on Monad Testnet. Here's how to test everything:

---

## 🚀 Running the Application

The development server is running at:
**http://localhost:3001**

Open this URL in your browser to see the application.

---

## 🔗 Testing Wallet Connection

### Step 1: Connect MetaMask

1. Click the **"Connect Wallet"** button in the top right
2. Select your wallet (MetaMask, WalletConnect, or Coinbase Wallet)
3. Approve the connection request

### Step 2: Add Monad Testnet to MetaMask

If you don't see Monad Testnet in your networks:

**Network Configuration:**
- **Network Name:** Monad Testnet
- **RPC URL:** https://testnet-rpc.monad.xyz
- **Chain ID:** 41454
- **Currency Symbol:** MON
- **Block Explorer:** https://testnet-explorer.monad.xyz

**Quick Add:**
MetaMask should automatically prompt you to add the network when you connect. Just click "Approve"!

### Step 3: Get Testnet Tokens

You need MON tokens to interact with contracts. Get them from:
- Monad testnet faucet (check Monad documentation)
- Monad Discord community

---

## 📊 Testing Campaign Display

### What You'll See:

#### Case 1: No Campaigns Yet
If no campaigns have been created on the contract:
- You'll see a "No Campaigns Yet" message
- Click "Create Campaign" to be the first!

#### Case 2: Campaigns Exist
If campaigns exist:
- Campaign cards will display with:
  - Company name
  - Campaign title
  - Required attributes
  - Price per submission
  - Budget and usage percentage
  - Deadline
  - Status badge (Active/Closing/Filled)

### Features to Test:

1. **Search:** Type in the search box to filter campaigns by title or company
2. **Status Filter:** Click "All", "Active", "Closing", or "Filled" to filter
3. **Sort:** Change sorting (Highest Price, Lowest Price, Budget Remaining)
4. **Attribute Filters:** Click "Attributes" and select filters
5. **Campaign Click:** Click any campaign card to go to submission page

---

## 🔍 Verifying Contract Connection

### Check Your Browser Console

Open DevTools (F12) → Console tab. You should see:

✅ **Good Signs:**
```
Connected to Monad Testnet
Fetching campaigns from CampaignManager...
Total campaigns: X
```

❌ **Errors to Watch For:**
```
Error: Could not connect to network
→ Check your RPC URL in .env

Error: Invalid contract address
→ Verify deployed addresses in .env

Error: No provider found
→ Make sure wallet is connected
```

---

## 📝 Contract Addresses (Deployed)

All addresses are configured in `/frontend/.env`:

```
NEXT_PUBLIC_IDENTITY_NFT_ADDRESS=0x40A633EeF249F21D95C8803b7144f19AAfeEF7ae
NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=0x532802f2F9E0e3EE9d5Ba70C35E1F43C0498772D
NEXT_PUBLIC_CAMPAIGN_MANAGER_ADDRESS=0x1eB5C49630E08e95Ba7f139BcF4B9BA171C9a8C7
NEXT_PUBLIC_ESCROW_ADDRESS=0xd977422c9eE9B646f64A4C4389a6C98ad356d8C4
NEXT_PUBLIC_SUBMISSION_VERIFIER_ADDRESS=0x6e0a5725dD4071e46356bD974E13F35DbF9ef367
```

Verify these on Monad Explorer:
`https://testnet-explorer.monad.xyz/address/[ADDRESS]`

---

## 🧪 Test Scenarios

### Test 1: Wallet Connection
- [ ] Can connect wallet
- [ ] Wallet address displays correctly
- [ ] Network badge shows "Monad Testnet"
- [ ] Can disconnect and reconnect

### Test 2: Campaign Loading
- [ ] Loading spinner shows while fetching
- [ ] Campaigns display after loading
- [ ] Each campaign shows correct data
- [ ] Stats at top update correctly (Active/Closing/Filled counts)

### Test 3: Filtering & Search
- [ ] Search filters campaigns by name/company
- [ ] Status filters work (all/active/closing/filled)
- [ ] Attribute filters apply correctly
- [ ] Sort options change order
- [ ] Clear filters resets view

### Test 4: Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)
- [ ] Mobile menu opens/closes

---

## 🐛 Common Issues & Solutions

### Issue: "Connect Wallet" button doesn't work
**Solution:**
- Make sure you have MetaMask installed
- Try clearing browser cache
- Check browser console for errors

### Issue: Campaigns not loading
**Possible Causes:**
1. Not connected to wallet → Connect wallet first
2. Wrong network → Switch to Monad Testnet
3. RPC error → Check `.env` has correct RPC URL
4. No campaigns exist → Create one from company dashboard

**Debug:**
```javascript
// Open browser console and run:
console.log('Contract Address:', process.env.NEXT_PUBLIC_CAMPAIGN_MANAGER_ADDRESS);
```

### Issue: "Wrong Network" error
**Solution:**
- Click the "Wrong Network" button
- Select "Monad Testnet" from the list
- If not listed, add it manually (see Step 2 above)

### Issue: Transactions failing
**Solution:**
- Ensure you have MON tokens
- Check gas price isn't too low
- Verify contract addresses are correct

---

## 📱 Pages to Test

### 1. Homepage (/)
- Hero section
- Feature cards
- Flow steps
- "Get Started" button

### 2. Marketplace (/marketplace)
- Campaign grid (connected to contract ✅)
- Search and filters (working ✅)
- Stats display (working ✅)

### 3. Identity (/identity)
- Register identity form
- ZK proof submission

### 4. Submit Data (/submit)
- Campaign selection
- Data submission form
- Proof generation

### 5. Dashboard (/dashboard)
- User submissions
- Earnings
- Identity status

### 6. Company Dashboard (/company)
- Create campaign
- View submissions
- Manage budgets

---

## 🎯 Next Steps

### For Users:
1. ✅ Connect your wallet
2. ✅ Get testnet MON tokens
3. 📋 Register your identity
4. 💰 Browse and submit to campaigns

### For Companies:
1. ✅ Connect your wallet
2. ✅ Get testnet MON tokens
3. 📝 Create a campaign
4. 💸 Deposit escrow
5. 📊 Review submissions

---

## 🔐 Security Reminders

- ⚠️ This is a **TESTNET** - Do not use real funds
- 🔒 Never share your private keys
- 🛡️ Always verify transaction details before signing
- 📝 `.env` file should never be committed to git

---

## 📞 Support

### If you encounter issues:

1. **Check Browser Console:** F12 → Console tab
2. **Check Network Tab:** F12 → Network tab
3. **Verify RPC Connection:** 
   ```bash
   curl -X POST https://testnet-rpc.monad.xyz \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   ```
4. **Review Documentation:**
   - [DEPLOYMENT_SUMMARY.md](../DEPLOYMENT_SUMMARY.md)
   - [frontend/SETUP.md](./SETUP.md)
   - [contracts/QUICKSTART.md](../contracts/QUICKSTART.md)

---

## ✅ Success Checklist

- [ ] Frontend running on http://localhost:3001
- [ ] Wallet connects successfully
- [ ] Monad Testnet network added to MetaMask
- [ ] Campaigns load from contract (or "No campaigns" shows)
- [ ] Search and filters work
- [ ] No errors in browser console
- [ ] Can navigate between pages
- [ ] UI is responsive on mobile

---

**🎉 Congratulations! Your Scourge marketplace is fully integrated with on-chain contracts!**
