package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// ApplicantContract implements the chaincode for managing applicants
type ApplicantContract struct {
	contractapi.Contract
}

// Applicant struct defines the attributes of an applicant
type Applicant struct {
	ApplicantId   string `json:"applicantId"`
	AadhaarNo     string `json:"aadhaarNo"`
	ApplicantName string `json:"applicantName"`
	Gender        string `json:"gender"`
	Dob           string `json:"dob"` // Stored as string since Fabric does not support time.Time
	MobileNo      string `json:"mobileNo"`
	EmailId       string `json:"emailId"`
	Address       string `json:"address"`
	Ifsc          string `json:"ifsc"`
	Pancard       string `json:"pancard"`
	AnnualIncome  string `json:"annualIncome"`
	CollegeName   string `json:"collegeName"`
	Branch        string `json:"branch"`
	CurrentYear   string `json:"currentYear"`
	BankName      string `json:"bankName"`
	AccountNumber string `json:"accountNumber"`
	PanNumber     string `json:"panNumber"`
}

// ApplicantExists checks if an applicant exists in the world state
func (c *ApplicantContract) ApplicantExists(ctx contractapi.TransactionContextInterface, applicantId string) (bool, error) {
	data, err := ctx.GetStub().GetState(applicantId)
	if err != nil {
		return false, err
	}
	return data != nil, nil
}

// CreateApplicant creates a new applicant in the world state
func (c *ApplicantContract) CreateApplicant(ctx contractapi.TransactionContextInterface, applicantId string, aadhaarNo string, applicantName string, gender string, dob string, mobileNo string, emailId string, address string, ifsc string, panNumber string, annualIncome string, collegeName string, branch string, currentYear string, bankName string, accountNumber string) error {
	exists, err := c.ApplicantExists(ctx, applicantId)
	if err != nil {
		return fmt.Errorf("could not read from world state: %s", err)
	} else if exists {
		return fmt.Errorf("the asset %s already exists", applicantId)
	}

	applicant := Applicant{
		ApplicantId:   applicantId,
		AadhaarNo:     aadhaarNo,
		ApplicantName: applicantName,
		Gender:        gender,
		Dob:           dob,
		MobileNo:      mobileNo,
		EmailId:       emailId,
		Address:       address,
		Ifsc:          ifsc,
		AnnualIncome:  annualIncome,
		CollegeName:   collegeName,
		Branch:        branch,
		CurrentYear:   currentYear,
		BankName:      bankName,
		AccountNumber: accountNumber,
		PanNumber:     panNumber,
	}

	bytes, err := json.Marshal(applicant)
	if err != nil {
		return fmt.Errorf("could not marshal applicant data: %s", err)
	}

	return ctx.GetStub().PutState(applicantId, bytes)
}

// ReadApplicant retrieves an applicant from the world state
func (c *ApplicantContract) ReadApplicant(ctx contractapi.TransactionContextInterface, applicantId string) (*Applicant, error) {
	exists, err := c.ApplicantExists(ctx, applicantId)
	if err != nil {
		return nil, fmt.Errorf("could not read from world state: %s", err)
	} else if !exists {
		return nil, fmt.Errorf("the asset %s does not exist", applicantId)
	}

	bytes, err := ctx.GetStub().GetState(applicantId)
	if err != nil {
		return nil, fmt.Errorf("failed to read world state: %s", err)
	}

	applicant := new(Applicant)
	err = json.Unmarshal(bytes, applicant)
	if err != nil {
		return nil, fmt.Errorf("could not unmarshal world state data to type Applicant: %s", err)
	}

	return applicant, nil
}

// UpdateApplicant updates an existing applicant in the world state
func (c *ApplicantContract) UpdateApplicant(ctx contractapi.TransactionContextInterface, applicantId string, aadhaarNo string, applicantName string, gender string, dob string, mobileNo string, emailId string, address string, ifsc string, annualIncome string, collegeName string, branch string, currentYear string, bankName string, accountNumber string, panNumber string) error {
	exists, err := c.ApplicantExists(ctx, applicantId)
	if err != nil {
		return fmt.Errorf("could not read from world state: %s", err)
	} else if !exists {
		return fmt.Errorf("the asset %s does not exist", applicantId)
	}

	applicant := Applicant{
		ApplicantId:   applicantId,
		AadhaarNo:     aadhaarNo,
		ApplicantName: applicantName,
		Gender:        gender,
		Dob:           dob,
		MobileNo:      mobileNo,
		EmailId:       emailId,
		Address:       address,
		Ifsc:          ifsc,
		AnnualIncome:  annualIncome,
		CollegeName:   collegeName,
		Branch:        branch,
		CurrentYear:   currentYear,
		BankName:      bankName,
		AccountNumber: accountNumber,
		PanNumber:     panNumber,
	}

	bytes, err := json.Marshal(applicant)
	if err != nil {
		return fmt.Errorf("could not marshal applicant data: %s", err)
	}

	return ctx.GetStub().PutState(applicantId, bytes)
}

// DeleteApplicant deletes an applicant from the world state
func (c *ApplicantContract) DeleteApplicant(ctx contractapi.TransactionContextInterface, applicantId string) error {
	exists, err := c.ApplicantExists(ctx, applicantId)
	if err != nil {
		return fmt.Errorf("could not read from world state: %s", err)
	} else if !exists {
		return fmt.Errorf("the asset %s does not exist", applicantId)
	}

	return ctx.GetStub().DelState(applicantId)
}
