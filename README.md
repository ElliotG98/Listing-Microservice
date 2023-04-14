# Listing Microservice

The Listing Microservice is a Node.js application built using the AWS Cloud Development Kit (CDK) that provides a simple way to manage listings. This microservice allows users to create, read, update and delete listings.

## Installation

To install the Listing Microservice, follow these steps:

-   Clone the repository: git clone https://github.com/example/listing-microservice.git
-   Install dependencies: npm install
-   Configure AWS credentials: aws configure
-   Deploy the microservice: cdk deploy

## Usage

The Listing Microservice exposes a RESTful API that allows users to manage listings. The following endpoints are available:

-   GET /listing - get a list of all listings
-   GET /listings/:id - get a specific listing by ID
-   POST /listings - create a new listing
-   PUT /listing/:id - update an existing listing
-   DELETE /listing/:id - delete a listing

To create a new listing, send a POST request to /listings with the following JSON payload:

```json
{
    "title": "Example Listing",
    "description": "This is an example listing",
    "askingForMin": 1000,
    "askingForMax": 1200,
    "comments": [
        {
            "message": "Wow cool listing",
            "profile": {},
            "postedAt": "'2023-04-14T07:52:51.167Z'"
        }
    ],
    "offers": [
        {
            "message": "I'll make you an offer",
            "offer": 1000,
            "profile": {},
            "postedAt": "'2023-04-14T07:52:51.167Z'"
        }
    ],
    "media": [],
    "profile": {}
}
```

## Deployment

To deploy the Listing Microservice, follow these steps:

-   Configure AWS credentials: aws configure
-   Validate CDK is working correctly: cdk ls
-   Deploy the microservice: cdk deploy

## Testing

To run tests for the Listing Microservice, follow these steps:

-   Install dependencies: npm install
-   Run tests: npm t
