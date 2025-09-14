import express from 'express';
import { Gateway, Wallets } from 'fabric-network';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

//Fabric Gateway connection for NSPOrg (using User1@NSPOrg.id)
const connectToFabric = async () => {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', 'network', 'connection-profile', 'connection-nsporg.yaml');

        const ccp = yaml.load(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(__dirname, '..', '..', 'network', 'wallet'); 
        console.log("Wallet Path:", walletPath);

        // Debug: List files in the wallet directory
        const walletFiles = fs.readdirSync(walletPath);
        console.log("Wallet Folder Contents:", walletFiles);

        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identity = await wallet.get('User1@NSPOrg');
        if (!identity) {
            throw new Error('Identity "User1@NSPOrg.id" not found in wallet');
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'User1@NSPOrg',
            discovery: { enabled: true, asLocalhost: false }
        });

        return gateway;
    } catch (error) {
        console.error("Fabric connection error:", error);
        throw new Error("Failed to connect to Fabric network for NSPOrg.");
    }
};

//Register a new applicant
app.post('/register', async (req, res) => {
    const {
        applicantId, aadhaar, name, gender, email, dob, mobile,
        address, collegeName, branch, currentYear,
        panNumber, annualIncome, bankName, bankAccount, accountNumber
    } = req.body;

    if (!applicantId || !aadhaar || !name || !gender || !email || !dob || !mobile ||
        !address || !collegeName || !branch || !currentYear ||
        !panNumber || !annualIncome || !bankName || !bankAccount || !accountNumber) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const formattedDOB = new Date(dob).toISOString().split('T')[0];

        const gateway = await connectToFabric();
        const network = await gateway.getNetwork('isp-channel');
        const contract = network.getContract('ApplicantContract');

        await contract.submitTransaction(
            'CreateApplicant', applicantId, aadhaar, name, gender,
            formattedDOB, mobile, email, address, bankAccount, panNumber,
            annualIncome, collegeName, branch, currentYear, bankName, accountNumber
        );

        await gateway.disconnect();
        res.json({ message: "User Registered Successfully" });
    } catch (error) {
        console.error("Error in /register:", error);
        res.status(500).json({ error: error.message });
    }
});

//Get applicant details
// app.get('/getApplicant/:applicantId', async (req, res) => {
//     const { applicantId } = req.params;

//     if (!applicantId) {
//         return res.status(400).json({ error: "Applicant ID is required" });
//     }

//     try {
//         const gateway = await connectToFabric();
//         const network = await gateway.getNetwork('isp-channel');
//         const contract = network.getContract('ApplicantContract');

//         const result = await contract.evaluateTransaction('ReadApplicant', applicantId);
//         await gateway.disconnect();

//         res.json(JSON.parse(result.toString()));
//     } catch (error) {
//         console.error("Error in /getApplicant:", error);
//         res.status(500).json({ error: error.message });
//     }
// });

// Start server
app.listen(3000, () => {
    console.log("NSPOrg server running at http://localhost:3000");
});
