package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type EIContract struct {
	contractapi.Contract
}
type EI struct {
	HEIid        string `json:"HEIid"`
	EIid         string `json:"EIid"`
	TanNumber    string `json:"TanNumber"`
	PanNumber    string `json:"PanNumber"`
	MobileNumber string `json:"MobileNumber"`
	Email        string `json:"Email"`
	Collegename  string `json:"Collegename"`
	Address      string `json:"Address"`
	City         string `json:"City"`
	State        string `json:"State"`
}

// EIExists returns true when asset with given ID exists in world state
func (c *EIContract) EIExists(ctx contractapi.TransactionContextInterface, eiId string) (bool, error) {
	data, err := ctx.GetStub().GetState(eiId)
	if err != nil {
		return false, err
	}
	return data != nil, nil
}

// CreateEI creates a new instance of EI
func (c *EIContract) CreateEI(ctx contractapi.TransactionContextInterface, heiId string, eiId string, tanNumber string, panNumber string, MobileNumber string, email string, collegeName string, address string, city string, state string) error {
	exists, err := c.EIExists(ctx, eiId)
	if err != nil {
		return fmt.Errorf("could not read from world state. %s", err)
	} else if exists {
		return fmt.Errorf("the asset %s already exists", eiId)
	}
	ei := EI{
		HEIid:        heiId,
		EIid:         eiId,
		TanNumber:    tanNumber,
		PanNumber:    panNumber,
		MobileNumber: MobileNumber,
		Email:        email,
		Collegename:  collegeName,
		Address:      address,
		City:         city,
		State:        state,
	}
	bytes, _ := json.Marshal(ei)

	return ctx.GetStub().PutState(eiId, bytes)
}

// ReadEI retrieves an instance of Institute from the world state
func (c *EIContract) ReadEI(ctx contractapi.TransactionContextInterface, eiId string) (*EI, error) {
	exists, err := c.EIExists(ctx, eiId)
	if err != nil {
		return nil, fmt.Errorf("could not read from world state. %s", err)
	} else if !exists {
		return nil, fmt.Errorf("the asset %s does not exist", eiId)
	}
	bytes, _ := ctx.GetStub().GetState(eiId)
	ei := new(EI)
	err = json.Unmarshal(bytes, ei)
	if err != nil {
		return nil, fmt.Errorf("could not unmarshal world state data to type ei")
	}
	return ei, nil
}

// UpdateEI retrieves an instance of Institute from the world state and updates its value
func (c *EIContract) UpdateEI(ctx contractapi.TransactionContextInterface, heiId string, eiId string, tanNumber string, panNumber string, MobileNumber string, email string, collegeName string, address string, city string, state string) error {
	exists, err := c.EIExists(ctx, eiId)
	if err != nil {
		return fmt.Errorf("could not read from world state. %s", err)
	} else if !exists {
		return fmt.Errorf("the asset %s does not exist", eiId)
	}
	ei := EI{
		HEIid:        heiId,
		EIid:         eiId,
		TanNumber:    tanNumber,
		PanNumber:    panNumber,
		MobileNumber: MobileNumber,
		Email:        email,
		Collegename:  collegeName,
		Address:      address,
		City:         city,
		State:        state,
	}

	bytes, _ := json.Marshal(ei)
	return ctx.GetStub().PutState(eiId, bytes)
}

// DeleteEI deletes an instance of Institute from the world state
func (c *EIContract) DeleteEI(ctx contractapi.TransactionContextInterface, eiId string) error {
	exists, err := c.EIExists(ctx, eiId)
	if err != nil {
		return fmt.Errorf("could not read from world state. %s", err)
	} else if !exists {
		return fmt.Errorf("the asset %s does not exist", eiId)
	}
	return ctx.GetStub().DelState(eiId)
}
