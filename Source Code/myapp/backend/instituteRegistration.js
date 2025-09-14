import express from 'express';
import { Gateway, Wallets } from 'fabric-network';
import path from 'path';
import fs, { stat } from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Connect to the Fabric network
const connectToFabric = async () => {
    try{
        const ccpPath = path.resolve(__dirname, 'organizations/peerOrganizations/eiorg.isp.com/fabric-ca-client-config.yaml'); // Update path
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(__dirname, './wallet'); // Path to wallet
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identity = await wallet.get('User1@EiOrg.id');
            if (!identity) {
                throw new Error('Identity "User1@EiOrg.id" not found in wallet');
            }

            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: 'User1@EiOrg.id',
                discovery: { enabled: true, asLocalhost: false }
            });

            return gateway;
    } catch (error) {
        console.error("Fabric connection error:", error);
        throw new Error("Failed to connect to Fabric network for EiOrg.");
    }
};

// API to register a new applicant
app.post('/registerInstitute', async (req, res) => {
    try {
        const {registrationNo, heid, pan, tan, email, collegeName, address, city, mobNum, state} = req.body;
        if (!registrationNo || !heid || !pan || !tan || !mobNum || !email || !collegeName || !address || !city || !state) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const gateway = await connectToFabric();
        const network = await gateway.getNetwork('isp-channel'); // Connect to the channel
        const contract = network.getContract('instituteRegContract'); // Chaincode name

        // Call the CreateApplicant function in the smart contract 
        await contract.submitTransaction('CreateEI', heid, registrationNo, tan, pan, mobNum, email, collegeName, address, city, state);
        gateway.disconnect();

        res.json({ message: 'User Registered Successfully' });
    } catch (error) {
        console.error('Error in /registerInstitute:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
