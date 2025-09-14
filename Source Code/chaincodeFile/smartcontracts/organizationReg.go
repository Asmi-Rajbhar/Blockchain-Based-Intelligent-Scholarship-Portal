package chaincode

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// ScholarshipContract defines the Smart Contract structure
type ScholarshipContract struct {
	contractapi.Contract
}

// Scholarship represents the data structure for an Scholarship
type Scholarship struct {
	RegistrationId    string    `json:"RegistrationId"`
	OrganizationId    string    `json:"OrganizationId"`
	OrganizationName  string    `json:"OrganizationName"`
	ScholarshipAmount float64   `json:"ScholarshipAmount"`
	AcademicYear      int       `json:"AcademicYear"`
	ScholarshipName   string    `json:"ScholarshipName"`
	IncomeCriteria    float64   `json:"IncomeCriteria"`
	AgeLimit          int       `json:"AgeLimit"`
	FieldofStudy      string    `json:"FieldofStudy"`
	HscScore          float64   `json:"HscScore"`
	SscScore          float64   `json:"SscScore"`
	Religion          string    `json:"Religion"`
	Caste             string    `json:"Caste"`
	StartDate         time.Time `json:"StartDate"`
	EndDate           time.Time `json:"EndDate"`
	OfficialUrl       string    `json:"OfficialUrl"`
	ScholarshipId     string    `json:"ScholarshipId"`
}

// ScholarshipExists returns true when an Scholarship with the given ID exists in the world state
func (c *ScholarshipContract) ScholarshipExists(ctx contractapi.TransactionContextInterface, scholarshipId string) (bool, error) {
	data, err := ctx.GetStub().GetState(scholarshipId)
	if err != nil {
		return false, err
	}
	return data != nil, nil
}

// CreateScholarship creates a new instance of Scholarship
func (c *ScholarshipContract) CreateScholarship(ctx contractapi.TransactionContextInterface, registrationId string, organizationId string, organizationName string, scholarshipAmount float64, academicYear int, scholarshipId string, scholarshipName string, incomeCriteria float64, ageLimit int, fieldofStudy string, hscScore float64, sscScore float64, religion string, caste string, startDate time.Time, endDate time.Time, officialUrl string) error {
	exists, err := c.ScholarshipExists(ctx, scholarshipId)
	if err != nil {
		return fmt.Errorf("could not read from world state: %s", err)
	} else if exists {
		return fmt.Errorf("the scholarship %s already exists", scholarshipId)
	}

	scholarship := Scholarship{
		RegistrationId:    registrationId,
		OrganizationId:    organizationId,
		OrganizationName:  organizationName,
		ScholarshipAmount: scholarshipAmount,
		AcademicYear:      academicYear,
		ScholarshipName:   scholarshipName,
		IncomeCriteria:    incomeCriteria,
		AgeLimit:          ageLimit,
		FieldofStudy:      fieldofStudy,
		HscScore:          hscScore,
		SscScore:          sscScore,
		Religion:          religion,
		Caste:             caste,
		StartDate:         startDate,
		EndDate:           endDate,
		OfficialUrl:       officialUrl,
		ScholarshipId:     scholarshipId,
	}
	bytes, err := json.Marshal(scholarship)
	if err != nil {
		return fmt.Errorf("could not marshal scholarship data: %s", err)
	}

	return ctx.GetStub().PutState(scholarshipId, bytes)
}

// ReadScholarship retrieves an instance of Scholarship from the world state
func (c *ScholarshipContract) ReadScholarship(ctx contractapi.TransactionContextInterface, scholarshipId string) (*Scholarship, error) {
	exists, err := c.ScholarshipExists(ctx, scholarshipId)
	if err != nil {
		return nil, fmt.Errorf("could not read from world state: %s", err)
	} else if !exists {
		return nil, fmt.Errorf("the scholarship %s does not exist", scholarshipId)
	}

	bytes, err := ctx.GetStub().GetState(scholarshipId)
	if err != nil {
		return nil, fmt.Errorf("could not retrieve data from world state: %s", err)
	}

	if bytes == nil {
		return nil, fmt.Errorf("no data found for the scholarship %s", scholarshipId)
	}

	scholarship := new(Scholarship)
	err = json.Unmarshal(bytes, scholarship)
	if err != nil {
		return nil, fmt.Errorf("could not unmarshal world state data to type Scholarship: %s", err)
	}

	return scholarship, nil
}

// UpdateScholarship retrieves an instance of Scholarship from the world state and updates its value
func (c *ScholarshipContract) UpdateScholarship(ctx contractapi.TransactionContextInterface, organizationId string, organizationName string, scholarshipAmount float64, academicYear int, scholarshipId string, scholarshipName string, incomeCriteria float64, ageLimit int, fieldofStudy string, hscScore float64, sscScore float64, religion string, caste string, startDate time.Time, endDate time.Time, officialUrl string) error {
	exists, err := c.ScholarshipExists(ctx, scholarshipId)
	if err != nil {
		return fmt.Errorf("could not read from world state: %s", err)
	} else if !exists {
		return fmt.Errorf("the scholarship %s does not exist", scholarshipId)
	}

	scholarship := Scholarship{
		OrganizationId:    organizationId,
		OrganizationName:  organizationName,
		ScholarshipAmount: scholarshipAmount,
		AcademicYear:      academicYear,
		ScholarshipId:     scholarshipId,
		ScholarshipName:   scholarshipName,
		IncomeCriteria:    incomeCriteria,
		AgeLimit:          ageLimit,
		FieldofStudy:      fieldofStudy,
		HscScore:          hscScore,
		SscScore:          sscScore,
		Religion:          religion,
		Caste:             caste,
		StartDate:         startDate,
		EndDate:           endDate,
		OfficialUrl:       officialUrl,
	}
	bytes, err := json.Marshal(scholarship)
	if err != nil {
		return fmt.Errorf("could not marshal scholarship data: %s", err)
	}

	return ctx.GetStub().PutState(scholarshipId, bytes)
}

// DeleteScholarship deletes an instance of Scholarship from the world state
func (c *ScholarshipContract) DeleteScholarship(ctx contractapi.TransactionContextInterface, scholarshipId string) error {
	exists, err := c.ScholarshipExists(ctx, scholarshipId)
	if err != nil {
		return fmt.Errorf("could not read from world state: %s", err)
	} else if !exists {
		return fmt.Errorf("the scholarship %s does not exist", scholarshipId)
	}

	return ctx.GetStub().DelState(scholarshipId)
}
