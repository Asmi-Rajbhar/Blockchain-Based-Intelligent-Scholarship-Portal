/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"log"
	chaincode "nsp_chaincode/smartcontracts"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func main() {
	applicantContract := new(chaincode.ApplicantContract)
	eiContract := new(chaincode.EIContract)
	scholarshipContract := new(chaincode.ScholarshipContract)

	chaincode, err := contractapi.NewChaincode(applicantContract, eiContract, scholarshipContract)
	if err != nil {
		log.Panicf("Error creating asset-transfer-basic chaincode: %v", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panicf("Error starting asset-transfer-basic chaincode: %v", err)
	}
}
