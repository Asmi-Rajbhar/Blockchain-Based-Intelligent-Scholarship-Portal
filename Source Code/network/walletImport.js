// walletImportAllOrgs.js
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Wallets } from 'fabric-network';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of organizations and their identities
const orgs = [
  {
    orgName: 'NSPOrg',
    user: 'User1',
    mspId: 'NSPOrgMSP',
    certPath: 'organizations/peerOrganizations/nsporg.isp.com/users/User1@nsporg.isp.com/msp/signcerts/cert.pem',
    keyDir: 'organizations/peerOrganizations/nsporg.isp.com/users/User1@nsporg.isp.com/msp/keystore'
  },
  {
    orgName: 'SchOrg',
    user: 'User1',
    mspId: 'SchOrgMSP',
    certPath: 'organizations/peerOrganizations/eiorg.isp.com/users/User1@eiorg.isp.com/msp/signcerts/cert.pem',
    keyDir: 'organizations/peerOrganizations/eiorg.isp.com/users/User1@eiorg.isp.com/msp/keystore'
  },
  {
    orgName: 'EIOrg',
    user: 'User1',
    mspId: 'EIOrgMSP',
    certPath: 'organizations/peerOrganizations/schorg.isp.com/users/User1@schorg.isp.com/msp/signcerts/cert.pem',
    keyDir: 'organizations/peerOrganizations/schorg.isp.com/users/User1@schorg.isp.com/msp/keystore'
  }
];

async function importAllIdentities() {
  const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, 'wallet'));

  for (const org of orgs) {
    try {
      const cert = fs.readFileSync(path.resolve(__dirname, org.certPath)).toString();

      const keyFiles = fs.readdirSync(path.resolve(__dirname, org.keyDir));
      if (keyFiles.length === 0) {
        throw new Error(`No key file found in ${org.keyDir}`);
      }

      const keyPath = path.resolve(__dirname, org.keyDir, keyFiles[0]);
      const key = fs.readFileSync(keyPath).toString();

      const identity = {
        credentials: {
          certificate: cert,
          privateKey: key,
        },
        mspId: org.mspId,
        type: 'X.509',
      };

      const identityLabel = `${org.user}@${org.orgName}`;
      await wallet.put(identityLabel, identity);
      console.log(`Imported identity for ${identityLabel}`);
    } catch (error) {
      console.error(`Failed to import identity for ${org.orgName}:`, error.message);
    }
  }
}

importAllIdentities();
