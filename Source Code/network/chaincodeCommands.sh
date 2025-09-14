#!/bin/bash

export FABRIC_CFG_PATH=$PWD/peercfg

###################################Deploy Smart Contract to the channel######################
peer channel getinfo -c isp-channel

####################peer lifecycle chaincode package command####################
peer lifecycle chaincode package chaincodeFile.tar.gz --path ../chaincodeFile --lang golang --label chaincode_1.0


###############################Install the chaincode package###################################

############################NSPOrg############################
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="NspOrgMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/nsporg.isp.com/peers/peer0.nsporg.isp.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/nsporg.isp.com/users/Admin@nsporg.isp.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode install chaincodeFile.tar.gz


#############################EIOrg############################
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="EiOrgMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/eiorg.isp.com/peers/peer0.eiorg.isp.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/eiorg.isp.com/users/Admin@eiorg.isp.com/msp
export CORE_PEER_ADDRESS=localhost:9051

peer lifecycle chaincode install chaincodeFile.tar.gz

#############################SchOrg############################
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="SchOrgMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/schorg.isp.com/peers/peer0.schorg.isp.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/schorg.isp.com/users/Admin@schorg.isp.com/msp
export CORE_PEER_ADDRESS=localhost:8051

peer lifecycle chaincode install chaincodeFile.tar.gz


##############################Approve a chaincode definition###################################
#########it is recommended that all channel members approve a chaincode before committing the chaincode definition.#################
peer lifecycle chaincode queryinstalled

export CC_PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep "chaincode_1.0" | sed -n 's/^Package ID: //; s/, Label:.*$//p')

############################NSPOrg############################
export CORE_PEER_LOCALMSPID="NspOrgMSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/nsporg.isp.com/users/Admin@nsporg.isp.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/nsporg.isp.com/peers/peer0.nsporg.isp.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7051

##Remember to update the sequence number while rerunning the chaincode in the network
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.isp.com --channelID isp-channel --name chaincodeFile --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/isp.com/orderers/orderer.isp.com/msp/tlscacerts/tlsca.isp.com-cert.pem"

#############################EIOrg############################
export CORE_PEER_LOCALMSPID="EiOrgMSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/eiorg.isp.com/users/Admin@eiorg.isp.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/eiorg.isp.com/peers/peer0.eiorg.isp.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:9051

##Remember to update the sequence number while rerunning the chaincode in the network
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.isp.com --channelID isp-channel --name chaincodeFile --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/isp.com/orderers/orderer.isp.com/msp/tlscacerts/tlsca.isp.com-cert.pem"

#############################SchOrg############################
export CORE_PEER_LOCALMSPID="SchOrgMSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/schorg.isp.com/users/Admin@schorg.isp.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/schorg.isp.com/peers/peer0.schorg.isp.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:8051

##Remember to update the sequence number while rerunning the chaincode in the network
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.isp.com --channelID isp-channel --name chaincodeFile --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/isp.com/orderers/orderer.isp.com/msp/tlscacerts/tlsca.isp.com-cert.pem"


##########Check whether channel members have approved the same chaincode definition#########################
peer lifecycle chaincode checkcommitreadiness --channelID isp-channel --name chaincodeFile --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/isp.com/orderers/orderer.isp.com/msp/tlscacerts/tlsca.isp.com-cert.pem" --output json

############Commit the chaincode definition to the channel###########################
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.isp.com --channelID isp-channel --name chaincodeFile --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/isp.com/orderers/orderer.isp.com/msp/tlscacerts/tlsca.isp.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/nsporg.isp.com/peers/peer0.nsporg.isp.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/eiorg.isp.com/peers/peer0.eiorg.isp.com/tls/ca.crt" --peerAddresses localhost:8051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/schorg.isp.com/peers/peer0.schorg.isp.com/tls/ca.crt"


###########Command to confirm that the chaincode definition has been committed to the channel########
peer lifecycle chaincode querycommitted --channelID isp-channel --name chaincodeFile --cafile "${PWD}/organizations/ordererOrganizations/isp.com/orderers/orderer.isp.com/msp/tlscacerts/tlsca.isp.com-cert.pem"




