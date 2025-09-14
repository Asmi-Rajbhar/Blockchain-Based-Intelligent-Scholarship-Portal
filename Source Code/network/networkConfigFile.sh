#!/bin/bash

# 1. Start the CA containers (to register/enroll identities)
docker-compose -f docker/compose-ca.yaml up -d                 

# 2. Set permissions on the organizations folder
sudo chmod -R 777 organizations/

# 3. Make sure the script is executable
chmod +x registerEnroll.sh

# 4. Run your script to register/enroll identities
./registerEnroll.sh

# 5. After all identities and crypto material are generated,
#    start the main Fabric network (orderer, peers, etc.)
docker-compose -f docker/compose-test-net.yaml up -d

docker ps -a

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/configtx

################################Generate the genesis block of the channel#################################
echo "Generate the genesis block of the channel"
configtxgen -profile ChannelUsingRaft -outputBlock ./channel-artifacts/isp-channel.block -channelID isp-channel
sleep 2

################################Create the application channel############################################
echo "Create the application channel name isp-channel"
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/isp.com/orderers/orderer.isp.com/msp/tlscacerts/tlsca.isp.com-cert.pem
export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/organizations/ordererOrganizations/isp.com/orderers/orderer.isp.com/tls/server.crt
export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/organizations/ordererOrganizations/isp.com/orderers/orderer.isp.com/tls/server.key

osnadmin channel join --channelID isp-channel --config-block ./channel-artifacts/isp-channel.block -o localhost:7053 --ca-file "$ORDERER_CA" --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY"
sleep 3

###############################List channels on an orderer############################
echo "List channels on an orderer"
osnadmin channel list -o localhost:7053 --ca-file "$ORDERER_CA" --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY"
sleep 2

###############################Join peers to the channel#############################
#Three Org - NspOrg, EiOrg, SchOrg
echo "Join peers to the channel"

############################NSPOrg############################
echo "For Peer of NspOrg"

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="NspOrgMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/nsporg.isp.com/peers/peer0.nsporg.isp.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/nsporg.isp.com/users/Admin@nsporg.isp.com/msp
export CORE_PEER_ADDRESS=localhost:7051

export FABRIC_CFG_PATH=$PWD/peercfg/

#To join the peer to the channel
peer channel join -b ./channel-artifacts/isp-channel.block
sleep 2

#############################EIOrg############################
echo "For Peer of EIOrg"

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="EiOrgMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/eiorg.isp.com/peers/peer0.eiorg.isp.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/eiorg.isp.com/users/Admin@eiorg.isp.com/msp
export CORE_PEER_ADDRESS=localhost:9051

export FABRIC_CFG_PATH=$PWD/peercfg/

#To join the peer to the channel
peer channel join -b ./channel-artifacts/isp-channel.block
sleep 2

#############################SchOrg############################
echo "For Peer of SchOrg"

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="SchOrgMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/schorg.isp.com/peers/peer0.schorg.isp.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/schorg.isp.com/users/Admin@schorg.isp.com/msp
export CORE_PEER_ADDRESS=localhost:8051

export FABRIC_CFG_PATH=$PWD/peercfg/

#To join the peer to the channel
peer channel join -b ./channel-artifacts/isp-channel.block
sleep 2

#########################Set anchor peer#######################
echo "Set anchor peer"

##############################NSPOrg#############################
echo "Peer from NspOrg"

export CORE_PEER_LOCALMSPID="NspOrgMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/nsporg.isp.com/peers/peer0.nsporg.isp.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/nsporg.isp.com/users/Admin@nsporg.isp.com/msp
export CORE_PEER_ADDRESS=localhost:7051

#Check Channel Configuration
peer channel fetch config channel-artifacts/config_block.pb -o localhost:7050 --ordererTLSHostnameOverride orderer.isp.com -c isp-channel --tls --cafile "$ORDERER_CA"

cd channel-artifacts

configtxlator proto_decode --input config_block.pb --type common.Block --output config_block.json
jq '.data.data[0].payload.data.config' config_block.json > config.json

cp config.json config_copy.json

jq '.channel_group.groups.Application.groups.NspOrgMSP.values += {"AnchorPeers":{"mod_policy": "Admins","value":{"anchor_peers": [{"host": "peer0.nsporg.isp.com","port": 7051}]},"version": "0"}}' config_copy.json > modified_config.json

configtxlator proto_encode --input config.json --type common.Config --output config.pb
configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb
configtxlator compute_update --channel_id isp-channel --original config.pb --updated modified_config.pb --output config_update.pb

configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"isp-channel", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . > config_update_in_envelope.json
configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output config_update_in_envelope.pb

cd ..

peer channel update -f channel-artifacts/config_update_in_envelope.pb -c isp-channel -o localhost:7050  --ordererTLSHostnameOverride orderer.isp.com --tls --cafile "${PWD}/organizations/ordererOrganizations/isp.com/orderers/orderer.isp.com/msp/tlscacerts/tlsca.isp.com-cert.pem"
sleep 3


##############################EIOrg#############################
echo "Peer from EiOrg"

export CORE_PEER_LOCALMSPID="EiOrgMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/eiorg.isp.com/peers/peer0.eiorg.isp.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/eiorg.isp.com/users/Admin@eiorg.isp.com/msp
export CORE_PEER_ADDRESS=localhost:9051

peer channel fetch config channel-artifacts/config_block.pb -o localhost:7050 --ordererTLSHostnameOverride orderer.isp.com -c isp-channel --tls --cafile "$ORDERER_CA"

cd channel-artifacts

configtxlator proto_decode --input config_block.pb --type common.Block --output config_block.json
jq '.data.data[0].payload.data.config' config_block.json > config.json

cp config.json config_copy.json

jq '.channel_group.groups.Application.groups.EiOrgMSP.values += {"AnchorPeers":{"mod_policy": "Admins","value":{"anchor_peers": [{"host": "peer0.eiorg.isp.com","port": 9051}]},"version": "0"}}' config_copy.json > modified_config.json

configtxlator proto_encode --input config.json --type common.Config --output config.pb
configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb
configtxlator compute_update --channel_id isp-channel --original config.pb --updated modified_config.pb --output config_update.pb

configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"isp-channel", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . > config_update_in_envelope.json
configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output config_update_in_envelope.pb

cd ..

peer channel update -f channel-artifacts/config_update_in_envelope.pb -c isp-channel -o localhost:7050  --ordererTLSHostnameOverride orderer.isp.com --tls --cafile "${PWD}/organizations/ordererOrganizations/isp.com/orderers/orderer.isp.com/msp/tlscacerts/tlsca.isp.com-cert.pem"
sleep 3

##############################SchOrg##############################
echo "Peer from SchOrg"

export CORE_PEER_LOCALMSPID="SchOrgMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/schorg.isp.com/peers/peer0.schorg.isp.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/schorg.isp.com/users/Admin@schorg.isp.com/msp
export CORE_PEER_ADDRESS=localhost:8051

#Check Channel Configuration
peer channel fetch config channel-artifacts/config_block.pb -o localhost:7050 --ordererTLSHostnameOverride orderer.isp.com -c isp-channel --tls --cafile "$ORDERER_CA"

cd channel-artifacts

configtxlator proto_decode --input config_block.pb --type common.Block --output config_block.json
jq '.data.data[0].payload.data.config' config_block.json > config.json

cp config.json config_copy.json

jq '.channel_group.groups.Application.groups.SchOrgMSP.values += {"AnchorPeers":{"mod_policy": "Admins","value":{"anchor_peers": [{"host": "peer0.schorg.isp.com","port": 8051}]},"version": "0"}}' config_copy.json > modified_config.json

configtxlator proto_encode --input config.json --type common.Config --output config.pb
configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb
configtxlator compute_update --channel_id isp-channel --original config.pb --updated modified_config.pb --output config_update.pb

configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"isp-channel", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . > config_update_in_envelope.json
configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output config_update_in_envelope.pb

cd ..

peer channel update -f channel-artifacts/config_update_in_envelope.pb -c isp-channel -o localhost:7050  --ordererTLSHostnameOverride orderer.isp.com --tls --cafile "${PWD}/organizations/ordererOrganizations/isp.com/orderers/orderer.isp.com/msp/tlscacerts/tlsca.isp.com-cert.pem"
sleep 3

# rm -rf organizations/			
# docker-compose -f docker/compose-ca.yaml down
# docker-compose -f docker/compose-test-net.yaml down
# docker volume rm $(docker volume ls -q)
# docker container prune
