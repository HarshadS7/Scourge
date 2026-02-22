# 🚀 Quick Start - Testing Your Marketplace

## 🎯 In 3 Steps:

### 1. Open the App
```
http://localhost:3001
```

### 2. Connect MetaMask
- Click "Connect Wallet" (top-right)
- Approve connection
- Switch to **Monad Testnet** (Chain ID: 41454)

### 3. View Marketplace
- Go to `/marketplace`
- See campaigns from your deployed contracts!

---

## 🔍 What You'll See

### If No Campaigns Created:
```
┌─────────────────────────────────┐
│  📊 No Campaigns Yet            │
│                                 │
│  No campaigns have been created │
│  on the contract yet.           │
│                                 │
│  [Create Campaign]              │
└─────────────────────────────────┘
```

### If Campaigns Exist:
```
┌──────────────────┬──────────────────┬──────────────────┐
│  Campaign #0     │  Campaign #1     │  Campaign #2     │
│  Company 0       │  Company 1       │  Company 2       │
│  0.001 ETH       │  0.001 ETH       │  0.001 ETH       │
│  Active          │  Active          │  Active          │
└──────────────────┴──────────────────┴──────────────────┘
```

---

## 🧪 How to Create Test Campaign

### Option 1: Via Script
```bash
cd contracts
forge script script/Interact.s.sol --sig "createCampaign()" --rpc-url $MONAD_RPC_URL --broadcast --legacy
```

### Option 2: Via Cast (Quick)
```bash
cast send $CAMPAIGN_MANAGER_ADDRESS \
  "createCampaign(string,bytes32,uint256,uint256,uint256,bytes32)" \
  "bafytest123" \
  "0x0000000000000000000000000000000000000000000000000000000000000000" \
  "1000000000000000" \
  "2592000" \
  "2592000" \
  "0x0000000000000000000000000000000000000000000000000000000000000000" \
  --rpc-url $MONAD_RPC_URL \
  --private-key $PRIVATE_KEY \
  --value "10000000000000000" \
  --legacy
```

---

## 🐛 Troubleshooting

### Wallet Won't Connect
→ Install MetaMask browser extension

### Wrong Network Error
→ Add Monad Testnet:
- Network: Monad Testnet
- RPC: https://testnet-rpc.monad.xyz
- Chain ID: 41454
- Symbol: MON

### Campaigns Not Loading
→ Check Debug Panel (bottom-left):
- Is wallet connected?
- Is Chain ID 41454?
- Are contract addresses correct?

### Transaction Failing
→ Get testnet MON tokens:
- Ask in Monad Discord
- Check Monad faucet

---

## 📍 Contract Addresses

```
CampaignManager:     0x1eB5C49630E08e95Ba7f139BcF4B9BA171C9a8C7
IdentityRegistry:    0x532802f2F9E0e3EE9d5Ba70C35E1F43C0498772D
SubmissionVerifier:  0x6e0a5725dD4071e46356bD974E13F35DbF9ef367
Escrow:              0xd977422c9eE9B646f64A4C4389a6C98ad356d8C4
IdentityNFT:         0x40A633EeF249F21D95C8803b7144f19AAfeEF7ae
```

View on Explorer:
```
https://testnet-explorer.monad.xyz/address/[ADDRESS]
```

---

## 🎨 Pages Available

```
/                     - Homepage with features
/marketplace          - Browse campaigns (LIVE DATA!)
/identity            - Register identity
/submit              - Submit data to campaign
/dashboard           - User dashboard
/company             - Company dashboard
/create-campaign     - Create new campaign
```

---

## 🔧 Useful Commands

### Check if contracts are deployed:
```bash
cast code $CAMPAIGN_MANAGER_ADDRESS --rpc-url $MONAD_RPC_URL
```

### Get total campaigns:
```bash
cast call $CAMPAIGN_MANAGER_ADDRESS "getTotalCampaigns()" --rpc-url $MONAD_RPC_URL
```

### Get campaign details:
```bash
cast call $CAMPAIGN_MANAGER_ADDRESS "getCampaign(uint256)" 0 --rpc-url $MONAD_RPC_URL
```

---

## ✅ Everything Working?

You should see:
- ✅ Wallet connects successfully
- ✅ Network badge shows "Monad Testnet"
- ✅ Debug panel shows contract addresses
- ✅ Marketplace loads (with or without campaigns)
- ✅ No errors in browser console
- ✅ Can filter/search (if campaigns exist)

---

## 📞 Need More Help?

1. **Check browser console** (F12)
2. **Review [TESTING_GUIDE.md](./TESTING_GUIDE.md)**
3. **Check [INTEGRATION_COMPLETE.md](../INTEGRATION_COMPLETE.md)**

---

**🎉 You're all set! Start testing your decentralized marketplace!**
