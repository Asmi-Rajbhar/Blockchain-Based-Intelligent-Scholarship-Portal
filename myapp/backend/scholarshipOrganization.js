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
    const ccpPath = path.resolve(__dirname, 'organizations/peerOrganizations/schorg.isp.com/fabric-ca-client-config.yaml'); // Update path
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(__dirname, './wallet'); // Path to wallet
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get('User1@SchOrg.id');
        if (!identity) {
            throw new Error('Identity "User1@SchOrg.id" not found in wallet');
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'User1@SchOrg.id',
            discovery: { enabled: true, asLocalhost: false }
        });

        return gateway;
    } catch (error) {
        console.error("Fabric connection error:", error);
        throw new Error("Failed to connect to Fabric network for NSPOrg.");
    }
};

// API to register a new applicant
app.post('/scholarshipRegister', async (req, res) => {
    try {
        const { registrationNo,registration12AA, organizationName, scholarshipAmount, academicYear, scholarshipName, incomeCriteria, ageLimit,
            fieldOfStudy,
            hscScore,
            sscScore,
            religion,
            caste,
            startsOn,
            endsOn,
            officialUrl,
            guidelines,
            schemeId} = req.body;
        if (!registrationNo || !registration12AA || !organizationName || !scholarshipAmount || !academicYear || !scholarshipName || !incomeCriteria || !ageLimit ||
            !fieldOfStudy || 
            !hscScore ||
            !sscScore ||
            !religion ||
            !caste ||
            !startsOn ||
            !endsOn ||
            !officialUrl ||
            !guidelines ||
            !schemeId) {
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
        console.error('Error in /scholarshipRegister:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(3002, () => {
    console.log('Server is running on http://localhost:3002');
});
